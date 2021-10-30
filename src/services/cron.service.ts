import { model } from 'mongoose'
import { Server, CronJob, Supervisor, SystemUser } from 'models'
import * as activity from 'services/activity.service'
//import * as agentSvc from 'services/agent.service'
const CronJobModel = model<CronJob>('CronJob')
const SupervisorModel = model<Supervisor>('Supervisor')
const SystemUserModel = model<SystemUser>('SystemUser')

// const rebuildJob = async function (req: Request, res: Response) {
//   try {
//     const cronjob = await CronJobModel.findById(req.params.jobId)
//     return res.json({
//       success: true,
//       data: { cronjob },
//     })
//   } catch (e) {
//     console.error(e)
//     return res.status(501).json({ success: false })
//   }
// }

const getVendorBinaries = function () {
  return [
    {
      value: 'php72',
      text: '/Litegix/Packages/php72/bin/php',
    },
    {
      value: 'php73',
      text: '/Litegix/Packages/php73/bin/php',
    },
    {
      value: 'php74',
      text: '/Litegix/Packages/php74/bin/php',
    },
    {
      value: 'php80',
      text: '/Litegix/Packages/php80/bin/php',
    },
    {
      value: 'node',
      text: '/user/bin/node',
    },
    {
      value: 'bash',
      text: '/bin/bash',
    },
  ]
}

const getPredefinedSettings = function () {
  return [
    {
      value: 'e1',
      text: 'Every Minutes',
    },
    {
      value: 'e10',
      text: 'Every 10 Minutes',
    },
    {
      value: 'e30',
      text: 'Every 30 Minutes',
    },
    {
      value: 'eh',
      text: 'Every Hours',
    },
    {
      value: 'mn',
      text: 'All midnight',
    },
    {
      value: 'ed',
      text: 'Every Day',
    },
    {
      value: 'ew',
      text: 'Every Week',
    },
    {
      value: 'em',
      text: 'Every Month',
    },
  ]
}

export async function getCronJobs(server: Server) {
  const cronJobs = await CronJobModel.find({ server }).populate('user')
  console.log('cronJobs', cronJobs)
  return {
    success: true,
    data: {
      cronJobs: cronJobs.map((it) => {
        const job = it.toJSON()
        return { ...job, user: it.user.name }
      }),
    },
  }
}

export async function getCronJob(jobId: string) {
  const cronjob = await CronJobModel.findById(jobId)
  return {
    success: true,
    data: { cronjob },
  }
}

export async function createCronJob(server: Server) {
  const systemUsers = await SystemUserModel.find({ server })
  return {
    success: true,
    system_users: systemUsers.map((user) => ({ id: user.id, name: user.name })),
    vendor_binaries: getVendorBinaries(),
    predefined_settings: getPredefinedSettings(),
  }
}

export async function storeCronJob(server: Server, data: any) {
  const exists = await CronJobModel.findOne({
    server,
    label: data.label,
  })
  if (exists) {
    throw new Error('Label has already been taken.')
  }

  /*const errors = await agent.createCronJob(data)
  if (errors) {
    return {
      success: false,
      errors: errors
    }
  }*/

  data.time = [
    data.minute,
    data.hour,
    data.dayOfMonth,
    data.month,
    data.dayOfWeek,
  ].join(' ')

  const cronJob = new CronJobModel(data)
  cronJob.server = server
  await cronJob.save()

  const message = `Added new Cron Job ${data.label}`
  await activity.createServerActivityLogInfo(server, message)

  return {
    success: true,
    data: { cronJob },
  }
}

export async function removeCronJob(jobId: string) {
  const cronJob = await CronJobModel.findById(jobId)
  if (!cronJob) {
    throw new Error("It doesn't exists")
  }

  /*const errors = await agent.removeCronJob(req.body);
  if (errors) {
    return {
      success: false,
      errors: errors,
    };
  }*/

  await cronJob.remove()

  return {
    success: true,
    data: { id: cronJob.id },
  }
}

export async function getSupervisorJobs(server: Server) {
  const supervisors = await SupervisorModel.find({ server }).populate('user')
  return {
    success: true,
    data: {
      supervisors: supervisors.map((it) => {
        const job = it.toJSON()
        return { ...job, user: it.user.name }
      }),
    },
  }
}

export async function createSupervisorJob(server: Server) {
  const systemUsers = await SystemUserModel.find({ server })
  return {
    success: true,
    system_users: systemUsers.map((user) => ({ id: user.id, name: user.name })),
    vendor_binaries: getVendorBinaries(),
    predefined_settings: getPredefinedSettings(),
  }
}

export async function storeSupervisorJob(server: Server, data: any) {
  const exists = await SupervisorModel.findOne({
    server,
    name: data.name,
  })
  if (exists) {
    return {
      success: false,
      errors: { name: 'has already been taken.' },
    }
  }

  /*errors = await agent.createSupervisorJob(data);
  if (errors) {
    return {
      success: false,
      errors: errors,
    };
  }*/

  const supervisor = new SupervisorModel(data)
  supervisor.server = server
  await supervisor.save()

  const message = `Added new Supervisor Job ${data.name}`
  await activity.createServerActivityLogInfo(server, message)

  return {
    success: true,
    data: { supervisor },
  }
}

export async function deleteSupervisorJob(jobId: string) {
  const supervisor = await SupervisorModel.findById(jobId)
  if (!supervisor) {
    throw new Error("It doesn't exists")
  }

  /*const errors = await agent.removeSupervisorJob(req.body);
  if (errors) {
    return {
      success: false,
      errors: errors,
    };
  }*/

  await supervisor.remove()

  return {
    success: true,
    data: { supervisor },
  }
}
