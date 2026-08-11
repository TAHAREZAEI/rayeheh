import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { unauthorized } from '../utils/apiError.js'

export function signToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000, // ۷ روز
}

export function setAuthCookie(res, token) {
  res.cookie('token', token, COOKIE_OPTIONS)
}

export function clearAuthCookie(res) {
  res.clearCookie('token', { ...COOKIE_OPTIONS, maxAge: undefined })
}

/** احراز هویت — در نبود توکن معتبر، ۴۰۱ */
export async function protect(req, res, next) {
  try {
    const token = req.cookies?.token
    if (!token) throw unauthorized('برای این کار باید وارد حساب شوید')
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(payload.id)
    if (!user) throw unauthorized('حساب کاربری یافت نشد')
    // توکن‌های صادرشده پیش از تغییر رمز، نامعتبرند (خروج از همهٔ نشست‌ها)
    if (user.passwordChangedAt && payload.iat * 1000 < user.passwordChangedAt.getTime()) {
      throw unauthorized('نشست شما منقضی شده؛ دوباره وارد شوید')
    }
    req.user = user
    next()
  } catch {
    next(unauthorized('نشست شما منقضی شده؛ دوباره وارد شوید'))
  }
}

/** فقط مدیران */
export function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') {
    return next(unauthorized('این بخش فقط برای مدیران است'))
  }
  next()
}
