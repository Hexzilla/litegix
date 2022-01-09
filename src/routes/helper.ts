import { Request, Response } from 'express'
import errorMessage from 'routes/errors'

export function createHandler(callback: (req: Request) => object) {
  return async function (req: Request, res: Response) {
    try {
      return res.json(await callback(req))
    } catch (e) {
      return res.status(501).json({
        success: false,
        errors: errorMessage(e),
      })
    }
  }
}
