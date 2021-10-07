import { body } from 'express-validator'
import { Router, Request, Response, NextFunction } from 'express'
import payment from 'services/payment.service'
import auth from '../auth'

const router = Router()
router.post('/history', auth.required, payment.getPaymentHistory)

export default router
