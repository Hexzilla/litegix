import { body } from 'express-validator'
import { Router, Request, Response } from 'express'
import auth from '../auth'
import validate from 'routes/validate'
import * as serverSvc from 'services/server.service'
const router = Router()

router.get('/', auth.required, async function (req: Request, res: Response) {
  try {
    const ret = await serverSvc.getServers(req.payload.id)
    return res.json(ret)
  } catch (e) {
    console.error(e)
    return res.status(501).json({ success: false })
  }
})

router.get('/create', async function (req: Request, res: Response) {
    try {
      const ret = await serverSvc.createServer()
      return res.json(ret)
    } catch (e) {
      console.error(e)
      return res.status(501).json({ success: false })
    }
  }
)

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
      const ret = await serverSvc.storeServer(req.payload.id, req.body)
      return res.json(ret)
    } catch (e) {
      console.error(e)
      return res.status(501).json({ success: false })
    }
  }
)

export default router
