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
  body('channel').isString(),
  body('name').isString(),
  notification.storeChannel)

router.post("/channels/:channelId/update",
  auth.required,
  body('channel').isString(),
  body('name').isString(),
  notification.updateChannel)

router.get("/channels/:channelId",
  auth.required,
  notification.getChannel)

router.post("/channels/:channelId/healthsetting",
  auth.required,
  body('load').isNumeric().isInt({min:1,max:255}),
  body('memory').isNumeric().isInt({min:1,max:99}),
  notification.channelHealthsetting)
  
module.exports = router
