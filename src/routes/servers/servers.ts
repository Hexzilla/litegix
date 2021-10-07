import { body } from 'express-validator'
import { Router, Request, Response } from 'express'
import auth from '../auth'
import validate from 'routes/validate'
import * as server from 'services/server.service'
const router = Router()

router.get('/', auth.required, async function (req: Request, res: Response) {
  try {
    const response = await server.getServers(req.payload.id)
    return res.json(response)
  } catch (e) {
    console.error(e)
    return res.status(501).json({ success: false })
  }
})

router.post(
  '/',
  auth.required,
  body('name').notEmpty(),
  body('address').isIP(4),
  body('webserver').notEmpty(),
  body('database').notEmpty(),
  body('phpVersion').notEmpty(),
  validate,
  async function (req: Request, res: Response) {
    try {
      const response = await server.storeServer(req.payload.id, req.body)
      return res.json(response)
    } catch (e) {
      console.error(e)
      return res.status(501).json({ success: false })
    }
  }
)

export default router
