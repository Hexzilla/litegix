const valiator = require("express-validator");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Channel = mongoose.model("Channel");
const agent = require("./agent");
const activity = require("./activity-service");

const getNotifications = async function (req, res) {
  try {
    const user = await User.findById(req.payload.id);
    if (!user) {
      return res.status(501).json({
        success: false,
        message: "Invalid User",
      });
    }
    const channels = await Channel.find({ userId: req.payload.id });

    return res.json({
      success: true,
      data: {
        newsletters: user.newsletters,
        channels: channels.map((it) => it.toJSON()),
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
};

const subscribe = async function (req, res) {
  try {
    const user = await User.findById(req.payload.id);
    if (!user) {
      return res.status(501).json({
        success: false,
        message: "Invalid User",
      });
    }

    user.newsletters = {
      subscription: true,
      announchment: true,
      blog: true,
      events: true,
    };
    await user.save();

    const message = `Subscribe to newsletter`;
    await activity.createUserActivityLogInfo(user.id, message);

    res.json({
      success: true,
      message: "It has been successfully updated.",
    });
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
};

const unsubscribe = async function (req, res) {
  try {
    const user = await User.findById(req.payload.id);
    if (!user) {
      return res.status(501).json({
        success: false,
        message: "Invalid User",
      });
    }

    if (user.newsletters) {
      user.newsletters.subscription = false;
    }
    await user.save();

    const message = `Unsubscribe from newsletter`;
    await activity.createUserActivityLogInfo(user.id, message, "high");

    res.json({
      success: true,
      message: "It has been successfully updated.",
    });
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
};

const storeChannel = async function (req, res) {
  try {
    let errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    const user = await User.findById(req.payload.id);
    if (!user) {
      return res.status(501).json({
        success: false,
        message: "Invalid User",
      });
    }

    const channelpost = req.body.channel;
    // if (channelpost !== "email" && channelpost !== "slack") {
    //   return res.status(422).json({
    //     success: false,
    //     errors: { service: "unsupported service type." }
    //   })
    // }

    let query = {
      userId: req.payload.id,
      channel: req.body.channel,
      name: req.body.name,
    };
    let channel = await Channel.findOne(query);
    if (channel) {
      return res.status(422).json({
        success: false,
        errors: { name: "has already been taken." },
      });
    }

    channel = new Channel(req.body);
    channel.userId = req.payload.id;
    await channel.save();

    const message = `Added Notification Channel ${req.body.name} (${req.body.service})`;
    await activity.createUserActivityLogInfo(user.id, message, "high");

    res.json({
      success: true,
      message: "It has been successfully created.",
    });
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
};

const updateChannel = async function (req, res) {
  try {
    let errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    const user = await User.findById(req.payload.id);
    if (!user) {
      return res.status(501).json({
        success: false,
        message: "Invalid User",
      });
    }

    let item = req.notification;

    if (item.service != req.body.service) {
      return res.status(422).json({
        success: false,
        errors: {
          service: "cann't change service.",
        },
      });
    }

    item.service = req.body.service;
    item.name = req.body.name;
    item.content = req.body.content;
    await item.save();

    const message = `Update Notification Channel ${req.body.name} (${req.body.service})`;
    await activity.createUserActivityLogInfo(user.id, message, "high");

    res.json({
      success: true,
      message: "It has been successfully updated.",
    });
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
};

const channelHealthsetting = async function (req, res) {
  try {
    let errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }
    let channelItem = req.notification;

    if (req.body.load !== undefined) {
      channelItem.load = req.body.load;
    }
    if (req.body.memory !== undefined) {
      channelItem.memory = req.body.memory;
    }
    if (req.body.load !== undefined || req.body.memory !== undefined) {
      const user = await User.findById(req.payload.id);
      channelItem.save();
      const message =
        `Update Server Health Notification Setting for Channel ${channelItem.name} (${channelItem.service}) : ` +
        ` Load=${channelItem.load},  Memory=${channelItem.memory}.`;
      await activity.createUserActivityLogInfo(user.id, message, "high");
    }

    res.json({
      success: true,
      data: {
        load: channelItem.load,
        memory: channelItem.memory,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
};

const getChannel = async function (req, res) {
  try {
    const channel = await Channel.findById(req.params.channelId);
    // console.log( req.params.channelId)
    // console.log( channel.load)
    return res.json({
      success: true,
      data: channel.toJSON(),
    });
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
};
module.exports = {
  getNotifications,
  subscribe,
  unsubscribe,
  storeChannel,
  updateChannel,
  channelHealthsetting,
  getChannel,
};
