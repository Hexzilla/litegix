const mongoose = require("mongoose")
const ServerActivity = mongoose.model("ServerActivity")
const UserActivity = mongoose.model("UserActivity")
const {getServer} = require("./server")
const agent = require("./agent")
const moment = require('moment');

const getServerActivityLogs = async function (req, res) {
  try {
    let {server, errors} = await getServer(req)
    if (errors) {
      return res.status(422).json({ success: false, errors: errors })
    }

    const logs = await ServerActivity.find({server: req.body.serverId})
    res.json({ 
      success: true,
      data: {
        logs: logs
      }
    })
  }
  catch (error) {
    return res.status(501).json({ 
      success: false,
      errors: error
    });
  }
}

const createServerActivityLogInfo = async function (serverId, message, level) {
  try {
    const activity = new ServerActivity({
      serverId: serverId,
      category: 1,
      level: 1,
      message: message,
      date: moment()
    });
    await activity.save();
  }
  catch (error) {
    return {errors: errors}
  }
}

const createUserActivityLogInfo = async function (userId, message, level) {
  try {
    const activity = new UserActivity({
      userId: userId,
      category: 1,
      level: 1,
      message: message,
      date: moment()
    });
    await activity.save();
  }
  catch (error) {
    return {errors: errors}
  }
}

module.exports = {
  getServerActivityLogs,
  createServerActivityLogInfo,
  createUserActivityLogInfo
}
