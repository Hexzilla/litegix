import { Router } from 'express'
import profile from './profile'
import account from './account'
// import apiKeys from './apiKeys'
// import notifications from './notifications'
// import ipwhitelist from './ipwhitelist'
// import activity from './activity'

const router = Router()
router.use('/profile', profile)
router.use('/account', account)
// router.use('/apikey', apiKeys)
// router.use('/notifications', notifications)
// router.use('/ipwhitelist', ipwhitelist)
// router.use('/activity', activity)

export default router
