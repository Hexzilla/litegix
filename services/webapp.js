const valiator = require('express-validator')
const {getServer} = require("./server")
const mongoose = require("mongoose")
const Application = mongoose.model("Application")
const agent = require("./agent")
const activity = require("./activity")


const getWebApplications = async function (req, res) {
  try {
    const applications = await Application.find({ serverId: req.server.id })
    return res.json({ 
      success: true,
      data: { applications }
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

//TODO
const createWebApplication = async function (req, res) {
  return res.json({
    success: true,
    data: {
      users: [
        "runcloud",
        "dbuser"
      ],
      collections: [
        "utf8_general_ci",
        "utf16_general_ci"
      ]
    }
  })
}

const storeWebApplication = async function (req, res) {
  try {
    let errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() })
    }

    let server = req.server
    let application = await Application.findOne({ serverId: server.id, name: req.body.name })
    if (application) {
      return res.status(422).json({
        success: false,
        errors: { name: "has already been taken." }
      })
    }

    errors = await agent.createWebApplication(req.body)
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors
      })
    }

    application = new Application(req.body)
    application.serverId = server.id
    await application.save()

    const message = `Added new web application ${req.body.name}`;
    await activity.createServerActivityLogInfo(server.id, message)

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

const storeCustomWebApplication = async function (req, res) {
  try {
    let errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() })
    }

    let server = req.server
    let application = await Application.findOne({ serverId: server.id, name: req.body.name })
    if (application) {
      return res.status(422).json({
        success: false,
        errors: { name: "has already been taken." }
      })
    }

    errors = await agent.createWebApplication(req.body)
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors
      })
    }

    application = new Application(req.body)
    application.serverId = server.id
    await application.save()

    const message = `Added new web application ${req.body.name}`;
    await activity.createServerActivityLogInfo(server.id, message)

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

const storeWordpressWebApplication = async function (req, res) {
  try {
    let errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() })
    }

    let server = req.server
    let application = await Application.findOne({ serverId: server.id, name: req.body.name })
    if (application) {
      return res.status(422).json({
        success: false,
        errors: { name: "has already been taken." }
      })
    }

    errors = await agent.createWebApplication(req.body)
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors
      })
    }

    application = new Application(req.body)
    application.serverId = server.id
    await application.save()

    const message = `Added new web application ${req.body.name}`;
    await activity.createServerActivityLogInfo(server.id, message)

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

const deleteWebApplication = async function (req, res) {
  try {
    let {server, errors} = await getServer(req)
    if (errors) {
      return res.status(422).json({ success: false, errors: errors })
    }

    const index = server.applications.findIndex(it => it.name === req.body.name);
    if (index < 0) {
      return res.status(422).json({
        success: false,
        errors: { 
          message: "It doesn't exists",
        }
      })
    }

    errors = await agent.deleteWebApplication(req.body.name)
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors
      })
    }

    server.applications.splice(index, 1)
    await server.save()

    res.json({
      success: true,
      message: "It has been successfully deleted."
    })
  }
  catch (error) {
    return res.status(501).json({ 
      success: false,
      errors: error
    });
  }
}

module.exports = {
  getWebApplications,
  createWebApplication,
  storeCustomWebApplication,
  storeWordpressWebApplication,
  deleteWebApplication,
}
