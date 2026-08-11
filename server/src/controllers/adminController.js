import mongoose from 'mongoose'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import User from '../models/User.js'
import ContactMessage from '../models/ContactMessage.js'
import Subscriber from '../models/Subscriber.js'
import Category from '../models/Category.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { notFound, badRequest } from '../utils/apiError.js'
import { slugify, normalize, clamp, publicUser } from '../utils/helpers.js'

/** آمار داشبورد */
export const stats = asyncHandler(async (req, res) => {
  const [
    totalOrders,
    totalRevenue,
    totalProducts,
    totalUsers,
    totalSubscribers,
    unreadMessages,
    statusCounts,
    recentOrders,
    lowStock,
  ] = await Promise.all([
    Order.countDocuments({ status: { $ne: 'cancelled' } }),
    Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Product.countDocuments(),
    User.countDocuments(),
    Subscriber.countDocuments(),
    ContactMessage.countDocuments(),
    Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Order.find().sort('-createdAt').limit(5).lean(),
    Product.find({ stock: { $lt: 5 } }).select('name stock').limit(8).lean(),
  ])

  res.json({
    totalOrders,
    totalRevenue: totalRevenue[0]?.total || 0,
    totalProducts,
    totalUsers,
    totalSubscribers,
    unreadMessages,
    statusCounts: Object.fromEntries(statusCounts.map((s) => [s._id, s.count])),
    recentOrders,
    lowStock,
  })
})

/* ------------------------- محصولات ------------------------- */

const PRODUCT_LIST_POPULATE = 'category name slug'

/** گریز از نویسه‌های رجکس — جلوگیری از ReDoS در جستجوی مدیریت */
function escRegex(s = '') {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** عددِ متناهی و نامنفی — جلوگیری از ذخیرهٔ Infinity/NaN */
function finiteNumber(v, fallback, min = 0, max = 999_999_999_999) {
  const n = Number(v)
  if (!Number.isFinite(n) || n < min || n > max) return fallback
  return n
}

export const adminListProducts = asyncHandler(async (req, res) => {
  const { q = '' } = req.query
  const filter = q ? { name: { $regex: escRegex(q.trim().slice(0, 100)), $options: 'i' } } : {}
  const limit = clamp(Number(req.query.limit) || 12, 1, 100)
  const page = Math.max(1, Number(req.query.page) || 1)
  const total = await Product.countDocuments(filter)
  const products = await Product.find(filter)
    .populate(PRODUCT_LIST_POPULATE)
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(limit)
  res.json({ products, total, pages: Math.max(1, Math.ceil(total / limit)), page })
})

export const adminGetProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(PRODUCT_LIST_POPULATE)
  if (!product) throw notFound('محصول یافت نشد')
  res.json({ product })
})

export const adminCreateProduct = asyncHandler(async (req, res) => {
  const b = req.body
  if (!b.name?.trim()) throw badRequest('نام محصول الزامی است')
  if (!b.category || !mongoose.isValidObjectId(b.category)) throw badRequest('دسته‌بندی نامعتبر است')

  let slug = b.slug?.trim() || slugify(b.name)
  // جلوگیری از تداخل اسلاگ
  if (await Product.findOne({ slug })) {
    slug = `${slug}-${Date.now().toString(36).slice(-4)}`
  }

  const product = await Product.create({
    name: String(b.name).trim().slice(0, 100),
    slug,
    brand: String(b.brand || 'رایحه').trim().slice(0, 60),
    category: b.category,
    price: finiteNumber(b.price, 0),
    oldPrice: finiteNumber(b.oldPrice, 0),
    stock: clamp(finiteNumber(b.stock, 0), 0, 9999),
    weight: clamp(finiteNumber(b.weight, 50), 1, 1000),
    edition: b.edition || 'ادوپرفیوم',
    family: String(b.family || '').trim(),
    description: String(b.description || '').trim(),
    notes: {
      top: String(b.notes?.top || '').trim(),
      heart: String(b.notes?.heart || '').trim(),
      base: String(b.notes?.base || '').trim(),
    },
    longevity: clamp(Number(b.longevity) || 4, 1, 5),
    sillage: clamp(Number(b.sillage) || 4, 1, 5),
    badge: String(b.badge || '').trim(),
    isNew: Boolean(b.isNew),
    featured: Boolean(b.featured),
    active: b.active === undefined ? true : Boolean(b.active),
  })
  res.status(201).json({ product })
})

