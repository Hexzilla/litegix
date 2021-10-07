import { body } from 'express-validator'
import { Router, Request, Response, NextFunction } from 'express'
const auth = require('../auth')
import validate from 'routes/validate'
const server = require('../../services/server-service')
const install = require('../../services/install-service')

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
