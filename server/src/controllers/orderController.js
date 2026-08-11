import mongoose from 'mongoose'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { notFound, badRequest } from '../utils/apiError.js'
import { orderRef, clamp } from '../utils/helpers.js'
import { sendMail } from '../utils/mailer.js'

const FREE_ABOVE_TEHRAN = 2_000_000
const FREE_ABOVE_CITY = 2_500_000
const FEE_TEHRAN = 45_000
const FEE_CITY = 65_000

/**
 * ثبت سفارش جدید — اتمی بدون نیاز به تراکنش‌های replica-set:
 * برای هر محصول یک «اسلات قفل» (`lockedAt`) گرفته می‌شود تا دو سفارش
 * هم‌زمان نتوانند از یک موجودی عبور کنند.
 */
export const createOrder = asyncHandler(async (req, res) => {
  const { items, customer, paymentMethod = 'online', note = '' } = req.body

  if (!Array.isArray(items) || items.length === 0 || items.length > 20) {
    throw badRequest('سبد خرید خالی است')
  }
  if (!customer?.fullName || !customer?.phone || !customer?.province || !customer?.city || !customer?.address) {
    throw badRequest('اطلاعات گیرنده ناقص است')
  }

  const isTeheran = customer.province === 'تهران'
  const ids = items.map((i) => i.product)
  const qtyMap = new Map()
  for (const i of items) {
    const qty = Number(i.qty)
    if (!Number.isInteger(qty) || qty < 1 || qty > 5) {
      throw badRequest('تعداد هر محصول باید بین ۱ تا ۵ باشد')
    }
    qtyMap.set(String(i.product), qty)
  }

  // ۱) قفل اتمی + کسر موجودی در یک عملیات — فقط وقتی موجودی کافی است
  const lockTs = new Date()
  const acquired = await Promise.all(
    ids.map((id) =>
      Product.findOneAndUpdate(
        {
          _id: id,
          active: true,
          stock: { $gte: qtyMap.get(String(id)) },
          $or: [{ lockedAt: null }, { lockedAt: { $lt: new Date(Date.now() - 30_000) } }],
        },
        // قفل + کسر ذخیره هم‌زمان: اگر همان لحظه محصول دیگری این‌جا را نگیرد،
        // دومی با صفر نتیجه مواجه می‌شود و هرگز از موجودیِ منفی نمی‌گذرد.
        { $set: { lockedAt: lockTs }, $inc: { stock: -qtyMap.get(String(id)), sold: qtyMap.get(String(id)) } },
        { new: true }
      )
    )
  )

  if (acquired.some((p) => !p)) {
    const snapshots = await Promise.all(
      ids.map((id) => Product.findById(id).select('name stock').lean())
    )
    const missing = snapshots.filter((p, i) => !acquired[i])
    const reason = missing.map((p) => (p ? `«${p.name}» فقط ${p.stock} عدد دارد` : 'یکی از محصولات'))
    throw badRequest(`موجودی کافی نیست: ${reason.join('، ')}`)
  }

  try {
    // ۲) ایجاد سفارش
    const orderItems = acquired.map((p) => ({
      product: p._id,
      name: p.name,
      price: p.price,
      qty: qtyMap.get(String(p._id)),
    }))
    const subtotal = orderItems.reduce((s, i) => s + i.price * i.qty, 0)
    const shippingFee = subtotal >= (isTeheran ? FREE_ABOVE_TEHRAN : FREE_ABOVE_CITY) ? 0 : isTeheran ? FEE_TEHRAN : FEE_CITY

    let ref
    let refTaken = true
    while (refTaken) {
      ref = orderRef()
      refTaken = Boolean(await Order.findOne({ ref }))
    }

    const order = await Order.create({
      ref,
      user: req.user?._id || null,
      items: orderItems,
      customer: {
        fullName: String(customer.fullName).trim().slice(0, 80),
        phone: String(customer.phone).trim().slice(0, 20),
        province: customer.province,
        city: String(customer.city).trim().slice(0, 60),
        address: String(customer.address).trim().slice(0, 300),
        postalCode: String(customer.postalCode || '').trim().slice(0, 20),
      },
      shippingFee,
      paymentMethod,
      note: String(note || '').trim().slice(0, 500),
      status: 'paid', // در نسخهٔ نمایشی، پرداخت آنلاین بلافاصله موفق است
    })

    // ۳) آزادسازی قفلِ همین درخواست — موجودی و فروش قبلاً کسر شده‌اند
    await Product.updateMany(
      { _id: { $in: acquired.map((p) => p._id) }, lockedAt: lockTs },
      { $unset: { lockedAt: 1 } }
    ).catch(() => {})

    try {
      await sendMail({
        to: req.user?.email || customer.email,
        subject: `سفارش ${order.ref} ثبت شد 🌹`,
        text: `سفارش شما با موفقیت ثبت شد. کد پیگیری: ${order.ref}`,
      })
    } catch {
      /* ایمیل اختیاری است */
    }

    res.status(201).json({ order })
  } catch (err) {
    // ۴) در خطا: برگرداندن موجودی و آزاد کردن قفلِ همین درخواست
    await Promise.all(
      acquired.map((p) =>
        Product.updateOne(
          { _id: p._id, lockedAt: lockTs },
          { $unset: { lockedAt: 1 }, $inc: { stock: qtyMap.get(String(p._id)), sold: -qtyMap.get(String(p._id)) } }
        )
      )
    ).catch(() => {})
    throw err
  } finally {
    // ۵) پاک‌سازی قفل‌های قدیمی — جلوگیری از مانده‌شدن قفل
    await Product.updateMany(
      { lockedAt: { $lt: new Date(Date.now() - 30_000) } },
      { $unset: { lockedAt: 1 } }
    ).catch(() => {})
  }
})

/**
 * تأیید پرداخت — فقط مالک سفارش می‌تواند.
 * در نسخهٔ نمایشی پرداخت شبیه‌سازی می‌شود؛ برای درگاه واقعی،
 * فقط callback امضاشدهٔ درگاه باید این وضعیت را «پرداخت‌شده» کند.
 */
export const verifyOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ ref: req.params.ref })
  if (!order) throw notFound('سفارش یافت نشد')
  const isOwner = req.user && String(order.user?._id) === String(req.user._id)
  if (!isOwner) throw notFound('سفارش یافت نشد')
  order.status = 'paid'
  order.paymentRef = String(req.body?.paymentRef || '').trim().slice(0, 100)
  await order.save()
  res.json({ order })
})

/** سفارش‌های کاربر جاری */
export const myOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('items.product', 'name slug')
    .sort('-createdAt')
  res.json({ orders })
})

/**
 * سفارش با کد پیگیری:
 * - مالکِ واردشده: همهٔ جزئیات
 * - مهمان: فقط وضعیت و کد رهگیری (بدون اطلاعات مشتری)
 */
export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ ref: req.params.ref }).populate('items.product', 'name slug')
  if (!order) throw notFound('سفارش یافت نشد')

  const isOwner = req.user && String(order.user?._id) === String(req.user._id)
  if (isOwner) return res.json({ order })

  // مهمان فقط وضعیت و کد رهگیری را می‌بیند
  res.json({
    order: {
      _id: order._id,
      ref: order.ref,
      status: order.status,
      trackingCode: order.trackingCode || null,
      createdAt: order.createdAt,
    },
  })
})
