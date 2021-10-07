const valiator = require('express-validator')
const uuid = require('uuid')
const { getServer } = require('./server-service')
const { getUser } = require('./auth')
const mongoose = require('mongoose')
const Service = mongoose.model('Service')
const SystemUser = mongoose.model('SystemUser')
const SSHKey = mongoose.model('SSHKey')
const ServerSSHKey = mongoose.model('ServerSSHKey')
const CronJob = mongoose.model('CronJob')
const agent = require('./agent')
const activity = require('./activity-service')

const changeSystemUserPassword = async function (req: Request, res: Response) {
  try {
    let errors = valiator.validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() })
    }

    await SystemUser.findByIdAndUpdate(
      req.body.id,
      { $set: { password: req.body.password } },
      { upsert: true },
      function (err, result) {
        if (err) {
          return res.status(422).json({
            success: false,
            errors: err,
          })
        } else {
          res.json({
            success: true,
            data: result,
          })
        }
      }
    )

    let server = req.server
    let user = await SystemUser.findById(req.body.id)
    if (!user) {
      return res.status(422).json({
        success: false,
        errors: { message: "User isn't exists" },
      })
    }

    // errors = await agent.changeSystemUserPassword(user.name, req.body.password)
    // if (errors) {
    //   return res.status(422).json({
    //     success: false,
    //     errors: errors
    //   })
    // }

    const message = `The password for system user ${user.name} is changed`
    await activity.createServerActivityLogInfo(server.id, message)

    res.json({
      success: true,
      message: 'Password has been successfully changed.',
    })
  } catch (e) {
    console.error(e)
    return res.status(501).json({ success: false })
  }
}

const getVaultedSSHKeys = async function (req: Request, res: Response) {
  try {
    const sshKeys = await SSHKey.find({ userId: req.payload.id })

    res.json({
      success: true,
      data: {
        sshKeys: sshKeys,
        // sshKeys: sshKeys.map(it => it.name)
      },
    })
  } catch (error) {
    return res.status(501).json({
      success: false,
      errors: error,
    })
  }
}

const deleteVaultedSSHKey = async function (req: Request, res: Response) {
  try {
    await SSHKey.deleteOne({
      userId: req.payload.id,
      id: req.params.keyId,
    })

    res.json({
      success: true,
      message: 'SSH Key has been successfully deleted.',
    })
  } catch (error) {
    return res.status(501).json({
      success: false,
      errors: error,
    })
  }
}

