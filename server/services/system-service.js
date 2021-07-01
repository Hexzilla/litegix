const {getServer} = require("./server-service")
const agent = require("./agent-service")

const getSystemUsers = async function (req, res) {
  try {
    let {server, errors} = await getServer(req)
    if (errors) {
      return res.status(422).json({ success: false, errors: errors })
    }

    res.json({ 
      success: true,
      data: {
        systemUsers: server.systemUsers
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

const createSystemUser = async function (req, res) {
  try {
    let {server, errors} = await getServer(req)
    if (errors) {
      return res.status(422).json({ success: false, errors: errors })
    }

    if (server.systemUsers.find(it => it.name === req.body.name)) {
      return res.status(422).json({
        success: false,
        errors: {
          message: "Name is duplicated",
        }
      })
    }

    errors = await agent.createSystemUser(req.body)
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors
      })
    }

    server.systemUsers.push(req.body)
    await server.save()

    const message = `Added new system user ${req.body.name} with password`;
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

const deleteSystemUser = async function (req, res) {
  try {
    let {server, errors} = await getServer(req)
    if (errors) {
      return res.status(422).json({ success: false, errors: errors })
    }

    const index = server.systemUsers.findIndex(it => it.name === req.body.name);
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

    server.systemUsers.splice(index, 1)
    await server.save()

    res.json({
      success: true,
      message: "System user has been successfully deleted."
    })
  }
  catch (error) {
    return res.status(501).json({ 
      success: false,
      errors: error
    });
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
        errors: {
          message: "Name is duplicated",
        }
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
