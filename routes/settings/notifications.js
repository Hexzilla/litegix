const { body } = require('express-validator')
const mongoose = require("mongoose")
const Channel = mongoose.model("Channel")
const router = require("express").Router()
const auth = require("../auth")
const notification = require("../../services/notification")

// Preload server on routes with ':channelId'
router.param("channelId", function (req, res, next, channelId) {
  Channel.findById(channelId)
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

router.post("/newsletters/subscribe",
  auth.required,
  notification.subscribe)

router.post("/newsletters/unsubscribe",
  auth.required,
  notification.unsubscribe)

router.get("/channels/store", 
  auth.required,
  body('service').isString(),
  body('name').isString(),
  body('content').isString(),
  notification.storeChannel)

router.post("/channels/:channelId/update",
  auth.required,
  body('service').isString(),
  body('name').isString(),
  body('content').isString(),
  notification.updateChannel)

module.exports = router
