import { body } from 'express-validator'
import { Router, Request, Response, NextFunction } from 'express'
import { model } from 'mongoose'
import { Webapp } from 'models'
import { validate, createHandler as ch } from 'routes/helper'
import auth from '../auth'
import * as webappService from 'services/webapps.service'
const WebappModel = model<Webapp>('Webapp')
const router = Router()

// Preload server on routes with ':serverId'
router.param(
  'webappId',
  function (req: Request, res: Response, next: NextFunction, webappId: string) {
    WebappModel.findById(webappId)
      .then(function (webapp) {
        if (!webapp) {
          return res.sendStatus(404)
        }
        req.webapp = webapp
        return next()
      })
      .catch(next)
  }
)

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
  body('domain.name').isString(),
  body('domain.selection').isString(),
  body('domain.wwwEnabled').isBoolean(),
  body('domain.wwwVersion').isNumeric(),
  body('isUserExists').isBoolean(),
  body('owner').isString(),
  body('phpVersion').isString(),
  body('webAppStack').isString(),
  body('sslMethod').isString(),
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
  ch(({ server, webapp }) => webappService.getSummary(server, webapp))
)

router.post(
  '/:webappId/ssl',
  auth.required,
  body('domainId').isString(),
  body('mode').isString(),
  body('provider').isString(),
  body('authMethod').isString(),
  body('httpRedirection').isNumeric(),
  validate,
  ch(({ server, webapp, body }) =>
    webappService.storeWebSSL(server, webapp, body)
  )
)

router.post(
  '/:webappId/deploy',
  auth.required,
  body('provider').isString(),
  body('repository').isString(),
  body('branch').isString(),
  validate,
  ch(({ server, webapp, body }) =>
    webappService.storeGitRepository(server, webapp, body)
  )
)

router.get(
  '/:webappId/domains',
  auth.required,
  ch(({ webapp }) => webappService.getDomains(webapp))
)

router.get(
  '/:webappId/domains/:domainId',
  auth.required,
  ch(({ webapp, params }) =>
    webappService.getDomainById(webapp, params.domainId)
  )
)

router.post(
  '/:webappId/domains',
  auth.required,
  body('type').isString(),
  body('name').isString(),
  body('selection').isString(),
  body('wwwEnabled').isBoolean(),
  body('wwwVersion').isNumeric(),
  body('dnsIntegration').isString(),
  validate,
  ch(({ webapp, body }) => webappService.addDomain(webapp, body))
)

router.put(
  '/:webappId/domains/:domainId',
  auth.required,
  validate,
  ch(({ webapp, params, body }) =>
    webappService.updateDomain(webapp, params.domainId, body)
  )
)

router.delete(
  '/:webappId/domains/:domainId',
  auth.required,
  ch(({ webapp, params }) =>
    webappService.deleteDomain(webapp, params.domainId)
  )
)

router.get(
  '/:webappId/settings',
  auth.required,
  ch(({ webapp }) => webappService.getSettings(webapp))
)

router.put(
  '/:webappId/settings',
  auth.required,
  body('phpVersion').isString(),
  body('publicPath').isString(),
  body('sslMethod').isString(),
  body('webAppStack').isBoolean(),
  body('stackMode').isNumeric(),
  body('appType').isString(),
  ch(({ webapp, body }) => webappService.updateWebappSettings(webapp, body))
)

router.get(
  '/:webappId/filemanager/list/:folder',
  auth.required,
  ch(({ server, webapp, params }) =>
    webappService.getFileList(server, webapp, params.folder)
  )
)

router.get(
  '/:webappId/filemanager/create/file/:name',
  auth.required,
  ch(({ server, webapp, params }) =>
    webappService.createFile(server, webapp, params.name)
  )
)

router.get(
  '/:webappId/filemanager/create/folder/:name',
  auth.required,
  ch(({ server, webapp, params }) =>
    webappService.createFolder(server, webapp, params.name)
  )
)

router.post(
  '/:webappId/filemanager/changename',
  auth.required,
  body('oldname').isString(),
  body('newname').isString(),
  validate,
  ch(({ server, webapp, body }) =>
    webappService.changeFileName(server, webapp, body.oldname, body.newname)
  )
)

router.post(
  '/:webappId/filemanager/change_permission',
  auth.required,
  body('permission').isString(),
  validate,
  ch(({ server, webapp, body }) =>
    webappService.changeFilePermission(server, webapp, body.permission)
  )
)

router.get(
  '/:webappId',
  auth.required,
  ch(({ webapp }) => webappService.getWebapp(webapp))
)

export default router
