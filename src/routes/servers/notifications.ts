import { body } from 'express-validator'
import { Router, Request, Response, NextFunction } from 'express'
import auth from '../auth'
import server from 'services/server.service'
const router = Router()

router.get('/', auth.required, server.getServers)

export default router
