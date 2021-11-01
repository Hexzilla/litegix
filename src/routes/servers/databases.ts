import { body } from 'express-validator'
import { Router, Request, Response } from 'express'
import auth from '../auth'
import validate from 'routes/validate'
import errorMessage from 'routes/errors'
import * as database from 'services/database.service'
const router = Router()

router.get('/', auth.required, async function (req: Request, res: Response) {
  try {
    const response = await database.getDatabases(req.server)
    return res.json(response)
  } catch (e) {
    console.error(e)
    return res.status(501).json({
      success: false,
      errors: errorMessage(e),
    })
  }
})

router.get(
  '/create',
  auth.required,
  async function (req: Request, res: Response) {
    return res.json({
      success: true,
      data: {
        users: ['runcloud', 'dbuser'],
        collations: ['utf8_general_ci', 'utf16_general_ci'],
      },
    })
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
      console.error(e)
      return res.status(501).json({
        success: false,
        errors: errorMessage(e),
      })
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
      console.error(e)
      return res.status(501).json({
        success: false,
        errors: errorMessage(e),
      })
    }
  }
)

// router.get('/:databaseId/grant', auth.required, database.getUngrantedDBuser)

// router.post(
//   '/:databaseId/grant',
//   auth.required,
//   body('dbuserId').isString(),
//   database.grantDBuser
// )

// router.delete(
//   '/:databaseId/grant/:dbuserId',
//   auth.required,
//   database.revokeDBuser
// )

router.get(
  '/users',
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const response = await database.getDatabaseUserList(req.server)
      return res.json(response)
    } catch (e) {
      console.error(e)
      return res.status(501).json({
        success: false,
        errors: errorMessage(e),
      })
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
      console.error(e)
      return res.status(501).json({
        success: false,
        errors: errorMessage(e),
      })
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
      console.error(e)
      return res.status(501).json({
        success: false,
        errors: errorMessage(e),
      })
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
      console.error(e)
      return res.status(501).json({
        success: false,
        errors: errorMessage(e),
      })
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
      console.error(e)
      return res.status(501).json({
        success: false,
        errors: errorMessage(e),
      })
    }
  }
)

export default router
