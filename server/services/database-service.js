const {getServer} = require("./server-service")
const agent = require("./agent-service")
const activity = require("./activity-service")

const getDatabases = async function (req, res) {
  try {
    let {server, errors} = await getServer(req)
    if (errors) {
      return res.status(422).json({ success: false, errors: errors })
    }

    res.json({ 
      success: true,
      data: {
        databases: server.databases
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

const createDatabase = async function (req, res) {
  try {
    let {server, errors} = await getServer(req)
    if (errors) {
      return res.status(422).json({ success: false, errors: errors })
    }

    if (server.databases.find(it => it.name === req.body.name)) {
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

    server.databases.push(req.body)
    await server.save()

    const message = `Added new database ${req.body.name} with collation ${req.body.encoding}`;
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

const deleteDatabase = async function (req, res) {
  try {
    let {server, errors} = await getServer(req)
    if (errors) {
      return res.status(422).json({ success: false, errors: errors })
    }

    const index = server.databases.findIndex(it => it.name === req.body.name);
    if (index < 0) {
      return res.status(422).json({
        success: false,
        errors: { 
          message: "It doesn't exists",
        }
      })
    }

    errors = await agent.deleteDatabase(req.body.name)
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors
      })
    }

    server.databases.splice(index, 1)
    await server.save()

    const message = `Deleted database ${req.body.name}`;
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
  deleteDatabase,
  getDatabaseUsers,
  createDatabaseUser,
  deleteDatabaseUser,
  getSystemServices,
  getPhpVersion,
}
