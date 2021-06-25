const { body } = require('express-validator')
const mongoose = require("mongoose")
const router = require("express").Router()
const User = mongoose.model("User")
const auth = require("../auth")
const authService = require("../../services/auth-service")

router.get("/user", auth.required, function (req, res, next) {
  User.findById(req.payload.id)
    .then(function (user) {
      if (!user) {
        return res.sendStatus(401)
      }

      return res.json({ user: user.toAuthJSON() })
    })
    .catch(next)
})

router.put("/user", auth.required, function (req, res, next) {
  User.findById(req.payload.id)
    .then(function (user) {
      if (!user) {
        return res.sendStatus(401)
      }

      // only update fields that were actually passed...
      if (typeof req.body.user.username !== "undefined") {
        user.username = req.body.user.username
      }
      if (typeof req.body.user.email !== "undefined") {
        user.email = req.body.user.email
      }
      if (typeof req.body.user.bio !== "undefined") {
        user.bio = req.body.user.bio
      }
      if (typeof req.body.user.image !== "undefined") {
        user.image = req.body.user.image
      }
      if (typeof req.body.user.password !== "undefined") {
        user.setPassword(req.body.user.password)
      }

      return user.save().then(function () {
        return res.json({ user: user.toAuthJSON() })
      })
    })
    .catch(next)
})

router.post("/users/login", 
  body('email').notEmpty(),
  body('password').notEmpty(),
  authService.login)

router.post("/users/signup", 
  body('name').notEmpty(),
  body('email').notEmpty(),
  body('password').notEmpty(),
  authService.signup)

module.exports = router
