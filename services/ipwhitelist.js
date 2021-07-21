const valiator = require('express-validator')
const mongoose = require("mongoose")
const Application = mongoose.model("Application")


const getWhiteList = async function (req, res) {
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

module.exports = {
  getWhiteList,
}
