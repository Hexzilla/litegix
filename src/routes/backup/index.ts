import { Router, Request, Response, NextFunction } from 'express'

router.use('/database', require('./database'))

export default router
