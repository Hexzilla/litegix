import { Router } from 'express'
import { model } from 'mongoose'
import { Server } from 'models/server.model'
import users from './users'
import servers from './servers'
const Server = model<Server>('Server')
const router = Router()

router.use('/users', users)
router.use('/servers', servers)

export default router
