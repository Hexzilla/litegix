import { Router, Request, Response } from 'express'
import auth from '../auth'
import * as activityService from 'services/activity.service'
const router = Router()

router.get('/', auth.required, async function (req: Request, res: Response) {
  try {
    const response = await activityService.getServerActivityLogs(req.server)
    return res.json(response)
  } catch (e) {
    console.error(e)
    return res.status(501).json({ success: false })
  }
})

export default router
