import { body } from 'express-validator'
import { Router, Request, Response } from 'express'
import auth from '../auth'
import validate from 'routes/validate'
import errorMessage from 'routes/errors'
import * as database from 'services/database.service'
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
    const response = await database.getDatabases(req.server)
    return res.json(response)
  } catch (e) {
    return catchError(res, e)
  }
})

router.get(
  '/create',
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const response = await database.createDatabase(req.server)
      res.json(response)
    } catch (e) {
      return catchError(res, e)
    }
  }
)

router.post(
  '/',
  auth.required,
  body('name').isString(),
  body('userId').isString(),
  validate,
  async function (req: Request, res: Response) {
    try {
      const response = await database.storeDatabase(req.server, req.body)
      res.json(response)
    } catch (e) {
      return catchError(res, e)
    }
  }
)

router.delete(
  '/:databaseId',
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const databaseId = req.params.databaseId
      const response = await database.deleteDatabase(req.server, databaseId)
      res.json(response)
    } catch (e) {
      return catchError(res, e)
    }
  }
)

router.post(
  '/:databaseId/grant',
  auth.required,
  body('dbuserId').isString(),
  async function (req: Request, res: Response) {
    try {
      const databaseId = req.params.databaseId
      const dbuserId = req.body.dbuserId
      const r = await database.grantDatabaseUser(
        req.server,
        databaseId,
        dbuserId
      )
      res.json(r)
    } catch (e) {
      return catchError(res, e)
    }
  }
)

router.delete(
  '/:databaseId/grant/:dbuserId',
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const databaseId = req.params.databaseId
      const dbuserId = req.params.dbuserId
      const r = await database.revokeDatabaseUser(
        req.server,
        databaseId,
        dbuserId
      )
      res.json(r)
    } catch (e) {
      return catchError(res, e)
    }
  }
)

router.get(
  '/:databaseId/users/ungranted',
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const databaseId = req.params.databaseId
      const r = await database.getUngrantedDBUsers(req.server, databaseId)
      res.json(r)
    } catch (e) {
      return catchError(res, e)
    }
  }
)

router.get(
  '/users',
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const response = await database.getDatabaseUserList(req.server)
      return res.json(response)
    } catch (e) {
      return catchError(res, e)
    }
  }
)

router.get(
  '/users/:dbuserId',
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const dbuserId = req.params.dbuserId
      const response = await database.getDatabaseUser(dbuserId)
      return res.json(response)
    } catch (e) {
      return catchError(res, e)
    }
  }
)

router.post(
  '/users',
  auth.required,
  body('name').isString(),
  body('password').isString(),
  validate,
  async function (req: Request, res: Response) {
    try {
      const response = await database.storeDatabaseUser(req.server, req.body)
      return res.json(response)
    } catch (e) {
      return catchError(res, e)
    }
  }
)

router.put(
  '/users/:dbuserId/password',
  auth.required,
  body('password').isString(),
  validate,
  async function (req: Request, res: Response) {
    try {
      const dbuserId = req.params.dbuserId
      const response = await database.changePassword(
        req.server,
        dbuserId,
        req.body.password
      )
      return res.json(response)
    } catch (e) {
      return catchError(res, e)
    }
  }
)

router.delete(
  '/users/:userId',
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const userId = req.params.userId
      const response = await database.deleteDatabaseUser(req.server, userId)
      return res.json(response)
    } catch (e) {
      return catchError(res, e)
    }
  }
)

export default router
