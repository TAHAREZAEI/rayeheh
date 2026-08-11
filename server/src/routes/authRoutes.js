import { Router } from 'express'
import { body } from 'express-validator'
import { register, login, logout, me, updateMe, changePassword } from '../controllers/authController.js'
import { protect } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import { authLimiter } from '../middlewares/rateLimiter.js'

const router = Router()

router.post(
  '/register',
  authLimiter,
  [
    body('name').trim().isLength({ min: 3, max: 60 }).withMessage('نام باید ۳ تا ۶۰ کاراکتر باشد'),
    body('email').isEmail().withMessage('ایمیل معتبر نیست'),
    body('password').isLength({ min: 8 }).withMessage('رمز عبور باید دست‌کم ۸ کاراکتر باشد'),
    body('phone').optional({ values: 'falsy' }).matches(/^09\d{9}$/).withMessage('شمارهٔ موبایل نامعتبر است'),
  ],
  validate,
  register
)

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('ایمیل معتبر نیست'),
    body('password').notEmpty().withMessage('رمز عبور الزامی است'),
  ],
  validate,
  login
)

router.post('/logout', logout)
router.get('/me', protect, me)
router.put(
  '/me',
  protect,
  [
    body('name').optional({ values: 'falsy' }).trim().isLength({ min: 3, max: 60 }).withMessage('نام معتبر نیست'),
    body('phone').optional({ values: 'falsy' }).matches(/^09\d{9}$/).withMessage('شمارهٔ موبایل نامعتبر است'),
  ],
  validate,
  updateMe
)
router.put(
  '/password',
  protect,
  [
    body('currentPassword').notEmpty().withMessage('رمز فعلی الزامی است'),
    body('newPassword').isLength({ min: 8 }).withMessage('رمز جدید باید دست‌کم ۸ کاراکتر باشد'),
  ],
  validate,
  changePassword
)

export default router
