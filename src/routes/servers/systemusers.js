import { body } from 'express-validator'
import { Router, Request, Response, NextFunction } from 'express'
const auth = require('../auth')
import validate from 'routes/validate'
const system = require('../../services/system-service')

router.get('/', auth.required, async function (req: Request, res: Response) {
  try {
    const response = await system.getSystemUsers(req.server)
    return res.json(response)
  } catch (e) {
    console.error(e)
    return res.status(501).json({ success: false })
  }
})

router.get(
  '/:userId',
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const userId = req.params.userId
      const response = await system.getSystemUserById(req.server, userId)
      return res.json(response)
    } catch (e) {
      console.error(e)
      return res.status(501).json({ success: false })
    }
  }
)

router.post(
  '/',
  auth.required,
  body('name').isString(),
  body('password').isString(),
  validate,
  async function (req: Request, res: Response) {
    try {
      const response = await system.storeSystemUser(req.server, req.body)
      return res.json(response)
    } catch (e) {
      console.error(e)
      return res.status(501).json({ success: false })
    }
  }
)

router.post(
  '/changepassword',
  auth.required,
  body('id').isString(),
  body('password').isLength({ min: 8 }).trim().escape(),
  system.changeSystemUserPassword
)

router.delete(
  '/:userId',
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const userId = req.params.userId
      const response = await system.deleteSystemUser(req.server, userId)
      return res.json(response)
    } catch (e) {
      console.error(e)
      return res.status(501).json({ success: false })
    }
  }
)

export default router
