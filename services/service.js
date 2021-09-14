const valiator = require("express-validator");
const { getServer } = require("./server-service");
const mongoose = require("mongoose");
const Service = mongoose.model("Service");
const agent = require("./agent");
const activity = require("./activity");

const getSystemServices = async function (req, res) {
  try {
    const services = await Service.find({ serverId: req.server.id });
    return res.json({
      success: true,
      data: { services },
    });
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
};

module.exports = {
  getSystemServices,
};
