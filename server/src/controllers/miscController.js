import Subscriber from '../models/Subscriber.js'
import ContactMessage from '../models/ContactMessage.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { normalize } from '../utils/helpers.js'
import { sendMail } from '../utils/mailer.js'

/** عضویت در خبرنامه */
export const subscribe = asyncHandler(async (req, res) => {
  const email = normalize(req.body?.email || '')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'ایمیل معتبر نیست' })
  }
  const existing = await Subscriber.findOne({ email })
  if (existing) {
    return res.json({ message: 'شما قبلاً عضو خبرنامه شده‌اید' })
  }
  await Subscriber.create({ email })
  res.status(201).json({ message: 'عضویت شما با موفقیت ثبت شد' })
})

/** فرم تماس */
export const contact = asyncHandler(async (req, res) => {
  const { name, email, phone, topic, message } = req.body
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ message: 'نام، ایمیل و پیام الزامی است' })
  }
  await ContactMessage.create({
    name: String(name).trim().slice(0, 80),
    email: normalize(email),
    phone: String(phone || '').trim().slice(0, 20),
    topic: String(topic || '').trim().slice(0, 60),
    message: String(message).trim().slice(0, 2000),
  })

  try {
    await sendMail({
      to: process.env.ADMIN_EMAIL || 'admin@rayeheh.com',
      subject: `پیام جدید از ${name} — ${topic || 'تماس'}`,
      text: message,
    })
  } catch {
    /* اختیاری */
  }

  res.status(201).json({ message: 'پیام شما ثبت شد؛ به‌زودی با شما تماس می‌گیریم' })
})

/** تنظیمات ارسال — برای محاسبهٔ هزینه در سبد */
export const shippingSettings = asyncHandler(async (req, res) => {
  res.json({
    shipping: {
      teheranFee: 45000,
      cityFee: 65000,
      teheranFreeAbove: 2000000,
      cityFreeAbove: 2500000,
      codEnabled: true,
    },
  })
})
