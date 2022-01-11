import { body } from 'express-validator'
import { Router } from 'express'
import { validate, createHandler as ch } from 'routes/helper'
import auth from '../auth'
import * as webappService from 'services/webapps.service'
const router = Router()

router.get(
  '/',
  auth.required,
  ch(({ server }) => webappService.getWebApplications(server))
)

router.get(
  '/custom',
  auth.required,
  ch(({ server }) => webappService.createCustomWebApplication(server))
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
  ch(({ server, body }) =>
    webappService.storeCustomWebApplication(server, body)
  )
)

router.get(
  '/wordpress',
  auth.required,
  ch(({ server }) => webappService.createWordpressApplication(server))
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
  ch(({ server, body }) =>
    webappService.storeWordpressApplication(server, body)
  )
)

router.get(
  '/:webappId/summary',
  auth.required,
  ch(({ server, params }) => webappService.getSummary(server, params.webappId))
)

router.post(
  '/:webappId/ssl',
  auth.required,
  body('mode').isString(),
  body('provider').isString(),
  body('authMethod').isString(),
  validate,
  ch(({ server, params, body }) =>
    webappService.storeWebSSL(server, params.webappId, body)
  )
)

router.post(
  '/:webappId/deploy',
  auth.required,
  body('provider').isString(),
  body('repository').isString(),
  body('branch').isString(),
  validate,
  ch(({ server, params, body }) =>
    webappService.storeGitRepository(server, params.webappId, body)
  )
)

router.get(
  '/:webappId/domains',
  auth.required,
  ch(({ params }) => webappService.getDomains(params.webappId))
)

router.post(
  '/:webappId/domains',
  auth.required,
  body('type').isString(),
  body('name').isString(),
  body('www').isBoolean(),
  body('preferedDomain').isNumeric(),
  body('dnsIntegration').isString(),
  ch(({ params, body }) => webappService.addDomain(params.webappId, body))
)

router.post(
  '/:webappId/domains/:domainId/update',
  auth.required,
  body('type').isString(),
  ch(({ params, body }) =>
    webappService.updateDomain(params.webappId, params.domainId, body)
  )
)

router.delete(
  '/:webappId/domains/:domainId',
  auth.required,
  ch(({ params }) =>
    webappService.deleteDomain(params.webappId, params.domainId)
  )
)

router.get(
  '/:webappId/filemanager/list/:folder',
  auth.required,
  ch(({ server, params }) =>
    webappService.getFileList(server, params.webappId, params.folder)
  )
)

router.get(
  '/:webappId/filemanager/create/file/:name',
  auth.required,
  ch(({ server, params }) =>
    webappService.createFile(server, params.webappId, params.name)
  )
)

router.get(
  '/:webappId/filemanager/create/folder/:name',
  auth.required,
  ch(({ server, params }) =>
    webappService.createFolder(server, params.webappId, params.name)
  )
)

router.post(
  '/:webappId/filemanager/changename',
  auth.required,
  body('oldname').isString(),
  body('newname').isString(),
  validate,
  ch(({ server, params, body }) =>
    webappService.changeFileName(
      server,
      params.webappId,
      body.oldname,
      body.newname
    )
  )
)

router.post(
  '/:webappId/filemanager/change_permission',
  auth.required,
  body('permission').isString(),
  validate,
  ch(({ server, params, body }) =>
    webappService.changeFilePermission(server, params.webappId, body.permission)
  )
)

router.get(
  '/:webappId',
  auth.required,
  ch(({ params }) => webappService.findWebappById(params.webappId))
)

export default router
