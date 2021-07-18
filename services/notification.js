const valiator = require('express-validator')
const mongoose = require("mongoose")
const User = mongoose.model("User")
const Channel = mongoose.model("Channel")
const agent = require("./agent")
const activity = require("./activity")


const getNotifications = async function (req, res) {
  try {
    const user = await User.findById(req.payload.id)
    if (!user) {
      return res.status(501).json({ 
        success: false,
        message: "Invalid User"
      });
    }
    const channels = await Channel.find({ userId: req.payload.id })
    return res.json({ 
      success: true,
      data: { 
        newsletters: user.newsletters,
        channels: channels.map(it => it.toJSON())
      }
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const subscribe = async function (req, res) {
  try {
    const user = await User.findById(req.payload.id)
    if (!user) {
      return res.status(501).json({ 
        success: false,
        message: "Invalid User"
      });
    }

    user.newsletters = {
      subscription: true,
      announchment: true,
      blog: true,
      events: true,
    }
    await user.save()

    res.json({
      success: true,
      message: "It has been successfully updated."
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const unsubscribe = async function (req, res) {
  try {
    const user = await User.findById(req.payload.id)
    if (!user) {
      return res.status(501).json({ 
        success: false,
        message: "Invalid User"
      });
    }

    if (user.newsletters) {
      user.newsletters.subscription = false
    }
    await user.save()

    res.json({
      success: true,
      message: "It has been successfully updated."
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const storeChannel = async function (req, res) {
  try {
    let errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() })
    }

    const service = req.body.service
    if (service !== "email" && service !== "slack") {
      return res.status(422).json({
        success: false,
        errors: { service: "unsupported service type." }
      })
    }

    let query = {
      userId: req.payload.id,
      service: req.body.service,
      name: req.body.name
    }
    let channel = await Channel.findOne(query)
    if (channel) {
      return res.status(422).json({
        success: false,
        errors: { name: "has already been taken." }
      })
    }
    
    channel = new Channel(req.body)
    channel.userId = req.payload.id
    await channel.save()

    res.json({
      success: true,
      message: "It has been successfully created."
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const updateChannel = async function (req, res) {
  try {
    let errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() })
    }

    let item = req.notification
    if (item.service != req.body.service) {
      return res.status(422).json({
        success: false,
        errors: {
          service: "cann't change service."
        }
      })
    }

    item.service = req.body.service
    item.name = req.body.name
    item.content = req.body.content
    await item.save()

    res.json({
      success: true,
      message: "It has been successfully updated."
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}


module.exports = {
  getNotifications,
  subscribe,
  unsubscribe,
  storeChannel,
  updateChannel,
}
