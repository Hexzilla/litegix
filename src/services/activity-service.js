const mongoose = require('mongoose')
const ServerActivity = mongoose.model('ServerActivity')
const UserActivity = mongoose.model('UserActivity')
const { getServer } = require('./server-service')
const agent = require('./agent')
const moment = require('moment')

const createServerActivityLogInfo = async function (serverId, message, level) {
  try {
    const activity = new ServerActivity({
      serverId: serverId,
      category: 1,
      level: 1,
      message: message,
      date: moment(),
    })
    await activity.save()
  } catch (error) {
    return { errors: errors }
  }
}

const createUserActivityLogInfo = async function (userId, message, level) {
  try {
    const activity = new UserActivity({
      userId: userId,
      category: 1,
      level: 1,
      message: message,
      date: moment(),
    })
    await activity.save()
  } catch (error) {
    return { errors: errors }
  }
}

export default {
  getAccountActivityLogs: async function (userId) {
    const activities = await UserActivity.find({ userId })
    return {
      success: true,
      data: { activities },
    }
  },
  getServerActivityLogs: async function (server) {
    const activities = await ServerActivity.find({ serverId: server.id })
    return {
      success: true,
      data: { activities },
    }
  },
  createServerActivityLogInfo,
  createUserActivityLogInfo,
}
