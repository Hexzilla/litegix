const { body } = require('express-validator')
const mongoose = require("mongoose")
const Notification = mongoose.model("Notification")
const router = require("express").Router()
const auth = require("../auth")
const notification = require("../../services/notification")

// Preload server on routes with ':notificationId'
router.param("notificationId", function (req, res, next, notificationId) {
  Notification.findById(notificationId)
    .then(function (item) {
      if (!item) {
        return res.sendStatus(404)
      }

      req.notification = item
      return next()
    })
    .catch(next)
})


router.get("/", 
  auth.required,
  notification.getNotifications)

router.get("/channels/store", 
  auth.required,
  body('service').isString(),
  body('name').isString(),
  body('content').isString(),
  notification.storeChannel)

router.post("/channels/:notificationId/update",
  auth.required,
  body('service').isString(),
  body('name').isString(),
  body('content').isString(),
  notification.updateChannel)

module.exports = router
