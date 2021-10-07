import { body } from 'express-validator'
const mongoose = require('mongoose')
const Channel = mongoose.model('Channel')
import { Router, Request, Response, NextFunction } from 'express'
const auth = require('../auth')
const notification = require('../../services/notification-service')

// Preload server on routes with ':channelId'
router.param('channelId', function (req, res, next, channelId) {
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

router.get(
  '/',
  auth.required,
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const userId = req.payload.id
      const response = await notification.getNotifications(userId)
      return res.json(response)
    } catch (e) {
      console.error(e)
      return res.status(501).json({ success: false })
    }
  }
)

router.post(
  '/newsletters/subscribe',
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const userId = req.payload.id
      const response = await notification.subscribe(userId, req.body)
      return res.json(response)
    } catch (e) {
      console.error(e)
      return res.status(501).json({ success: false })
    }
  }
)

router.post('/newsletters/unsubscribe', auth.required, notification.unsubscribe)

router.get(
  '/channels/store',
  auth.required,
  body('channel').isString(),
  body('name').isString(),
  notification.storeChannel
)

router.post(
  '/channels/:channelId/update',
  auth.required,
  body('channel').isString(),
  body('name').isString(),
  notification.updateChannel
)

router.get('/channels/:channelId', auth.required, notification.getChannel)

router.post(
  '/channels/:channelId/healthsetting',
  auth.required,
  body('load').isNumeric().isInt({ min: 1, max: 255 }),
  body('memory').isNumeric().isInt({ min: 1, max: 99 }),
  notification.channelHealthsetting
)

export default router
