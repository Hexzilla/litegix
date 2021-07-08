const valiator = require('express-validator')
const mongoose = require("mongoose")
const Notification = mongoose.model("Notification")
const agent = require("./agent")
const activity = require("./activity")


const getNotifications = async function (req, res) {
  try {
    const items = await Notification.find({ userId: req.payload.id })
    return res.json({ 
      success: true,
      data: { notifications: items.map(it => it.toJSON()) }
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
    let item = await Notification.findOne(query)
    if (item) {
      return res.status(422).json({
        success: false,
        errors: { name: "has already been taken." }
      })
    }
    
    item = new Notification(req.body)
    item.userId = req.payload.id
    await item.save()

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
  storeChannel,
  updateChannel,
}
