import User from '../models/User.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { badRequest, unauthorized } from '../utils/apiError.js'
import { signToken, setAuthCookie, clearAuthCookie } from '../middlewares/auth.js'
import { normalize } from '../utils/helpers.js'
import { sendMail } from '../utils/mailer.js'

/** ثبت‌نام */
export const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body

  const exists = await User.findOne({ email: normalize(email) })
  if (exists) {
    // پاسخِ یکسان برای هر دو حالت — جلوگیری از شناسایی ایمیل‌های ثبت‌شده
    throw badRequest('اگر حسابی با این ایمیل دارید، وارد شوید.')
  }

  const user = await User.create({ name, email: normalize(email), phone, password })

  try {
    await sendMail({
      to: user.email,
      subject: 'به خانهٔ رایحه خوش آمدید 🌹',
      text: `${name} عزیز، حساب شما ساخته شد. به جمع عطر دوستان خوش آمدید!`,
    })
  } catch {
    /* ایمیل خراب شود، حساب ساخته شده است */
  }

  setAuthCookie(res, signToken(user))
  res.status(201).json({ user: user.toPublic() })
})

/** ورود */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email: normalize(email) }).select('+password')
  if (!user || !(await user.matchPassword(password))) {
    throw unauthorized('ایمیل یا رمز عبور اشتباه است')
  }
  setAuthCookie(res, signToken(user))
  res.json({ user: user.toPublic() })
})

/** خروج */
export const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res)
  res.json({ message: 'خارج شدید' })
})

/** کاربر جاری */
export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toPublic() })
})

/** به‌روزرسانی پروفایل */
export const updateMe = asyncHandler(async (req, res) => {
  const { name, phone } = req.body
  if (name !== undefined) req.user.name = String(name).trim().slice(0, 60)
  if (phone !== undefined) req.user.phone = String(phone).trim().slice(0, 20)
  await req.user.save()
  res.json({ user: req.user.toPublic() })
})

/** تغییر رمز عبور */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const user = await User.findById(req.user._id).select('+password')
  if (!(await user.matchPassword(currentPassword))) {
    throw badRequest('رمز عبور فعلی اشتباه است')
  }
  if (!newPassword || String(newPassword).length < 8) {
    throw badRequest('رمز جدید باید دست‌کم ۸ کاراکتر باشد')
  }
  user.password = newPassword
  user.passwordChangedAt = new Date()
  await user.save()
  // خروج از همهٔ نشست‌ها — توکن‌های پیشین با passwordChangedAt نامعتبر می‌شوند
  clearAuthCookie(res)
  setAuthCookie(res, signToken(user))
  res.json({ message: 'رمز عبور با موفقیت تغییر کرد' })
})
