import { Router, Request, Response } from 'express'
import { body } from 'express-validator'
import auth from '../auth'
import validate from 'routes/validate'
import errorMessage from 'routes/errors'
import * as serverSvc from 'services/server.service'
const router = Router()

// router.get("/", auth.required, server.getServers)

router.get('/', auth.required, async function (req: Request, res: Response) {
  const server = req.server
  return res.json({
    success: true,
    data: {
      name: server.name,
      provider: server.provider,
      address: server.address,
    },
  })
})

router.put(
  '/details',
  auth.required,
  body('name').notEmpty(),
  body('provider').notEmpty(),
  validate,
  async function (req: Request, res: Response) {
    try {
      const response = await serverSvc.updateServerName(
        req.payload.id,
        req.server,
        req.body.name,
        req.body.provider
      )
      return res.json(response)
    } catch (e) {
      console.error(e)
      return res.status(501).json({
        success: false,
        errors: errorMessage(e),
      })
    }
  }
)

router.put(
  '/address',
  auth.required,
  body('address').isIP(4),
  validate,
  async function (req: Request, res: Response) {
    try {
      const response = await serverSvc.updateServerAddress(
        req.payload.id,
        req.server,
        req.body.address
      )
      return res.json(response)
    } catch (e) {
      console.error(e)
      return res.status(501).json({
        success: false,
        errors: errorMessage(e),
      })
    }
  }
)

export default router
