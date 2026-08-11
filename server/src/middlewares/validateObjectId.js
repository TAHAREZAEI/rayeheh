import mongoose from 'mongoose'
import { badRequest } from '../utils/apiError.js'

/** بررسی معتبر بودن ObjectId در پارامتر مسیر */
export function validateObjectId(param = 'id') {
  return (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params[param])) {
      return next(badRequest('شناسهٔ نامعتبر است'))
    }
    next()
  }
}
