import { body } from 'express-validator'
import { Router, Request, Response, NextFunction } from 'express'
import auth from 'routes/auth'
import validate from 'routes/validate'
import server from 'services/server.service'
import install from 'services/install.service'
const router = Router()

router.get(
  '/bashscript',
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const userId = req.payload.id
      const response = await install.getBashScript(userId, req.server)
      res.json(response)
    } catch (e) {
      console.error(e)
      return res.status(501).json({ success: false })
    }
  }
)

router.get(
  '/installstatus',
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const response = await install.getInstallStatus(req.server)
      res.json(response)
    } catch (e) {
      console.error(e)
      return res.status(501).json({ success: false })
    }
  }
)

export default router
