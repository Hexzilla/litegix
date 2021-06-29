const valiator = require('express-validator')
const mongoose = require("mongoose")
const Server = mongoose.model("Server")
const Database = mongoose.model("Database")

const getDatabases = async function (req, res, next) {
  try {
    const errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const applications = await Database.find({ server: req.body.serverId })
    if (applications) {
      res.json({ 
        success: true,
        data: {
          applications: applications
        }
      })
    }
  }
  catch (error) {
    return res.status(501).json({ 
      success: false,
      errors: error
    });
  }
}

const createDatabase = async function (req, res, next) {
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

    const database = new Database(req.body)
    await database.save()

    res.json({
      success: true,
      message: "Your database has been successfully created."
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
  getDatabases,
  createDatabase,
}
