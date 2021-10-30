import { model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { Server, SystemUser, SSHKey } from 'models'
import { createServerActivityLogInfo } from 'services/activity.service'
import * as activitySvc from 'services/activity.service'
// const ServiceModel = model<Service>('Service')
const SystemUserModel = model<SystemUser>('SystemUser')
const SSHKeyModel = model<SSHKey>('SSHKey')
const CronJobModel = model<SSHKey>('CronJob')
// const { getServer } = require('./server-service')
// const { getUser } = require('./auth')
// const SSHKey = mongoose.model('SSHKey')
// const ServerSSHKey = mongoose.model('ServerSSHKey')
// const CronJob = mongoose.model('CronJob')
// const agent = require('./agent')

export async function getSystemUsers(server: Server) {
  const users = await SystemUserModel.find({ server: server.id })
  return {
    success: true,
    data: { users: users.map((it) => it.getJson()) },
  }
}

export async function getSystemUserById(server: Server, userId: string) {
  const user = await SystemUserModel.findById(userId)
  return {
    success: true,
    data: { user: user },
  }
}

export async function createSystemUser(server: Server, data: any) {}

export async function storeSystemUser(server: Server, data: any) {
  const exists = await SystemUserModel.findOne({
    server: server.id,
    name: data.name,
  })
  if (exists) {
    return {
      success: false,
      errors: { message: 'Name has already been taken.' },
    }
  }

  /*const response = await agentService.createSystemUser(data)
  if (!response.success) {
    return {
      success: false,
      errors: response.errors,
    }
  }*/

  const user = new SystemUserModel(data)
  user.server = server
  await user.save()

  const message = `Added new system user ${user.name} with password`
  await createServerActivityLogInfo(server.id, message)

  return {
    success: true,
    data: { user: user },
  }
}

export async function deleteSystemUser(server: Server, userId: string) {
  const user = await SystemUserModel.findById(userId)
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
  await createServerActivityLogInfo(server, message)

  return {
    success: true,
    data: { id: userId },
  }
}

export async function changeSystemUserPassword(
  server: Server,
  userId: string,
  password: string
) {
  const user = await SystemUserModel.findById(userId)
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

  user.password = password
  await user.save()

  const message = `Changed password for system user ${user.name}`
  await createServerActivityLogInfo(server, message)

  return {
    success: true,
    data: { id: userId },
  }
}

export async function getServerSSHKeys(server: Server) {
  const sshKeys = await SSHKeyModel.find({ server: server.id }).populate('user')
  console.log('sshKeys', sshKeys)

  return {
    success: true,
    data: {
      sshKeys: sshKeys.map((it) => {
        const item = {
          id: it.id,
          userId: it.user.id,
          userName: it.user.name,
          label: it.label,
          publicKey: it.publicKey,
        }
        return item
      }),
    },
  }
}

export async function createServerSSHKey(server: Server) {
  const systemUsers = await SystemUserModel.find({
    server: server.id,
  })
  return {
    success: true,
    data: {
      systemusers: systemUsers.map((it) => it.getJson()),
    },
  }
}

export async function storeServerSSHKey(server: Server, data: any) {
  const exists = await SSHKeyModel.find({
    server: server.id,
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

  const sshkey = new SSHKeyModel(data)
  sshkey.server = server.id
  sshkey.user = data.userId
  await sshkey.save()

  const message = `Added new SSH key ${data.label} with user ${data.userId}`
  await createServerActivityLogInfo(server.id, message)

  return {
    success: true,
    data: { sshkey: sshkey },
  }
}

export async function deleteServerSSHKey(server: Server, keyId: string) {
  console.log('deleteServerSSHKey', keyId)
  const sshKey = await SSHKeyModel.findById(keyId)
  if (!sshKey) {
    throw Error("It doesn't exists")
  }

  await sshKey.remove()

  const message = `Deleted SSH Key ${sshKey.label}`
  await activitySvc.createServerActivityLogInfo(server, message, 1)

  return {
    success: true,
    data: { id: keyId },
  }
}

export async function getDeploymentKeys(server: Server) {
  const users = await SystemUserModel.find({ server })
  return {
    success: true,
    data: {
      keys: users.map((it) => it.toDeploymentKeyJson()),
    },
  }
}

export async function storeDeploymentKey(server: Server, userId: string) {
  const user = await SystemUserModel.findById(userId)
  if (!user) {
    return {
      success: false,
      errors: { userId: "doesn't exists." },
    }
  }

  const deploymentKey = `TEST_PUBLIC_KEY_${userId}_${uuidv4()}`

  // errors = await agent.storeDeploymentKey(userId, deploymentKey)
  // if (errors) {
  //   return { success: false, errors: errors }
  // }

  user.deploymentKey = deploymentKey
  await user.save()

  const message = `Created new deployment key for system user ${user.name}`
  await createServerActivityLogInfo(server.id, message)

  return {
    success: true,
    data: { key: deploymentKey },
  }
}

export async function getCronJobList(server: Server) {
  const cronjobs = await CronJobModel.find({ serverId: server.id })
  return {
    success: true,
    data: { cronjobs },
  }
}

export async function getCronJobById(jobId: string) {
  const cronjob = await CronJobModel.findById(jobId)
  return {
    success: true,
    data: { cronjob },
  }
}

export async function storeCronJob(server: Server, data: any) {
  const exists = await CronJobModel.findOne({
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

  const cronjob = new CronJobModel(data)
  cronjob.server = server.id
  await cronjob.save()

  const message = `Added new Cron Job ${data.label}`
  await createServerActivityLogInfo(server.id, message)

  return {
    success: true,
    message: 'It has been successfully created.',
  }
}

export async function getPhpVersions(server: Server) {
  return {
    success: true,
    data: {
      phpVersion: '7.2',
      versions: ['7.2', '7.4', '8.0'],
    },
  }
}

export async function getSystemServices(server: Server) {
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
}

// export async function changeSystemUserPassword(req: Request, res: Response) {
//   try {
//     let errors = valiator.validationResult(req)
//     if (!errors.isEmpty()) {
//       return res.status(422).json({ success: false, errors: errors.array() })
//     }

//     await SystemUserModel.findByIdAndUpdate(
//       req.body.id,
//       { $set: { password: req.body.password } },
//       { upsert: true },
//       function (err, result) {
//         if (err) {
//           return res.status(422).json({
//             success: false,
//             errors: err,
//           })
//         } else {
//           res.json({
//             success: true,
//             data: result,
//           })
//         }
//       }
//     )

//     let server = req.server
//     let user = await SystemUserModel.findById(req.body.id)
//     if (!user) {
//       return res.status(422).json({
//         success: false,
//         errors: { message: "User isn't exists" },
//       })
//     }

//     // errors = await agent.changeSystemUserPassword(user.name, req.body.password)
//     // if (errors) {
//     //   return res.status(422).json({
//     //     success: false,
//     //     errors: errors
//     //   })
//     // }

//     const message = `The password for system user ${user.name} is changed`
//     await createServerActivityLogInfo(server.id, message)

//     res.json({
//       success: true,
//       message: 'Password has been successfully changed.',
//     })
//   } catch (e) {
//     console.error(e)
//     return res.status(501).json({ success: false })
//   }
// }

// export async function getVaultedSSHKeys(req: Request, res: Response) {
//   try {
//     const sshKeys = await SSHKey.find({ userId: req.payload.id })

//     res.json({
//       success: true,
//       data: {
//         sshKeys: sshKeys,
//         // sshKeys: sshKeys.map(it => it.name)
//       },
//     })
//   } catch (error) {
//     return res.status(501).json({
//       success: false,
//       errors: error,
//     })
//   }
// }

// export async function deleteVaultedSSHKey(req: Request, res: Response) {
//   try {
//     await SSHKey.deleteOne({
//       userId: req.payload.id,
//       id: req.params.keyId,
//     })

//     res.json({
//       success: true,
//       message: 'SSH Key has been successfully deleted.',
//     })
//   } catch (error) {
//     return res.status(501).json({
//       success: false,
//       errors: error,
//     })
//   }
// }
