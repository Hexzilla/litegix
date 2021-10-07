import { body } from 'express-validator'
import { Router, Request, Response, NextFunction } from 'express'
const auth = require('../auth')
import validate from 'routes/validate'
const server = require('../../services/server-service')

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
