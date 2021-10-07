import { Router, Request, Response } from 'express'
import auth from '../auth'
import * as activity from 'services/activity.service'
const router = Router()

router.get('/', auth.required, async function (req: Request, res: Response) {
  try {
    const userId = req.payload.id
    const response = await activity.getAccountActivityLogs(userId)
    return res.json(response)
  } catch (e) {
    console.error(e)
    return res.status(501).json({ success: false })
  }
})

export default router
