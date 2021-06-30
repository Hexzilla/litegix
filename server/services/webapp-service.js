const {getServer} = require("./server-service")
const agent = require("./agent-service")

const getWebApplications = async function (req, res) {
  try {
    let {server, errors} = await getServer(req)
    if (errors) {
      return res.status(422).json({ success: false, errors: errors })
    }

    res.json({ 
      success: true,
      data: {
        applications: server.applications
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

const createWebApplication = async function (req, res) {
  try {
    let {server, errors} = await getServer(req)
    if (errors) {
      return res.status(422).json({ success: false, errors: errors })
    }

    if (server.applications.find(it => it.name === req.body.name)) {
      return res.status(422).json({
        success: false,
        errors: {
          message: "Name is duplicated",
        }
      })
    }

    errors = await agent.createWebApplication(req.body)
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors
      })
    }

    server.applications.push(req.body)
    server.save()

    res.json({
      success: true,
      message: "Web application has been successfully created."
    })
  }
  catch (error) {
    return res.status(501).json({ 
      success: false,
      errors: error
    });
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
          message: "Web application doesn't exists",
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
    server.save()

    res.json({
      success: true,
      message: "Web application has been successfully deleted."
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
  deleteWebApplication,
}
