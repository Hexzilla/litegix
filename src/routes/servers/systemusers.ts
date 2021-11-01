import { body } from 'express-validator'
import { Router, Request, Response } from 'express'
import auth from '../auth'
import validate from 'routes/validate'
import errorMessage from 'routes/errors'
import * as systemService from 'services/system.service'
const router = Router()

const catchError = function (res: Response, e: any) {
  console.error(e)
  return res.status(501).json({
    success: false,
    errors: errorMessage(e),
  })
}

router.get('/', auth.required, async function (req: Request, res: Response) {
  try {
    const response = await systemService.getSystemUsers(req.server)
    return res.json(response)
  } catch (e) {
    console.error(e)
    return res.status(501).json({ success: false })
  }
})

router.get(
  '/:userId',
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const userId = req.params.userId
      const response = await systemService.getSystemUserById(req.server, userId)
      return res.json(response)
    } catch (e) {
      return catchError(res, e)
    }
  }
)

router.post(
  '/',
  auth.required,
  body('name').isString(),
  body('password').isString(),
  validate,
  async function (req: Request, res: Response) {
    try {
      const response = await systemService.storeSystemUser(req.server, req.body)
      return res.json(response)
    } catch (e) {
      return catchError(res, e)
    }
  }
)

router.put(
  '/:userId/password',
  auth.required,
  body('password').isLength({ min: 8 }).trim().escape(),
  validate,
  async function (req: Request, res: Response) {
    try {
      const userId = req.params.userId
      const response = await systemService.changeSystemUserPassword(
        req.server,
        userId,
        req.body.password
      )
      return res.json(response)
    } catch (e) {
      return catchError(res, e)
    }
  }
)

router.delete(
  '/:userId',
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const userId = req.params.userId
      const response = await systemService.deleteSystemUser(req.server, userId)
      return res.json(response)
    } catch (e) {
      return catchError(res, e)
    }
  }
)

export default router
