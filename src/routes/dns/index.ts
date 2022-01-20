import { Router } from 'express'
import { body } from 'express-validator'
import { validate, createHandler as ch } from 'routes/helper'
import auth from 'routes/auth'
import * as dns from 'services/dns.service'
const router = Router()

router.get(
  '/domainrecord',
  auth.required,
  ch(({ payload }) => dns.getDomainRecords(payload.id))
)

router.post(
  '/domainrecord',
  auth.required,
  body('type').isString(),
  body('hostname').isString(),
  body('content').isString(),
  body('ttl').isString(),
  body('proxyStatus').isString(),
  validate,
  ch(({ payload, body }) => dns.storeDomainRecord(payload.id, body))
)

export default router
