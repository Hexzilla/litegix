import { Router, Request, Response, NextFunction } from 'express'
import server from 'services/server-service'
import install from 'services/install-service'

const router = Router()
router.get('/script/:token', async function (req: Request, res: Response) {
  try {
    const token = req.params.token
    const text = await install.getAgentInstallScript(token)
    res.send(text)
  } catch (e) {
    console.error(e)
    return res.status(501).json({ success: false })
  }
})

router.post('/status/:token', async function (req: Request, res: Response) {
  try {
    const token = req.params.token
    const result = await install.updateInstallState(token, req.body)
    res.json(result)
  } catch (e) {
    console.error(e)
    return res.status(501).json({ success: false })
  }
})

export default router
