import { body } from 'express-validator'
import { Router, Request, Response, NextFunction } from 'express'
import auth from '../auth'
const server = require('../../services/server-service')

router.get('/', auth.required, server.getServers)

export default router
