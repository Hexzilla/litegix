import { Router } from 'express'
import { model } from 'mongoose'
import { Server } from 'models/server.model'
import users from './users'
const Server = model<Server>('Server')
const router = Router()

router.use('/users', users)

export default router
