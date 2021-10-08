import { body } from 'express-validator'
import { Router, Request, Response, NextFunction } from 'express'
import auth from '../auth'
import application from 'services/webapp.service'
const router = Router()

router.post(
  '/',
  auth.required,
  body('serverId').isString(),
  application.getWebApplications
)

router.post(
  '/create',
  auth.required,
  body('serverId').isString(),
  body('name').isString(),
  body('domain').isString(),
  body('owner').isString(),
  body('phpVersion').isString(),
  body('stack').isString(),
  body('sslMethod').isString(),
  application.createWebApplication
)

router.post(
  '/store/custom',
  auth.required,
  body('serverId').isString(),
  body('name').isString(),
  body('domainSelection').isString(),
  body('domainName').isString(),
  body('useExistingUser').isBoolean(),
  body('user').isString(),
  body('newUser').isString(),
  body('publicPath').isString(),
  body('phpVersion').isString(),
  body('stack').isString(),
  body('stackMode').isString(),
  body('advanceSetting').isBoolean(),
  /*body('clickjackingProtection').isBoolean(),
  body('xssProtection').isBoolean(),
  body('mimeSniffingProtection').isBoolean(),
  body('proxyProtocol').isBoolean(),
  body('processManager').isString(),
  body('processManagerStartServers').isNumeric(),
  body('processManagerMinSpareServers').isNumeric(),
  body('processManagerMaxSpareServers').isNumeric(),
  body('processManagerMaxChildren').isNumeric(),
  body('processManagerMaxRequests').isNumeric(),
  body('openBasedir').isString(),
  body('timezone').isString(),
  body('disableFunctions').isString(),
  body('maxExecutionTime').isNumeric(),*/
  application.storeCustomWebApplication
)

router.post(
  '/store/wordpress',
  auth.required,
  body('serverId').isString(),
  body('name').isString(),
  body('domainSelection').isString(),
  body('domainName').isString(),
  body('useExistingUser').isBoolean(),
  body('user').isString(),
  body('newUser').isString(),
  body('publicPath').isString(),
  body('phpVersion').isString(),
  body('stack').isString(),
  body('stackMode').isString(),
  body('advanceSetting').isBoolean(),
  /*body('clickjackingProtection').isBoolean(),
  body('xssProtection').isBoolean(),
  body('mimeSniffingProtection').isBoolean(),
  body('proxyProtocol').isBoolean(),
  body('processManager').isString(),
  body('processManagerStartServers').isNumeric(),
  body('processManagerMinSpareServers').isNumeric(),
  body('processManagerMaxSpareServers').isNumeric(),
  body('processManagerMaxChildren').isNumeric(),
  body('processManagerMaxRequests').isNumeric(),
  body('openBasedir').isString(),
  body('timezone').isString(),
  body('disableFunctions').isString(),
  body('maxExecutionTime').isNumeric(),*/
  application.storeWordpressWebApplication
)

router.delete(
  '/',
  auth.required,
  body('serverId').isString(),
  body('name').isString(),
  application.deleteWebApplication
)

export default router
