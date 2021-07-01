const mongoose = require("mongoose")
const Activity = mongoose.model("Activity")
const {getServer} = require("./server-service")
const agent = require("./agent-service")
const moment = require('moment');

const getActivityLogs = async function (req, res) {
  try {
    let {server, errors} = await getServer(req)
    if (errors) {
      return res.status(422).json({ success: false, errors: errors })
    }

    const logs = await Activity.find({server: req.body.serverId})
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

const createActivityLogInfo = async function (serverId, message) {
  try {
    const activity = new Activity({
      serverId: serverId,
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
  getActivityLogs,
  createActivityLogInfo,
}
