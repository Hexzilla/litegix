const valiator = require("express-validator")
const mongoose = require("mongoose")
const User = mongoose.model("User")
const randomstring = require("randomstring");
const activity = require("./activity")

const getUser = async function (req) {
  try {
    const reject = (errors) => {
      return { errors: errors }
    }

    const errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return reject(errors.array())
    }

    const user = await User.findById(req.payload.id)
    if (!user) {
      return reject({ message: "User isn't exists" })
    }
    return { user: user }
  }
  catch (errors) {
    console.error(errors)
    return { errors: errors }
  }
}

const generateApiKey = function() {
  return randomstring.generate(44)
}

const generateApiSecret = function() {
  return randomstring.generate(64)
}

const getApiKeys = async function (req, res) {
  try {
    let {user, errors} = await getUser(req)
    if (errors) {
      return res.status(422).json({ success: false, errors: errors })
    }

    user.apiKeys = user.apiKeys || {}
    if (!user.apiKeys.key || !user.apiKeys.secret) {
      user.apiKeys.enableAccess = false
      user.apiKeys.key = generateApiKey()
      user.apiKeys.secret = generateApiSecret()
      await user.save()
    }

    return res.json({
      success: true,
      data: {
        apiKeys: user.apiKeys
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

const createApiKeys = async function (req, res) {
  try {
    let {user, errors} = await getUser(req)
    if (errors) {
      return res.status(422).json({ success: false, errors: errors })
    }

    user.apiKeys = user.apiKeys || {}
    user.apiKeys.key = generateApiKey(),
    user.apiKeys.secret = generateApiSecret()
    await user.save()

    return res.json({
      success: true,
      data: {
        apiKeys: user.apiKeys
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

const enableAccess = async function (req, res) {
  try {
    let {user, errors} = await getUser(req)
    if (errors) {
      return res.status(422).json({ success: false, errors: errors })
    }

    user.apiKeys = user.apiKeys || {}
    user.apiKeys.enableAccess = req.body.state
    await user.save()

    const message = req.body.state === true ? 'Enable API Access' : 'Disable API Access';
    await activity.createUserActivityLogInfo(user.id, message)

    return res.json({
      success: true,
      message: "It has been successfully updated."
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
  getApiKeys,
  createApiKeys,
  enableAccess,
}
