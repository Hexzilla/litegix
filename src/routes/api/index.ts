import { Router, Request, Response, NextFunction } from 'express'
import users from './users'
import installation from './installation'
import agent from './agent'

const router = Router()
router.use('/', users)
router.use('/installation', installation)
router.use('/agent', agent)

export default router
