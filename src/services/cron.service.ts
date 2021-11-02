import { model } from 'mongoose'
import { Server, CronJob, Supervisor, SystemUser } from 'models'
import * as activity from 'services/activity.service'
//import * as agentSvc from 'services/agent.service'
import { vendor_binaries, predefined_settings } from './constants'
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
    vendor_binaries: vendor_binaries,
    predefined_settings: predefined_settings,
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
    vendor_binaries: vendor_binaries,
    predefined_settings: predefined_settings,
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
