//import { body } from 'express-validator'
import { Router } from 'express'
import { /*validate,*/ createHandler as ch } from 'routes/helper'
import auth from '../auth'
import * as userService from 'services/user.service'
const router = Router()

router.get(
  '/',
  auth.required,
  ch(() => userService.getUsers())
)

/*router.post(
  '/',
  auth.required,
  body('name').isString(),
  body('userId').isString(),
  validate,
  ch(({ server, body }) => userService.storeDatabase(server, body))
)

router.delete(
  '/:databaseId',
  auth.required,
  ch(({ server, params }) =>
    userService.deleteDatabase(server, params.databaseId)
  )
)*/

export default router
