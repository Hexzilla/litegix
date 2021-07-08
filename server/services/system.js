const valiator = require('express-validator')
const {getServer} = require("./server")
const mongoose = require("mongoose")
const SystemUser = mongoose.model("SystemUser")
const agent = require("./agent")
const activity = require("./activity")

const getSystemUsers = async function (req, res) {
  try {
    const users = await SystemUser.find({ serverId: req.server.id })
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

const createSystemUser = async function (req, res) {
  try {
    res.json({
      success: true,
      data: {}
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const storeSystemUser = async function (req, res) {
  try {
    let errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() })
    }

    let server = req.server
    let user = await SystemUser.findOne({ serverId: server.id, name: req.body.name })
    if (user) {
      return res.status(422).json({
        success: false,
        errors: { name: "has already been taken." }
      })
    }

    errors = await agent.createSystemUser(req.body)
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors
      })
    }

    user = new SystemUser(req.body)
    user.serverId = server.id
    await user.save()

    const message = `Added new system user ${req.body.name} with password`;
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

const changeSystemUserPassword = async function (req, res) {
  try {
    let errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() })
    }

    let server = req.server
    let user = await SystemUser.findById(req.body.userId)
    if (!user) {
      return res.status(422).json({
        success: false,
        errors: { message: "User isn't exists" }
      })
    }

    errors = await agent.changeSystemUserPassword(user.name, req.body.password)
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors
      })
    }

    const message = `The password for system user ${user.name} is changed`;
    await activity.createActivityLogInfo(server.id, message)

    res.json({
      success: true,
      message: "Password has been successfully changed."
    })
  }
  catch (e) {
    console.error(e)
    return res.status(501).json({ success: false });
  }
}

const deleteSystemUser = async function (req, res) {
  try {
    let errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() })
    }

    let user = await SystemUser.findById(req.body.id)
    if (!user) {
      return res.status(422).json({
        success: false,
        errors: { message: "It doesn't exists" }
      })
    }

    errors = await agent.deleteSystemUser(user.name)
    if (errors) {
      return res.status(422).json({ success: false, errors: errors })
    }

    await user.remove()

    const message = `Deleted system user ${req.body.name}`;
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

const getSSHKeys = async function (req, res) {
  try {
    let {server, errors} = await getServer(req)
    if (errors) {
      return res.status(422).json({ success: false, errors: errors })
    }

    res.json({ 
      success: true,
      data: {
        sshKeys: server.sshKeys
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

const createSSHKey = async function (req, res) {
  try {
    let {server, errors} = await getServer(req)
    if (errors) {
      return res.status(422).json({ success: false, errors: errors })
    }

    if (server.sshKeys.find(it => it.name === req.body.name)) {
      return res.status(422).json({
        success: false,
        errors: {
          message: "Label is duplicated",
        }
      })
    }

    errors = await agent.createSSHKey(req.body)
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors
      })
    }

    server.sshKeys.push(req.body)
    await server.save()

    const message = `Added new SSH key ${req.body.name} with user ${req.body.userName}`;
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

const deleteSSHKey = async function (req, res) {
  try {
    let {server, errors} = await getServer(req)
    if (errors) {
      return res.status(422).json({ success: false, errors: errors })
    }

    const index = server.sshKeys.findIndex(it => it.name === req.body.name);
    if (index < 0) {
      return res.status(422).json({
        success: false,
        errors: { 
          message: "It doesn't exists",
        }
      })
    }

    errors = await agent.deleteSystemUser(req.body.name)
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors
      })
    }

    server.sshKeys.splice(index, 1)
    await server.save()

    res.json({
      success: true,
      message: "SSH Key has been successfully deleted."
    })
  }
  catch (error) {
    return res.status(501).json({ 
      success: false,
      errors: error
    });
  }
}

const getDeploymentKeys = async function (req, res) {
  try {
    let {server, errors} = await getServer(req)
    if (errors) {
      return res.status(422).json({ success: false, errors: errors })
    }

    res.json({ 
      success: true,
      data: {
        deploymentKeys: server.deploymentKeys
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

const createDeploymentKey = async function (req, res) {
  try {
    let {server, errors} = await getServer(req)
    if (errors) {
      return res.status(422).json({ success: false, errors: errors })
    }

    if (server.deploymentKeys.find(it => it.name === req.body.name)) {
      return res.status(422).json({
        success: false,
        errors: {
          message: "Label is duplicated",
        }
      })
    }

    errors = await agent.createDeploymentKey(req.body)
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors
      })
    }

    server.deploymentKeys.push(req.body)
    await server.save()

    const message = `Added new deployment key ${req.body.name} with user ${req.body.userName}`;
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

const deleteDeploymentKey = async function (req, res) {
  try {
    let {server, errors} = await getServer(req)
    if (errors) {
      return res.status(422).json({ success: false, errors: errors })
    }

    const index = server.deploymentKeys.findIndex(it => it.name === req.body.name);
    if (index < 0) {
      return res.status(422).json({
        success: false,
        errors: { 
          message: "It doesn't exists",
        }
      })
    }

    errors = await agent.deleteDeploymentKey(req.body.name)
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors
      })
    }

    server.deploymentKeys.splice(index, 1)
    await server.save()

    res.json({
      success: true,
      message: "Deployment Key has been successfully deleted."
    })
  }
  catch (error) {
    return res.status(501).json({ 
      success: false,
      errors: error
    });
  }
}

const getSupervisorJobs = async function (req, res) {
  try {
    let {server, errors} = await getServer(req)
    if (errors) {
      return res.status(422).json({ success: false, errors: errors })
    }

    res.json({ 
      success: true,
      data: {
        supervisors: server.supervisors
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

const createSupervisorJob = async function (req, res) {
  try {
    let {server, errors} = await getServer(req)
    if (errors) {
      return res.status(422).json({ success: false, errors: errors })
    }

    if (server.supervisors.find(it => it.name === req.body.name)) {
      return res.status(422).json({
        success: false,
        errors: { name: "has already been taken." }
      })
    }

    errors = await agent.createSupervisorJob(req.body)
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors
      })
    }

    server.supervisors.push(req.body)
    await server.save()

    const message = `Added new supervisor job ${req.body.name}`;
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

const deleteSupervisorJob = async function (req, res) {
  try {
    let {server, errors} = await getServer(req)
    if (errors) {
      return res.status(422).json({ success: false, errors: errors })
    }

    const index = server.supervisors.findIndex(it => it.name === req.body.name);
    if (index < 0) {
      return res.status(422).json({
        success: false,
        errors: { 
          message: "It doesn't exists",
        }
      })
    }

    errors = await agent.deleteSupervisorJob(req.body.name)
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors
      })
    }

    server.supervisors.splice(index, 1)
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
  getSystemUsers,
  createSystemUser,
  storeSystemUser,
  changeSystemUserPassword,
  deleteSystemUser,
  getSSHKeys,
  createSSHKey,
  deleteSSHKey,
  getDeploymentKeys,
  createDeploymentKey,
  deleteDeploymentKey,
  getSupervisorJobs,
  createSupervisorJob,
  deleteSupervisorJob,
}
