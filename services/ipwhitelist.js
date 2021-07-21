const valiator = require('express-validator')
const mongoose = require("mongoose")
const IPAddress = mongoose.model("IPAddress")


const getWhiteList = async function (req, res) {
  try {
    const whitelist = await IPAddress.find({ userId: req.payload.id })
    return res.json({ 
      success: true,
      data: { whitelist }
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
