import { body } from 'express-validator'
import { Router, Request, Response } from 'express'
import validate from 'routes/validate'
import errorMessage from 'routes/errors'
import auth from '../auth'
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
    const response = await systemService.getServerSSHKeys(req.server)
    return res.json(response)
  } catch (e) {
    return catchError(res, e)
  }
})

//router.get('/vault', auth.required, systemService.getVaultedSSHKeys)

router.get(
  '/create',
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const response = await systemService.createServerSSHKey(req.server)
      return res.json(response)
    } catch (e) {
      return catchError(res, e)
    }
  }
)

router.post(
  '/',
  auth.required,
  body('label').notEmpty(),
  body('userId').notEmpty(),
  body('publicKey').notEmpty(),
  validate,
  async function (req: Request, res: Response) {
    try {
      const response = await systemService.storeServerSSHKey(
        req.server,
        req.body
      )
      return res.json(response)
    } catch (e) {
      return catchError(res, e)
    }
  }
)

router.delete(
  '/:keyId',
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const keyId = req.params.keyId
      const response = await systemService.deleteServerSSHKey(req.server, keyId)
      return res.json(response)
    } catch (e) {
      return catchError(res, e)
    }
  }
)

export default router
