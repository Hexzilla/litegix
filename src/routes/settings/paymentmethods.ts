import { Router, Request, Response } from 'express'
import { body } from 'express-validator'
import auth from 'routes/auth'
import validate from 'routes/validate'
import errorMessage from 'routes/errors'
import * as paymentSvc from 'services/payment.service'
const router = Router()

router.get('/', auth.required, async function (req: Request, res: Response) {
  try {
    const response = await paymentSvc.getPaymentMethods(req.payload.id)
    return res.json(response)
  } catch (e) {
    console.error(e)
    return res.status(501).json({
      success: false,
      errors: errorMessage(e),
    })
  }
})

router.post(
  '/',
  auth.required,
  body('name').isString(),
  body('country').isString(),
  body('postcode').isString(),
  body('cardNumber').isString(),
  body('expire').isString(),
  body('cvc').isString(),
  validate,
  async function (req: Request, res: Response) {
    try {
      const userId = req.payload.id
      const response = await paymentSvc.storePaymentMethods(userId, req.body)
      return res.json(response)
    } catch (e) {
      console.error(e)
      return res.status(501).json({
        success: false,
        errors: errorMessage(e),
      })
    }
  }
)

export default router
