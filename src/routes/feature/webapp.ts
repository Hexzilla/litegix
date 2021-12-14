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

router.post(
  '/:webappId/ssl',
  body('mode').isString(),
  body('provider').isString(),
  body('authMethod').isString(),
  validate,
  async function (req: Request, res: Response) {
    try {
      const response = await webappService.storeWebSSL(
        req.server,
        req.params.webappId,
        req.body
      )
      return res.json(response)
    } catch (e) {
      return catchError(res, e)
    }
  }
)

router.post(
  '/:webappId/deploy',
  body('provider').isString(),
  body('repository').isString(),
  body('branch').isString(),
  validate,
  async function (req: Request, res: Response) {
    try {
      const response = await webappService.storeGitRepository(
        req.server,
        req.params.webappId,
        req.body
      )
      return res.json(response)
    } catch (e) {
      return catchError(res, e)
    }
  }
)

router.get(
  '/:webappId/filemanager/list/:folder',
  async function (req: Request, res: Response) {
    try {
      const response = await webappService.getFileList(
        req.server,
        req.params.webappId,
        req.params.folder
      )
      return res.json(response)
    } catch (e) {
      return catchError(res, e)
    }
  }
)

router.get(
  '/:webappId/filemanager/create/file/:name',
  async function (req: Request, res: Response) {
    try {
      const response = await webappService.createFile(
        req.server,
        req.params.webappId,
        req.params.name
      )
      return res.json(response)
    } catch (e) {
      return catchError(res, e)
    }
  }
)

router.get(
  '/:webappId/filemanager/create/folder/:name',
  async function (req: Request, res: Response) {
    try {
      const response = await webappService.createFolder(
        req.server,
        req.params.webappId,
        req.params.name
      )
      return res.json(response)
    } catch (e) {
      return catchError(res, e)
    }
  }
)

router.post(
  '/:webappId/filemanager/changename',
  body('oldname').isString(),
  body('newname').isString(),
  validate,
  async function (req: Request, res: Response) {
    try {
      const response = await webappService.changeFileName(
        req.server,
        req.params.webappId,
        req.body.oldname,
        req.body.newname
      )
      return res.json(response)
    } catch (e) {
      return catchError(res, e)
    }
  }
)

router.post(
  '/:webappId/filemanager/change_permission',
  body('permission').isString(),
  validate,
  async function (req: Request, res: Response) {
    try {
      const response = await webappService.changeFilePermission(
        req.server,
        req.params.webappId,
        req.body.permission,
      )
      return res.json(response)
    } catch (e) {
      return catchError(res, e)
    }
  }
)

router.get('/:webappId', auth.required, async function (req: Request, res: Response) {
  try {
    const response = await webappService.findWebappById(req.params.webappId)
    return res.json(response)
  } catch (e) {
    return catchError(res, e)
  }
})
export default router
