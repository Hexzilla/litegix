import { model } from 'mongoose'
import { User, Channel } from 'models'
import { createUserActivityLogInfo } from 'services/activity.service'
const UserModel = model<User>('User')
const ChannelModel = model<Channel>('Channel')

export async function getNotifications(userId: string) {
  const user = await UserModel.findById(userId)
  if (!user) {
    return {
      success: false,
      errors: { userId: "doesn't exists." },
    }
  }
  const channels = await ChannelModel.find({ userId })

  return {
    success: true,
    data: {
      newsletters: user.newsletters,
      channels: channels.map((it) => it.toJSON()),
    },
  }
}

export async function subscribe(userId: string, data: any) {
  const user = await UserModel.findById(userId)
  if (!user) {
    return {
      success: false,
      errors: { userId: "doesn't exists." },
    }
  }

  user.newsletters = {
    subscription: data.subscription,
    announchment: data.announchment,
    blog: data.blog,
    events: data.events,
  }
  await user.save()

  const message = `Subscribe to newsletter`
  await createUserActivityLogInfo(user, message)

  return {
    success: true,
    data: {
      newsletters: user.newsletters,
    },
  }
}

export async function unsubscribe(userId: string) {
  const user = await UserModel.findById(userId)
  if (!user) {
    return {
      success: false,
      errors: { userId: "doesn't exists." },
    }
  }
  if (user.newsletters) {
    user.newsletters.subscription = false
  }
  await user.save()

  const message = `Unsubscribe from newsletter`
  await createUserActivityLogInfo(user, message, 2)

  return {
    success: true,
    data: {
      newsletters: user.newsletters,
    },
  }
}

export async function storeChannel(userId: string, data: any) {
  const user = await UserModel.findById(userId)
  if (!user) {
    return {
      success: false,
      errors: { userId: "doesn't exists." },
    }
  }

  const query = {
    userId,
    channel: data.channel,
    name: data.name,
  }
  const exists = await ChannelModel.findOne(query)
  if (exists) {
    return {
      success: false,
      errors: { name: 'has already been taken.' },
    }
  }

  const channel = new ChannelModel(data)
  channel.user = user
  await channel.save()

  const message = `Added Notification Channel ${data.name} (${data.service})`
  await createUserActivityLogInfo(user, message, 2)

  return {
    success: true,
    data: { channel },
  }
}

export async function updateChannel(
  userId: string,
  channel: Channel,
  data: any
) {
  const user = await UserModel.findById(userId)
  if (!user) {
    return {
      success: false,
      errors: { userId: "doesn't exists." },
    }
  }

  if (channel.service != data.service) {
    return {
      success: false,
      errors: {
        service: "service cann't be changed.",
      },
    }
  }

  channel.service = data.service
  channel.name = data.name
  channel.content = data.content
  await channel.save()

  const message = `Update Notification Channel ${data.name} (${data.service})`
  await createUserActivityLogInfo(user, message, 2)

  return {
    success: true,
    data: { channel },
  }
}

export async function channelHealthSetting(channel: Channel, data: any) {
  if (data.load) {
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
  }
}
