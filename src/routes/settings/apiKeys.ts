import { body } from 'express-validator'
import { Router, Request, Response, NextFunction } from 'express'
import auth from 'routes/auth'
import validate from 'routes/validate'
import errorMessage from 'routes/errors'
import account from 'services/account.service'
const router = Router()

router.get('/', auth.required, async function (req: Request, res: Response) {
  try {
    const userId = req.payload.id
    const response = await account.getApiKeys(userId)
    return res.json(response)
  } catch (e) {
    console.error(e)
    return res.status(501).json({ success: false })
  }
})

router.put(
  '/apiKey',
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const userId = req.payload.id
      const response = await account.createApiKey(userId)
      return res.json(response)
    } catch (e) {
      console.error(e)
      return res.status(501).json({ success: false })
    }
  }
)

router.put(
  '/secretKey',
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const userId = req.payload.id
      const response = await account.createSecretKey(userId)
      return res.json(response)
    } catch (e) {
      console.error(e)
      return res.status(501).json({ success: false })
    }
  }
)

router.post(
  '/enableaccess',
  auth.required,
  body('state').isBoolean(),
  validate,
  async function (req: Request, res: Response) {
    try {
      const userId = req.payload.id
      const response = await account.enableAccess(userId, req.body)
      return res.json(response)
    } catch (e) {
      console.error(e)
      return res.status(501).json({ success: false })
    }
  }
)

router.get(
  '/ipaddr',
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const userId = req.payload.id
      const response = await account.getAllowedIPAddresses(userId)
      return res.json(response)
    } catch (e) {
      console.error(e)
      return res.status(501).json({ success: false })
    }
  }
)

router.post(
  '/ipaddr',
  auth.required,
  body('address').isIP(4),
  validate,
  async function (req: Request, res: Response) {
    try {
      const userId = req.payload.id
      const response = await account.addAllowedIPAddress(userId, req.body)
      return res.json(response)
    } catch (e) {
      return res.status(501).json({
        success: false,
        errors: errorMessage(e),
      })
    }
  }
)

export default router
