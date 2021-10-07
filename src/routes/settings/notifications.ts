import { body } from 'express-validator'
import { model } from 'mongoose'
import { Router, Request, Response } from 'express'
import { Channel } from 'models/channel.model'
import auth from 'routes/auth'
import validate from 'routes/validate'
import * as notification from 'services/notification.service'
const ChannelModel = model<Channel>('Channel')
const router = Router()

// Preload server on routes with ':channelId'
router.param('channelId', function (req, res, next, channelId: string) {
  ChannelModel.findById(channelId)
    .then(function (channel) {
      if (!channel) {
        return res.sendStatus(404)
      }
      req.channel = channel
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
  validate,
  async function (req: Request, res: Response) {
    try {
      const response = await notification.subscribe(req.payload.id, req.body)
      return res.json(response)
    } catch (e) {
      console.error(e)
      return res.status(501).json({ success: false })
    }
  }
)

router.post(
  '/newsletters/unsubscribe',
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const response = await notification.unsubscribe(req.payload.id)
      return res.json(response)
    } catch (e) {
      console.error(e)
      return res.status(501).json({ success: false })
    }
  }
)

router.get(
  '/channels/store',
  auth.required,
  body('channel').isString(),
  body('name').isString(),
  validate,
  async function (req: Request, res: Response) {
    try {
      const response = await notification.storeChannel(req.payload.id, req.body)
      return res.json(response)
    } catch (e) {
      console.error(e)
      return res.status(501).json({ success: false })
    }
  }
)

router.post(
  '/channels/:channelId/update',
  auth.required,
  body('channel').isString(),
  body('name').isString(),
  validate,
  async function (req: Request, res: Response) {
    try {
      const response = await notification.updateChannel(
        req.payload.id,
        req.channel,
        req.body
      )
      return res.json(response)
    } catch (e) {
      console.error(e)
      return res.status(501).json({ success: false })
    }
  }
)

router.get(
  '/channels/:channelId',
  auth.required,
  async function (req: Request, res: Response) {
    return res.json({
      success: true,
      data: {
        channel: req.channel,
      },
    })
  }
)

router.post(
  '/channels/:channelId/healthsetting',
  auth.required,
  body('load').isNumeric().isInt({ min: 1, max: 255 }),
  body('memory').isNumeric().isInt({ min: 1, max: 99 }),
  validate,
  async function (req: Request, res: Response) {
    try {
      const response = await notification.channelHealthSetting(
        req.channel,
        req.body
      )
      return res.json(response)
    } catch (e) {
      console.error(e)
      return res.status(501).json({ success: false })
    }
  }
)

export default router
