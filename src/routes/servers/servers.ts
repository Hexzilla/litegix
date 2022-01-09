import { body } from 'express-validator'
import { Router } from 'express'
import auth from '../auth'
import validate from 'routes/validate'
import { createHandler } from 'routes/helper'
import * as serverSvc from 'services/server.service'
const router = Router()

router.get(
  '/',
  auth.required,
  createHandler(({ payload }) => serverSvc.getServers(payload.id))
)

router.get(
  '/create',
  auth.required,
  createHandler(() => serverSvc.createServer())
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
  createHandler(({ payload, body }) => serverSvc.storeServer(payload.id, body))
)

export default router
