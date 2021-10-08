import { model } from 'mongoose'
import { User, Channel } from 'models'
import { createUserActivityLogInfo } from 'services/activity.service'
const UserModel = model<User>('User')
const ChannelModel = model<Channel>('Channel')

export async function getNotifications(userId: string) {
  const user = await UserModel.findById(userId)
  if (!user) {
    throw Error('InvalidUser')
  }

  return {
    success: true,
    data: {
      newsletters: user.newsletters,
    },
  }
}

export async function subscribe(
  userId: string,
  {
    subscription,
    announchment,
    blog,
    events,
  }: {
    subscription: boolean
    announchment: boolean
    blog: boolean
    events: boolean
  }
) {
  const user = await UserModel.findById(userId)
  if (!user) {
    throw Error('InvalidUser')
  }

  user.newsletters = {
    subscription: subscription,
    announchment: announchment,
    blog: blog,
    events: events,
  }
  if (!(await user.save())) {
    throw Error('DBSaveError')
  }

  const message = `Subscribe to newsletter`
  await createUserActivityLogInfo(user, message)

  return {
    success: true,
    data: {},
  }
}

export async function unsubscribe(userId: string) {
  const user = await UserModel.findById(userId)
  if (!user) {
    throw Error('InvalidUser')
  }
  if (user.newsletters) {
    user.newsletters.subscription = false
  }
  if (!(await user.save())) {
    throw Error('DBSaveError')
  }

  const message = `Unsubscribe from newsletter`
  await createUserActivityLogInfo(user, message, 2)

  return {
    success: true,
    data: {},
  }
}

export async function getChannels(userId: any) {
  const user: any = userId
  const channels = await ChannelModel.find({ user })

  return {
    success: true,
    data: {
      channels: channels,
    },
  }
}

export async function storeChannel(
  userId: string,
  { service, name, content }: { service: string; name: string; content: string }
) {
  const user: any = userId
  const exists = await ChannelModel.findOne({
    user,
    service,
    content,
  })
  if (exists) {
    throw Error('Already exists')
  }

  const channel = new ChannelModel({
    user,
    service,
    name,
    content,
  })
  await channel.save()

  const message = `Added Notification Channel ${name} (${service})`
  await createUserActivityLogInfo(channel.user, message, 2)

  return {
    success: true,
    data: { channel },
  }
}

export async function updateChannel(
  channel: Channel,
  { service, name, content }: { service: string; name: string; content: string }
) {
  if (channel.service != service) {
    throw Error('InvalidService')
  }

  channel.service = service
  channel.name = name
  channel.content = content
  await channel.save()

  const message = `Update Notification Channel ${name} (${service})`
  await createUserActivityLogInfo(channel.user, message, 2)

  return {
    success: true,
    data: { channel },
  }
}

export async function channelHealthSetting(channel: Channel, data: any) {
  /*if (data.load) {
    channel.load = data.load
  }
  if (data.memory) {
    channel.memory = data.memory
  }
  if (data.load || data.memory) {
    channel.save()

    const message =
      `Update Server Health Notification Setting for Channel ${channel.name} (${channel.service}) : ` +
      ` Load=${channel.load},  Memory=${channel.memory}.`
    await createUserActivityLogInfo(channel.user, message, 2)
  }

  return {
    success: true,
    data: {
      load: channel.load,
      memory: channel.memory,
    },
  }*/
}
