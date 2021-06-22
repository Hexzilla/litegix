const passport = require("passport")

const login = function (req, res, next) {
  if (!req.body.user) {
    return res.status(422).json({ errors: { user: "can't be null" } })
  }
  if (!req.body.user.email) {
    return res.status(422).json({ errors: { email: "can't be blank" } })
  }
  if (!req.body.user.password) {
    return res.status(422).json({ errors: { password: "can't be blank" } })
  }

  passport.authenticate(
    "login",
    { session: false },
    function (err, user, info) {
      if (err) {
        return next(err)
      }

      if (user) {
        user.token = user.generateJWT()
        return res.json({ user: user.toAuthJSON() })
      } else {
        return res.status(422).json(info)
      }
    }
  )(req, res, next)
}

const signup = function (req, res, next) {
  if (!req.body.user.name) {
    return res.status(422).json({ errors: { name: "can't be blank" } })
  }
  if (!req.body.user.email) {
    return res.status(422).json({ errors: { email: "can't be blank" } })
  }

  if (!req.body.user.password) {
    return res.status(422).json({ errors: { password: "can't be blank" } })
  }

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
