//import { body } from 'express-validator'
import { Router, Request, Response } from 'express'
import auth from '../auth'
//import validate from 'routes/validate'
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

router.get(
  '/create/custom',
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const response = await webappService.createCustomWebApplication(
        req.server
      )
      return res.json(response)
    } catch (e) {
      return catchError(res, e)
    }
  }
)

// router.post(
//   '/create',
//   auth.required,
//   body('serverId').isString(),
//   body('name').isString(),
//   body('domain').isString(),
//   body('owner').isString(),
//   body('phpVersion').isString(),
//   body('stack').isString(),
//   body('sslMethod').isString(),
//   application.createWebApplication
// )

// router.post(
//   '/store/custom',
//   auth.required,
//   body('serverId').isString(),
//   body('name').isString(),
//   body('domainSelection').isString(),
//   body('domainName').isString(),
//   body('useExistingUser').isBoolean(),
//   body('user').isString(),
//   body('newUser').isString(),
//   body('publicPath').isString(),
//   body('phpVersion').isString(),
//   body('stack').isString(),
//   body('stackMode').isString(),
//   body('advanceSetting').isBoolean(),
//   /*body('clickjackingProtection').isBoolean(),
//   body('xssProtection').isBoolean(),
//   body('mimeSniffingProtection').isBoolean(),
//   body('proxyProtocol').isBoolean(),
//   body('processManager').isString(),
//   body('processManagerStartServers').isNumeric(),
//   body('processManagerMinSpareServers').isNumeric(),
//   body('processManagerMaxSpareServers').isNumeric(),
//   body('processManagerMaxChildren').isNumeric(),
//   body('processManagerMaxRequests').isNumeric(),
//   body('openBasedir').isString(),
//   body('timezone').isString(),
//   body('disableFunctions').isString(),
//   body('maxExecutionTime').isNumeric(),*/
//   application.storeCustomWebApplication
// )

// router.post(
//   '/store/wordpress',
//   auth.required,
//   body('serverId').isString(),
//   body('name').isString(),
//   body('domainSelection').isString(),
//   body('domainName').isString(),
//   body('useExistingUser').isBoolean(),
//   body('user').isString(),
//   body('newUser').isString(),
//   body('publicPath').isString(),
//   body('phpVersion').isString(),
//   body('stack').isString(),
//   body('stackMode').isString(),
//   body('advanceSetting').isBoolean(),
//   /*body('clickjackingProtection').isBoolean(),
//   body('xssProtection').isBoolean(),
//   body('mimeSniffingProtection').isBoolean(),
//   body('proxyProtocol').isBoolean(),
//   body('processManager').isString(),
//   body('processManagerStartServers').isNumeric(),
//   body('processManagerMinSpareServers').isNumeric(),
//   body('processManagerMaxSpareServers').isNumeric(),
//   body('processManagerMaxChildren').isNumeric(),
//   body('processManagerMaxRequests').isNumeric(),
//   body('openBasedir').isString(),
//   body('timezone').isString(),
//   body('disableFunctions').isString(),
//   body('maxExecutionTime').isNumeric(),*/
//   application.storeWordpressWebApplication
// )

// router.delete(
//   '/',
//   auth.required,
//   body('serverId').isString(),
//   body('name').isString(),
//   application.deleteWebApplication
// )

export default router
