import { Router, Request, Response } from 'express'
import auth from 'routes/auth'
import * as installSvc from 'services/install.service'
const router = Router()

router.get(
  '/bashscript',
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const userId = req.payload.id
      const response = await installSvc.getBashScript(userId, req.server)
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
      const response = await installSvc.getInstallStatus(req.server)
      res.json(response)
    } catch (e) {
      console.error(e)
      return res.status(501).json({ success: false })
    }
  }
)

export default router