export const adminUpdateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) throw notFound('محصول یافت نشد')

  const b = req.body
  const fields = [
    'name', 'brand', 'category', 'price', 'oldPrice', 'stock', 'weight', 'edition',
    'family', 'description', 'longevity', 'sillage', 'badge', 'isNew', 'featured', 'active',
  ]
  for (const f of fields) {
    if (b[f] !== undefined) product[f] = b[f]
  }
  if (b.slug?.trim()) {
    const slug = String(b.slug).trim().toLowerCase()
    const clash = await Product.findOne({ slug, _id: { $ne: product._id } })
    if (clash) throw badRequest('این اسلاگ قبلاً استفاده شده است')
    product.slug = slug
  }
  if (b.notes) {
    product.notes = {
      top: String(b.notes.top || product.notes.top || '').trim(),
      heart: String(b.notes.heart || product.notes.heart || '').trim(),
      base: String(b.notes.base || product.notes.base || '').trim(),
    }
  }
  // قیمت و موجودی فقط مقادیر متناهی می‌پذیرند (Infinity/NaN ذخیره نشود)
  if (b.price !== undefined) product.price = finiteNumber(b.price, product.price)
  if (b.oldPrice !== undefined) product.oldPrice = finiteNumber(b.oldPrice, product.oldPrice)
  if (b.stock !== undefined) product.stock = clamp(finiteNumber(b.stock, product.stock), 0, 9999)
  if (b.weight !== undefined) product.weight = clamp(finiteNumber(b.weight, product.weight), 1, 1000)
  await product.save()
  res.json({ product })
})

export const adminDeleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id)
  if (!product) throw notFound('محصول یافت نشد')
  // حذف نظراتِ همان محصول (نه همهٔ محصولات!) — فیلتر باید روی فیلد موجود باشد
  const Review = mongoose.model('Review')
  await Review.deleteMany({ product: product._id }).catch(() => {})
  res.json({ message: 'محصول حذف شد' })
})

/* ------------------------- سفارش‌ها ------------------------- */

export const adminListOrders = asyncHandler(async (req, res) => {
  const { status = '' } = req.query
  const filter = status ? { status } : {}
  const limit = clamp(Number(req.query.limit) || 10, 1, 100)
  const page = Math.max(1, Number(req.query.page) || 1)
  const total = await Order.countDocuments(filter)
  const orders = await Order.find(filter)
    .populate('items.product', 'name slug')
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(limit)
  res.json({ orders, total, pages: Math.max(1, Math.ceil(total / limit)), page })
})

export const adminUpdateOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (!order) throw notFound('سفارش یافت نشد')

  const ALLOWED = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']
  if (req.body.status && ALLOWED.includes(req.body.status)) order.status = req.body.status
  if (req.body.trackingCode !== undefined) order.trackingCode = String(req.body.trackingCode).trim()
  await order.save()
  res.json({ order })
})

export const adminDeleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id)
  if (!order) throw notFound('سفارش یافت نشد')
  res.json({ message: 'سفارش حذف شد' })
})

/* ------------------------- پیام‌ها و خبرنامه ------------------------- */

export const adminListMessages = asyncHandler(async (req, res) => {
  const messages = await ContactMessage.find().sort('-createdAt').limit(Number(req.query.limit) || 100)
  res.json({ messages })
})

export const adminDeleteMessage = asyncHandler(async (req, res) => {
  const m = await ContactMessage.findByIdAndDelete(req.params.id)
  if (!m) throw notFound('پیام یافت نشد')
  res.json({ message: 'پیام حذف شد' })
})

export const adminListSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await Subscriber.find().sort('-createdAt').limit(Number(req.query.limit) || 200)
  res.json({ subscribers })
})

export const adminDeleteSubscriber = asyncHandler(async (req, res) => {
  const s = await Subscriber.findByIdAndDelete(req.params.id)
  if (!s) throw notFound('عضویت یافت نشد')
  res.json({ message: 'عضویت حذف شد' })
})

/* ------------------------- کاربران ------------------------- */

export const adminListUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort('-createdAt').limit(Number(req.query.limit) || 100)
  res.json({ users: users.map((u) => ({ ...publicUser(u), isAdmin: u.role === 'admin' })) })
})

export const adminSetUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) throw notFound('کاربر یافت نشد')
  const wantAdmin = Boolean(req.body.isAdmin)

  // هرگز مدیر آخر را برندار
  if (!wantAdmin && user.role === 'admin') {
    const adminCount = await User.countDocuments({ role: 'admin' })
    if (adminCount <= 1) throw badRequest('نمایشگاه باید دست‌کم یک مدیر داشته باشد')
  }
  user.role = wantAdmin ? 'admin' : 'customer'
  await user.save()
  res.json({ user: { ...publicUser(user), isAdmin: user.role === 'admin' } })
})

/** دسته‌بندی‌ها برای فرم محصول */
export const adminListCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ order: 1, name: 1 })
  res.json({ categories })
})
