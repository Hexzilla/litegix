import { body } from 'express-validator'
import { Router, Request, Response } from 'express'
import auth from '../auth'
import validate from 'routes/validate'
import * as serverService from 'services/server.service'
const router = Router()

router.delete('/', auth.required, async function (req: Request, res: Response) {
  try {
    const response = await serverService.deleteServer(req.server)
    return res.json(response)
  } catch (e) {
    console.error(e)
    return res.status(501).json({ success: false })
  }
})

router.post('/summary', auth.required, serverService.getSummary)

router.get(
  '/phpVersion',
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const response = await serverService.getPhpVersion(req.server)
      return res.json(response)
    } catch (e) {
      console.error(e)
      return res.status(501).json({ success: false })
    }
  }
)

router.put(
  '/phpVersion',
  auth.required,
  body('phpVersion').notEmpty(),
  validate,
  async function (req: Request, res: Response) {
    try {
      const phpVersion = req.body.phpVersion
      const response = await serverService.updatePhpVersion(
        req.server,
        phpVersion
      )
      return res.json(response)
    } catch (e) {
      console.error(e)
      return res.status(501).json({ success: false })
    }
  }
)

export default router
