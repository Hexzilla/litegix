const valiator = require('express-validator')
const {getServer} = require("./server")
const mongoose = require("mongoose")
const Service = mongoose.model("Service")
const agent = require("./agent")
const activity = require("./activity")


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

module.exports = {
  getSystemServices,
}
