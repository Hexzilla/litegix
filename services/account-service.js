const mongoose = require("mongoose");
const User = mongoose.model("User");
const randomstring = require("randomstring");
const activity = require("./activity-service");

const generateApiKey = function () {
  return randomstring.generate(44);
};

const generateApiSecret = function () {
  return randomstring.generate(64);
};

module.exports = {
  getApiKeys: async function (userId) {
    const user = await User.findById(userId);
    if (!user) {
      return {
        success: false,
        errors: { userId: "doesn't exists." },
      };
    }

    user.apiKeys = user.apiKeys || {};
    if (!user.apiKeys.key || !user.apiKeys.secret) {
      user.apiKeys.enableAccess = false;
      user.apiKeys.apiKey = generateApiKey();
      user.apiKeys.secretKey = generateApiSecret();
      await user.save();
    }

    return {
      success: true,
      data: { apiKeys: user.apiKeys },
    };
  },

  createApiKey: async function (userId) {
    const user = await User.findById(userId);
    if (!user) {
      return {
        success: false,
        errors: { userId: "doesn't exists." },
      };
    }

    user.apiKeys = user.apiKeys || {};
    (user.apiKeys.apiKey = generateApiKey()), await user.save();

    return {
      success: true,
      data: { apiKeys: user.apiKeys },
    };
  },

  createSecretKey: async function (userId) {
    const user = await User.findById(userId);
    if (!user) {
      return {
        success: false,
        errors: { userId: "doesn't exists." },
      };
    }

    user.apiKeys = user.apiKeys || {};
    (user.apiKeys.secretKey = generateApiSecret()), await user.save();

    return {
      success: true,
      data: { apiKeys: user.apiKeys },
    };
  },

  enableAccess: async function (userId, data) {
    const user = await User.findById(userId);
    if (!user) {
      return {
        success: false,
        errors: { userId: "doesn't exists." },
      };
    }
    user.apiKeys = user.apiKeys || {};
    user.apiKeys.enableAccess = data.state;
    await user.save();

    const message =
      req.body.state === true ? "Enable API Access" : "Disable API Access";
    await activity.createUserActivityLogInfo(user.id, message);

    return {
      success: true,
      data: { apiKeys: user.apiKeys },
    };
  },
};
