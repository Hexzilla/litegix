import { model } from 'mongoose'
import { Server, CronJob, Supervisor } from 'models'
import * as activity from 'services/activity.service'
const CronJobModel = model<CronJob>('CronJob')
const SupervisorModel = model<Supervisor>('Supervisor')

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
    '/Litegix/Packages/php72/bin/php',
    '/Litegix/Packages/php73/bin/php',
    '/Litegix/Packages/php74/bin/php',
    '/Litegix/Packages/php80/bin/php',
    '/user/bin/node',
    '/bin/bash',
  ]
}

const getPredefinedSettings = function () {
  return [
    'Every Minutes',
    'Every 10 Minutes',
    'Every 30 Minutes',
    'Every Hours',
    'All midnight',
    'Every Day',
    'Every Week',
    'Every Month',
  ]
}

export async function getCronJobs(server: Server) {
  const cronJobs = await CronJobModel.find({ serverId: server.id })
  return {
    success: true,
    data: { cronJobs },
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
  return {
    success: true,
    vendor_binaries: getVendorBinaries(),
    predefined_settings: getPredefinedSettings(),
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
  cronJob.server = server.id
  await cronJob.save()

  const message = `Added new Cron Job ${data.label}`
  await activity.createServerActivityLogInfo(server.id, message)

  return {
    success: true,
    data: { cronJob },
  }
}

export async function removeCronJob(jobId: string) {
  const cronJob = await CronJobModel.findById(jobId)
  if (!cronJob) {
    return {
      success: false,
      errors: {
        message: "It doesn't exists",
      },
    }
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
    data: { cronJob },
  }
}

export async function getSupervisorJobs(server: Server) {
  const supervisors = await SupervisorModel.find({ serverId: server.id })
  return {
    success: true,
    data: { supervisors },
  }
}

export async function createSupervisorJob(server: Server) {
  return {
    success: true,
    vendor_binaries: getVendorBinaries(),
    predefined_settings: getPredefinedSettings(),
  }
}

export async function storeSupervisorJob(server: Server, data: any) {
  const exists = await SupervisorModel.findOne({
    serverId: server.id,
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
  supervisor.server = server.id
  await supervisor.save()

  const message = `Added new Supervisor Job ${data.name}`
  await activity.createServerActivityLogInfo(server.id, message)

  return {
    success: true,
    data: { supervisor },
  }
}

export async function deleteSupervisorJob(jobId: string) {
  const supervisor = await SupervisorModel.findById(jobId)
  if (!supervisor) {
    return {
      success: false,
      errors: {
        message: "It doesn't exists",
      },
    }
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
