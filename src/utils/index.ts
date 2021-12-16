import { Request, Response } from 'express'
import errorMessage from 'routes/errors'

export function handler(callback: (req: Request) => any) {
  return async function (req: Request, res: Response) {
    try {
      return res.json(await callback(req))
    }
    catch (e) {
      return res.status(501).json({
        success: false,
        errors: errorMessage(e),
      })
    }
  }
}