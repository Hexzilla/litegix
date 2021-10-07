var router = require('express').Router()
const payment = require('../../services/payment')
var auth = require('../auth')

router.post('/history', auth.required, payment.getPaymentHistory)

export default router
