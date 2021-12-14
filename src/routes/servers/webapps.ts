import { body } from 'express-validator'
import { Router, Request, Response } from 'express'
import auth from '../auth'
import validate from 'routes/validate'
import errorMessage from 'routes/errors'
import * as webappService from 'services/webapps.service'
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
    const response = await webappService.getWebApplications(req.server)
    return res.json(response)
  } catch (e) {
    return catchError(res, e)
  }
})

router.get('/custom', auth.required, async function (req: Request, res: Response) {
  try {
    const response = await webappService.createCustomWebApplication(
      req.server
    )
    return res.json(response)
  } catch (e) {
    return catchError(res, e)
  }
})

router.post(
  '/custom',
  auth.required,
  body('name').isString(),
  body('domainType').isString(),
  body('domainName').isString(),
  body('enableW3Version').isBoolean(),
  body('owner').isString(),
  body('publicPath').isString(),
  body('phpVersion').isString(),
  body('webAppStack').isString(),
  body('stackMode').isString(),
  body('sslMode').isString(),
  body('enableAutoSSL').isBoolean(),
  validate,
  async function (req: Request, res: Response) {
    try {
      const response = await webappService.storeCustomWebApplication(
        req.server,
        req.body
      )
      return res.json(response)
    } catch (e) {
      return catchError(res, e)
    }
  }
)

router.get(
  '/wordpress',
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const response = await webappService.createWordpressApplication(
        req.server
      )
      return res.json(response)
    } catch (e) {
      return catchError(res, e)
    }
  }
)

router.post(
  '/wordpress',
  auth.required,
  body('name').isString(),
  body('domainType').isString(),
  body('domainName').isString(),
  body('enableW3Version').isBoolean(),
  body('owner').isString(),
  body('phpVersion').isString(),
  body('webAppStack').isString(),
  body('sslMode').isString(),
  body('enableAutoSSL').isBoolean(),
  body('wordpress.siteTitle').isString(),
  body('wordpress.adminUserName').isString(),
  body('wordpress.adminPassword').isString(),
  body('wordpress.adminEmail').isString(),
  validate,
  async function (req: Request, res: Response) {
    try {
      const response = await webappService.storeWordpressApplication(
        req.server,
        req.body
      )
      return res.json(response)
    } catch (e) {
      return catchError(res, e)
    }
  }
)

export default router
