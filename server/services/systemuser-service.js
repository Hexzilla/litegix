const valiator = require('express-validator')
const mongoose = require("mongoose")
const Server = mongoose.model("Server")

const getSystemUsers = async function (req, res, next) {
  try {
    const errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    
  }
  catch (error) {
    return res.status(501).json({ 
      success: false,
      errors: error
    });
  }
}

const createSystemUser = async function (req, res, next) {
  try {
    const errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const server = await Server.findById(req.body.serverId)
    if (!server) {
      return res.status(422).json({
        success: false,
        errors: { 
          serverId: "doesn't exists"
        }
      })
    }

    const application = new WebApplication(req.body)
    await application.save()

    res.json({
      success: true,
      message: "Your web application has been successfully created."
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
  getSystemUsers,
  createSystemUser,
}
