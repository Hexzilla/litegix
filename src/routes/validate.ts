import { Request, Response, NextFunction } from 'express'
import valiator from 'express-validator'

export default (req: Request, res: Response, next: NextFunction) => {
  const errors = valiator.validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array(),
    })
  }

  next()
}
