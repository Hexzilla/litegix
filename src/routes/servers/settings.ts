import { body } from 'express-validator'
import { Router, Request, Response, NextFunction } from 'express'
import auth from '../auth'
import validate from 'routes/validate'
import server from 'services/server.service'
const router = Router()

// router.get("/", auth.required, server.getServers)

router.get('/', auth.required, server.getServerInfo)

router.post(
  '/update',
  auth.required,
  body('name').notEmpty(),
  body('provider').notEmpty(),
  server.updateSetting
)

export default router
