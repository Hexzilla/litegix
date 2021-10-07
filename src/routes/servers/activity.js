import { Router, Request, Response, NextFunction } from 'express'
const auth = require('../auth')
const activity = require('../../services/activity-service')

router.get('/', auth.required, async function (req: Request, res: Response) {
  try {
    const response = await activity.getServerActivityLogs(req.server)
    return res.json(response)
  } catch (e) {
    console.error(e)
    return res.status(501).json({ success: false })
  }
})

export default router
