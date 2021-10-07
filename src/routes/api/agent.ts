import { Router, Request, Response, NextFunction } from 'express'
import { body } from 'express-validator'
import validate from 'routes/validate'
import server from 'services/server.service'

const router = Router()
router.post(
  '/:serverId/monitor/state',
  body('memory').notEmpty(),
  body('cpu').notEmpty(),
  body('disk').notEmpty(),
  body('loadavg').notEmpty(),
  validate,
  server.updateServerUsage
)

export default router