export default {
  getSystemUsers: async function (server) {
    const users = await SystemUser.find({ serverId: server.id })
    return {
      success: true,
      data: { users: users.map((it) => it.getJson()) },
    }
  },

  getSystemUserById: async function (server, userId) {
    const users = await SystemUser.find({
      serverId: server.id,
      _id: userId,
    })
    return {
      success: true,
      data: { users: users },
    }
  },

  createSystemUser: async function (server, data) {},

  storeSystemUser: async function (server, data) {
    const exists = await SystemUser.findOne({
      serverId: server.id,
      name: data.name,
    })
    if (exists) {
      return {
        success: false,
        errors: { message: 'Name has already been taken.' },
      }
    }

    const response = await agent.createSystemUser(data)
    if (!response.success) {
      return res.status(422).json({
        success: false,
        errors: errors,
      })
    }

    const user = new SystemUser(data)
    user.serverId = server.id
    await user.save()

    const message = `Added new system user ${user.name} with password`
    await activity.createServerActivityLogInfo(server.id, message)

    return {
      success: true,
      data: { user: user },
    }
  },

  changeSystemUserPassword,

  deleteSystemUser: async function (server, userId) {
    const user = await SystemUser.findById(userId)
    if (!user) {
      return {
        success: false,
        errors: { message: "It doesn't exists" },
      }
    }

    // errors = await agent.deleteSystemUser(user.name)
    // if (errors) {
    //   return { success: false, errors: errors }
    // }

    await user.remove()

    const message = `Deleted system user ${user.name}`
    await activity.createServerActivityLogInfo(server.id, message)

    return {
      success: true,
      data: { id: userId },
    }
  },

  getServerSSHKeys: async function (server) {
    const sshKeys = await ServerSSHKey.find({ serverId: server.id })

    return {
      success: true,
      data: {
        sshKeys: sshKeys,
        // sshKeys: sshKeys.map(it => it.name)
      },
    }
  },

  getVaultedSSHKeys,

  createServerSSHKey: async function (server) {
    const systemusers = await SystemUser.find({
      serverId: server.id,
    })
    return {
      success: true,
      data: {
        systemusers: systemusers.map((it) => it.getJson()),
      },
    }
  },

  storeServerSSHKey: async function (server, data) {
    const exists = await ServerSSHKey.find({
      serverId: server.id,
      label: data.label,
    })
    if (exists && exists.length > 0) {
      return {
        success: false,
        errors: { message: 'Label is duplicated' },
      }
    }

    /*errors = await agent.createSSHKey(data)
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors
      })
    }*/

    const sshkey = new ServerSSHKey(data)
    sshkey.serverId = server.id
    await sshkey.save()

    const message = `Added new SSH key ${data.label} with user ${data.userId}`
    await activity.createServerActivityLogInfo(server.id, message)

    return {
      success: true,
      data: { sshkey: sshkey },
    }
  },

  deleteServerSSHKey: async function (server, keyId) {
    const result = await SSHKey.deleteOne({
      serverId: server.id,
      id: req.params.keyId,
    })

    return {
      success: true,
      data: { id: keyId },
    }
  },

  deleteVaultedSSHKey,

  getDeploymentKeys: async function (server) {
    const users = await SystemUser.find({ serverId: server.id })
    return {
      success: true,
      data: { keys: users.map((it) => it.toDeploymentKeyJson()) },
    }
  },

  storeDeploymentKey: async function (server, userId) {
    const user = await SystemUser.findById(userId)
    if (!user) {
      return {
        success: false,
        errors: { userId: "doesn't exists." },
      }
    }

    const deploymentKey = `TEST_PUBLIC_KEY_${userId}_${uuid.v4()}`

    // errors = await agent.storeDeploymentKey(userId, deploymentKey)
    // if (errors) {
    //   return { success: false, errors: errors }
    // }

    user.deploymentKey = deploymentKey
    await user.save()

    const message = `Created new deployment key for system user ${user.name}`
    await activity.createServerActivityLogInfo(server.id, message)

    return {
      success: true,
      data: { key: deploymentKey },
    }
  },

  getCronJobList: async function (server) {
    const cronjobs = await CronJob.find({ serverId: server.id })
    return {
      success: true,
      data: { cronjobs },
    }
  },

  getCronJobById: async function (jobId) {
    const cronjob = await CronJob.findById(jobId)
    return {
      success: true,
      data: { cronjob },
    }
  },

  storeCronJob: async function (server, data) {
    const exists = await CronJob.findOne({
      serverId: server.id,
      label: data.label,
    })
    if (exists) {
      return {
        success: false,
        errors: { label: 'has already been taken.' },
      }
    }

    // errors = await agent.createCronJob(data)
    // if (errors) {
    //   return { success: false, errors: errors })
    // }

    data.time = [
      data.minute,
      data.hour,
      data.dayOfMonth,
      data.month,
      data.dayOfWeek,
    ].join(' ')
    console.log(data)

    const cronjob = new CronJob(data)
    cronjob.serverId = server.id
    await cronjob.save()

    const message = `Added new Cron Job ${data.label}`
    await activity.createServerActivityLogInfo(server.id, message)

    return {
      success: true,
      message: 'It has been successfully created.',
    }
  },

  getPhpVersions: async function (server) {
    return {
      success: true,
      data: {
        phpVersion: '7.2',
        versions: ['7.2', '7.4', '8.0'],
      },
    }
  },

  getSystemServices: async function (server) {
    //const services = await Service.find({ serverId: server.id });
    const services = [
      {
        symbol: 'media/svg/misc/015-telegram.svg',
        service: 'Beanstalk',
        version: '1.11-1',
        processor_usage: '40%',
        memory_usage: '80MB',
        status: true,
        action: '',
      },
      {
        symbol: 'media/svg/misc/006-plurk.svg',
        service: 'Httpd/Apache',
        version: '2.4-3.3',
        processor_usage: '-',
        memory_usage: '-',
        status: false,
        action: 'ReactJs, HTML',
      },
      {
        symbol: 'media/svg/misc/003-puzzle.svg',
        service: 'MariaDB',
        version: '1.456-maria-focal',
        processor_usage: '-',
        memory_usage: '-',
        status: true,
        action: 'Laravel, Metronic',
      },
      {
        symbol: 'media/svg/misc/005-bebo.svg',
        service: 'Memcached',
        version: '1.525-2ubuntu0.1',
        processor_usage: '45%',
        memory_usage: '8GB',
        status: false,
        action: 'AngularJS, C#',
      },
    ]
    console.log('getSystemServices', services)
    return {
      success: true,
      data: { services },
    }
  },
}
