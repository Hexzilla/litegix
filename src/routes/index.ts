import { Router, Request, Response, NextFunction } from 'express'
import { body } from 'express-validator'
import api from './api'
import settings from './settings'
import servers from './servers'
import webapps from './feature/webapp'
import payment from './payment'
import * as authService from 'services/auth.service'

const router = Router()
router.get('/', (req: Request, res: Response) => {
  res.send('Litegix')
})

router.use('/api', api)
router.use('/settings', settings)
router.use('/servers', servers)
router.use('/webapps', webapps)
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

router.use(function (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      errors: err.array(), //TODO~~~~~~~~~~~
    })
  }

  return next(err)
})

export default router
