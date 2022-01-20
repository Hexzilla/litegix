import { Router } from 'express'
import { body } from 'express-validator'
import { validate, createHandler as ch } from 'routes/helper'
import auth from 'routes/auth'
import * as domain from 'services/domain.service'
const router = Router()

router.post(
  '/methods',
  auth.required,
  body('name').isString(),
  body('country').isString(),
  body('postcode').isString(),
  body('cardNumber').isString(),
  body('expire').isString(),
  body('cvc').isString(),
  validate,
  ch(({ payload, body }) => domain.storeDomain(payload.id, body))
)

export default router
