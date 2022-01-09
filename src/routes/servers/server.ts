import { body } from 'express-validator'
import { Router, Request, Response } from 'express'
import auth from '../auth'
import validate from 'routes/validate'
import errorMessage from 'routes/errors'
import { createHandler } from 'routes/helper'
import * as serverService from 'services/server.service'
import * as systemSvc from 'services/system.service'
const router = Router()

router.delete(
  '/',
  auth.required,
  createHandler(({ server }) => serverService.deleteServer(server))
)

router.post(
  '/summary',
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const json = await serverService.getSummary(req.server)
      return res.json(json)
    } catch (e) {
      return res.status(501).json({
        success: false,
        errors: errorMessage(e),
      })
    }
  }
)

router.get(
  '/phpVersion',
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const json = await systemSvc.getPhpVersion(req.server)
      return res.json(json)
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
      const json = await systemSvc.updatePhpVersion(req.server, phpVersion)
      return res.json(json)
    } catch (e) {
      console.error(e)
      return res.status(501).json({ success: false })
    }
  }
)

export default router
