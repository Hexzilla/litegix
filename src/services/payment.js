const valiator = require('express-validator')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const PaymentHistory = mongoose.model('Paymenthistory')
const agent = require('./agent')
const activity = require('./activity-service')

const getPaymentHistory = async function (req: Request, res: Response) {
  try {
    const user = await User.findById(req.payload.id)
    if (!user) {
      return res.status(501).json({
        success: false,
        message: 'Invalid User',
      })
    }

    const newPaymentHistory = new PaymentHistory({
      userId: '60f841ba0d0e24372c06e328',
      amount: 99,
      type: 'cc',
      date: '2021-7-21',
      invoice: 'invoice',
      receipt: 'receipt',
    })

    // For paymenthistory Add test
    await createPaymentHistory(
      res,
      req,
      async function () {},
      newPaymentHistory
    )
    //<---------------------------

    const paymentHistories = await PaymentHistory.find({
      userId: req.payload.id,
    }).sort({ date: -1 })

    return res.json({
      success: true,
      data: paymentHistories,
    })
  } catch (e) {
    console.error(e)
    return res.status(501).json({ success: false })
  }
}

const createPaymentHistory = async function (req, res, next, payInform) {
  try {
    const paymentHistory = new PaymentHistory({
      userId: payInform.userId,
      amount: payInform.amount,
      type: payInform.type,
      date: payInform.date,
      invoice: payInform.invoice,
      receipt: payInform.receipt,
    })
    await paymentHistory.save().catch(next)
  } catch (e) {
    console.error(e)
    return res.status(501).json({ success: false })
  }
}

export default {
  getPaymentHistory,
  createPaymentHistory,
}
