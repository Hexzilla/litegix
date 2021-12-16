import { body } from 'express-validator'
import { Router } from 'express'
import auth from '../auth'
import validate from 'routes/validate'
import { handler } from 'utils'
import * as webappService from 'services/webapps.service'
const router = Router()

router.get(
  '/',
  auth.required,
  handler(async ({ server }) => {
    return await webappService.getWebApplications(server)
  })
)

router.get(
  '/custom',
  auth.required,
  handler(async ({ server }) => {
    return await webappService.createCustomWebApplication(server)
  })
)

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
  handler(async ({ server, body }) => {
    return await webappService.storeCustomWebApplication(server, body)
  })
)

router.get(
  '/wordpress',
  auth.required,
  handler(async ({ server }) => {
    return await webappService.createWordpressApplication(server)
  })
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
  handler(async ({ server, body }) => {
    return await webappService.storeWordpressApplication(server, body)
  })
)

router.get(
  '/:webappId/summary',
  auth.required,
  handler(async ({ server, params }) => {
    return await webappService.getSummary(server, params.webappId)
  })
)

router.post(
  '/:webappId/ssl',
  auth.required,
  body('mode').isString(),
  body('provider').isString(),
  body('authMethod').isString(),
  validate,
  handler(async ({ server, params, body }) => {
    return await webappService.storeWebSSL(server, params.webappId, body)
  })
)

router.post(
  '/:webappId/deploy',
  auth.required,
  body('provider').isString(),
  body('repository').isString(),
  body('branch').isString(),
  validate,
  handler(async ({ server, params, body }) => {
    return await webappService.storeGitRepository(server, params.webappId, body)
  })
)

router.get(
  '/:webappId/domains',
  auth.required,
  handler(async ({ params }) => {
    return await webappService.getDomains(params.webappId)
  })
)

router.post(
  '/:webappId/domains',
  auth.required,
  body('redirect').isString(),
  body('type').isString(),
  body('name').isString(),
  body('www').isBoolean(),
  body('dnsIntegration').isString(),
  handler(async ({ params, body }) => {
    return await webappService.addDomain(params.webappId, body)
  })
)

router.delete(
  '/:webappId/domains/:domainId',
  auth.required,
  handler(async ({ params }) => {
    return await webappService.deleteDomain(params.webappId, params.domainId)
  })
)

router.get(
  '/:webappId/filemanager/list/:folder',
  auth.required,
  handler(async ({ server, params }) => {
    return await webappService.getFileList(
      server,
      params.webappId,
      params.folder
    )
  })
)

router.get(
  '/:webappId/filemanager/create/file/:name',
  auth.required,
  handler(async ({ server, params }) => {
    return await webappService.createFile(server, params.webappId, params.name)
  })
)

router.get(
  '/:webappId/filemanager/create/folder/:name',
  auth.required,
  handler(async ({ server, params }) => {
    return await webappService.createFolder(
      server,
      params.webappId,
      params.name
    )
  })
)

router.post(
  '/:webappId/filemanager/changename',
  auth.required,
  body('oldname').isString(),
  body('newname').isString(),
  validate,
  handler(async ({ server, params, body }) => {
    return await webappService.changeFileName(
      server,
      params.webappId,
      body.oldname,
      body.newname
    )
  })
)

router.post(
  '/:webappId/filemanager/change_permission',
  auth.required,
  body('permission').isString(),
  validate,
  handler(async ({ server, params, body }) => {
    return await webappService.changeFilePermission(
      server,
      params.webappId,
      body.permission
    )
  })
)

router.get(
  '/:webappId',
  auth.required,
  handler(async ({ params }) => {
    return await webappService.findWebappById(params.webappId)
  })
)

export default router
