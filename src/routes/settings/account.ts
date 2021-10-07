import { body } from 'express-validator'
import { Router, Request, Response, NextFunction } from 'express'
import auth from '../auth'
import authService from 'services/auth.service'
const router = Router()

// Upate user profile
router.post(
  '/password/update',
  auth.required,
  body('current_password').isString(),
  body('password').isString().isLength({ min: 8 }),
  //body('password_confirm').matches('password').withMessage('Passwords must match.'),
  authService.changePassword
)

router.delete('/', auth.required, authService.deleteAccount)

export default router
