import { Router, Request, Response, NextFunction } from 'express'
import { body } from 'express-validator'
import api from './api'
import settings from './settings'
import servers from './servers'
import subscriptions from './subscriptions'
import payment from './payment'
import authService from 'services/auth'

const router = Router()
router.use('/api', api)
router.use('/settings', settings)
router.use('/servers', servers)
router.use('/subscriptions', subscriptions)
router.use('/payment', payment)

router.post(
  '/login',
  body('email').notEmpty(),
  body('password').notEmpty(),
  authService.login
)

router.post(
  '/signup',
  body('name').notEmpty(),
  body('email').notEmpty(),
  body('password').notEmpty(),
  authService.signup
)

router.get('/logout', authService.logout)

// request user verify
router.post('/verify/:userId/:verifyCode', authService.userVerify)

router.use(function (err, req: Request, res: Response, next: NextFunction) {
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function (errors, key) {
        errors[key] = err.errors[key].message

        return errors
      }, {}),
    })
  }

  return next(err)
})

/*const cryptoService = require('../services/crypto')
const encrypted = cryptoService.encrypt("Hello World. www.maazone.com!!!192020$$$###")
const decrypted = cryptoService.decrypt(encrypted)
console.log('crypto', encrypted, decrypted)*/

export default router
