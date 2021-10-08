import { body } from 'express-validator'
import { Router, Request, Response } from 'express'
import validate from 'routes/validate'
import auth from '../auth'
import * as cronJob from 'services/cron.service'
const router = Router()

router.get('/', auth.required, async function (req: Request, res: Response) {
  try {
    const response = await cronJob.getCronJobs(req.server)
    return res.json(response)
  } catch (e) {
    console.error(e)
    return res.status(501).json({ success: false })
  }
})

router.get(
  '/create',
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const response = await cronJob.createCronJob(req.server)
      return res.json(response)
    } catch (e) {
      console.error(e)
      return res.status(501).json({ success: false })
    }
  }
)

router.post(
  '/',
  auth.required,
  body('label').notEmpty(),
  body('username').notEmpty(),
  body('command').notEmpty(),
  body('vendor_binary').notEmpty(),
  body('predef_setting').notEmpty(),
  validate,
  async function (req: Request, res: Response) {
    try {
      const response = await cronJob.storeCronJob(req.server, req.body)
      return res.json(response)
    } catch (e) {
      console.error(e)
      return res.status(501).json({ success: false })
    }
  }
)

router.get(
  '/:jobId',
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const jobId = req.params.jobId
      const response = await cronJob.getCronJob(jobId)
      return res.json(response)
    } catch (e) {
      console.error(e)
      return res.status(501).json({ success: false })
    }
  }
)

router.delete(
  '/:jobId',
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const jobId = req.params.jobId
      const response = await cronJob.removeCronJob(jobId)
      return res.json(response)
    } catch (e) {
      console.error(e)
      return res.status(501).json({ success: false })
    }
  }
)

export default router
