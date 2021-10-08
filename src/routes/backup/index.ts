import { Router } from 'express'
const router = Router()

router.use('/database', require('./database'))

export default router
