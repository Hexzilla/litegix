const valiator = require("express-validator")
const mongoose = require("mongoose")
const User = mongoose.model("User")
const passport = require("passport")
const randomstring = require("randomstring");

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
      return reject({
        message: "User isn't exists" 
      })
    }
    return { user: user }
  }
  catch (errors) {
    return { errors: errors }
  }
}

const login = function (req, res, next) {
  passport.authenticate(
    "login",
    { session: false },
    function (err, user, info) {
      if (err) {
        return next(err)
      }

      if (user) {
        user.token = user.generateJWT()
        return res.json(user.toAuthJSON())
      } else {
        return res.status(422).json(info)
      }
    }
  )(req, res, next)
}

const signup = function (req, res, next) {
  passport.authenticate(
    "signup",
    { session: false },
    function (err, user) {
      if (err) {
        return next(err)
      }

      return res.json({ success: true })
    }
  )(req, res, next)
}

const changePassword = async function (req, res) {

}

const deleteAccount = async function (req, res) {
  
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

    user.apiKeys = user.apiKeys | {}
    if (!user.apiKeys.key || !user.apiKeys.secret) {
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

    user.apiKeys = {
      key: generateApiKey(),
      secret: generateApiSecret()
    }
    await user.save()

    return res.json({
      success: true,
      data: {
        key: user.apiKeys.key
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
  login,
  signup,
  changePassword,
  deleteAccount,
  getApiKeys,
  createApiKeys,
}
