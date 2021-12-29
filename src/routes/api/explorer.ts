import { model } from 'mongoose'
import { body } from 'express-validator'
import { Router, Request, Response } from 'express'
import validate from 'routes/validate'
import { Explorer } from 'models'
const ExplorerModel = model<Explorer>('Explorer')

const router = Router()

router.get('/', async function (req: Request, res: Response) {
  const explorers = await ExplorerModel.find()
  return res.json(explorers)
})

router.post(
  '/',
  body('username').notEmpty(),
  body('password').notEmpty(),
  validate,
  async function (req: Request, res: Response) {
    const explorer = new ExplorerModel(req.body)
    const result = await explorer.save()
    return res.json(result)
  }
)

export default router
