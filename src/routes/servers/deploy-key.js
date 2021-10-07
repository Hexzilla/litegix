import { body } from 'express-validator'
import { Router, Request, Response, NextFunction } from 'express'
const auth = require('../auth')
import validate from 'routes/validate'
const system = require('../../services/system-service')

router.get('/', auth.required, async function (req: Request, res: Response) {
  try {
    const response = await system.getDeploymentKeys(req.server)
    return res.json(response)
  } catch (e) {
    console.error(e)
    return res.status(501).json({ success: false })
  }
})

router.post(
  '/',
  auth.required,
  body('userId').isString(),
  validate,
  async function (req: Request, res: Response) {
    try {
      const userId = req.body.userId
      const response = await system.storeDeploymentKey(req.server, userId)
      return res.json(response)
    } catch (e) {
      console.error(e)
      return res.status(501).json({ success: false })
    }
  }
)

export default router
