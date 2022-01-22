import { body } from 'express-validator'
import { Router } from 'express'
import { validate, createHandler as ch } from 'routes/helper'
import auth from '../auth'
import * as userService from 'services/user.service'
const router = Router()

router.get(
  '/',
  auth.required,
  ch(() => userService.getUsers())
)

router.post(
  '/',
  auth.required,
  body('email').isEmail(),
  body('username').isString().isLength({ min: 4, max: 260 }),
  body('password').isString().isLength({ min: 8, max: 260 }),
  validate,
  ch(({ body }) => userService.createUser(body))
)

router.delete(
  '/:userId',
  auth.required,
  ch(({ params }) => userService.deleteUser(params.userId))
)

export default router
