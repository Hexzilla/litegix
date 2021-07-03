
const valiator = require('express-validator')
const {getServer} = require("./server-service")
const mongoose = require("mongoose")
const Database = mongoose.model("Database")
const agent = require("./agent-service")
const activity = require("./activity-service")

const getDatabases = async function (req, res) {
  try {
    const databases = await Database.find({ serverId: req.server.id })
    return res.json({ 
      success: true,
      data: { databases }
    })
  }
  catch (error) {
    return res.status(501).json({ 
      success: false,
      errors: error
    });
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
        errors: {
          message: "Name is duplicated",
        }
      })
    }

    errors = await agent.createDatabase(req.body)
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
    let {server, errors} = await getServer(req)
    if (errors) {
      return res.status(422).json({ success: false, errors: errors })
    }

    res.json({
      success: true,
      data: {
        databaseUsers: server.databaseUsers
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

const createDatabaseUser = async function (req, res) {
  try {
    let {server, errors} = await getServer(req)
    if (errors) {
      return res.status(422).json({ success: false, errors: errors })
    }

    if (server.databaseUsers.find(it => it.name === req.body.name)) {
      return res.status(422).json({
        success: false,
        errors: {
          message: "Name is duplicated",
        }
      })
    }

    errors = await agent.createDatabaseUser(req.body)
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors
      })
    }

    server.databaseUsers.push(req.body)
    await server.save()

    const message = `Added new database user ${req.body.name} with password`;
    await activity.createActivityLogInfo(req.body.serverId, message)

    res.json({
      success: true,
      message: "It has been successfully created."
    })
  }
  catch (error) {
    return res.status(501).json({ 
      success: false,
      errors: error
    });
  }
}

const deleteDatabaseUser = async function (req, res) {
  try {
    let {server, errors} = await getServer(req)
    if (errors) {
      return res.status(422).json({ success: false, errors: errors })
    }

    const index = server.databaseUsers.findIndex(it => it.name === req.body.name);
    if (index < 0) {
      return res.status(422).json({
        success: false,
        errors: { 
          message: "It doesn't exists",
        }
      })
    }

    errors = await agent.deleteDatabaseUser(req.body.name)
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors
      })
    }

    server.databaseUsers.splice(index, 1)
    await server.save()

    const message = `Deleted database user ${req.body.name}`;
    await activity.createActivityLogInfo(req.body.serverId, message)

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

const getSystemServices = async function (req, res) {
  try {
    let {server, errors} = await getServer(req)
    if (errors) {
      return res.status(422).json({ success: false, errors: errors })
    }

    res.json({ 
      success: true,
      data: {
        services: server.services
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
  deleteDatabaseUser,
  getSystemServices,
  getPhpVersion,
}
