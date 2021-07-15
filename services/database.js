const valiator = require('express-validator')
const {getServer} = require("./server")
const mongoose = require("mongoose")
const Database = mongoose.model("Database")
const DatabaseUser = mongoose.model("DatabaseUser")
const agent = require("./agent")
const activity = require("./activity")

const getDatabases = async function (req, res) {
  try {
    const databases = await Database.find({ serverId: req.server.id })
    return res.json({ 
      success: true,
      data: { databases }
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

//TODO
const createDatabase = async function (req, res) {
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

const storeDatabase = async function (req, res) {
  try {
    let errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() })
    }

    let server = req.server
    let database = await Database.findOne({ serverId: server.id, name: req.body.name })
    if (database) {
      return res.status(422).json({
        success: false,
        errors: { name: "has already been taken." }
      })
    }

    errors = await agent.createDatabase(server.address, req.body)
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors
      })
    }

    database = new Database(req.body)
    database.serverId = server.id
    await database.save()

    const message = `Added new database ${req.body.name} with collation ${req.body.encoding}`;
    await activity.createActivityLogInfo(server.id, message)

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

const deleteDatabase = async function (req, res) {
  try {
    let errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() })
    }

    let database = await Database.findById(req.body.id)
    if (!database) {
      return res.status(422).json({
        success: false,
        errors: { message: "It doesn't exists" }
      })
    }

    errors = await agent.deleteDatabase(database.name)
    if (errors) {
      return res.status(422).json({ success: false, errors: errors })
    }

    await database.remove()

    const message = `Deleted database ${req.body.name}`;
    await activity.createActivityLogInfo(req.body.serverId, message)

    res.json({
      success: true,
      message: "It has been successfully deleted."
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const getDatabaseUsers = async function (req, res) {
  try {
    const users = await DatabaseUser.find({ serverId: req.server.id })
    return res.json({ 
      success: true,
      data: { users: users }
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const createDatabaseUser = async function (req, res) {
  return res.json({
    success: true,
    data: {}
  })
}

const storeDatabaseUser = async function (req, res) {
  try {
    let errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() })
    }

    let server = req.server
    let user = await DatabaseUser.findOne({ serverId: server.id, name: req.body.name })
    if (user) {
      return res.status(422).json({
        success: false,
        errors: { name: "has already been taken." }
      })
    }

    errors = await agent.createDatabaseUser(req.body)
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors
      })
    }

    user = new DatabaseUser(req.body)
    user.serverId = server.id
    await user.save()

    const message = `Added new database user ${req.body.name} with password`;
    await activity.createActivityLogInfo(server.id, message)

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

const deleteDatabaseUser = async function (req, res) {
  try {
    let errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() })
    }

    let user = await DatabaseUser.findById(req.body.id)
    if (!user) {
      return res.status(422).json({
        success: false,
        errors: { message: "It doesn't exists" }
      })
    }

    errors = await agent.deleteDatabaseUser(user.name)
    if (errors) {
      return res.status(422).json({ success: false, errors: errors })
    }

    await user.remove()

    const message = `Deleted database user ${req.body.name}`;
    await activity.createActivityLogInfo(req.body.serverId, message)

    res.json({
      success: true,
      message: "It has been successfully deleted."
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const getPhpVersion = async function (req, res) {
  try {
    let {server, errors} = await getServer(req)
    if (errors) {
      return res.status(422).json({ success: false, errors: errors })
    }

    res.json({ 
      success: true,
      data: {
        phpVersion: server.phpVersion
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

module.exports = {
  getDatabases,
  createDatabase,
  storeDatabase,
  deleteDatabase,
  getDatabaseUsers,
  createDatabaseUser,
  storeDatabaseUser,
  deleteDatabaseUser,
  getPhpVersion,
}
