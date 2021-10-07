import { body } from 'express-validator'
import { Router, Request, Response, NextFunction } from 'express'
import auth from '../auth'
import validate from 'routes/validate'
import server from 'services/server.service'
const router = Router()

router.delete('/', auth.required, async function (req: Request, res: Response) {
  try {
    const response = await server.deleteServer(req.server)
    return res.json(response)
  } catch (e) {
    console.error(e)
    return res.status(501).json({ success: false })
  }
})

router.post('/summary', auth.required, server.getSummary)

router.get(
  '/phpVersion',
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const response = await server.getPhpVersion(req.server)
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
      const response = await server.updatePhpVersion(req.server, phpVersion)
      return res.json(response)
    } catch (e) {
      console.error(e)
      return res.status(501).json({ success: false })
    }
  }
)

export default router
