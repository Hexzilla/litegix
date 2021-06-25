const passport = require("passport")

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

module.exports = {
  login,
  signup
}
