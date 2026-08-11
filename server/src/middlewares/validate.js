import { validationResult } from 'express-validator'
import { badRequest } from '../utils/apiError.js'

/** جمع‌آوری خطاهای express-validator */
export function validate(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(badRequest('اطلاعات ارسال‌شده معتبر نیست', errors.array()))
  }
  next()
}
