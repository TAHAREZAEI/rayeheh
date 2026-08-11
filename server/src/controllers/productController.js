import Product from '../models/Product.js'
import Review from '../models/Review.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { notFound, badRequest } from '../utils/apiError.js'
import { clamp } from '../utils/helpers.js'

const PAGE_SIZE_DEFAULT = 12

/** گریز از نویسه‌های رجکس — جلوگیری از ReDoS و خطای ۵۰۰ با ورودی کاربر */
function escRegex(s = '') {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** ساخت فیلتر از پارامترهای query */
function buildFilter(query) {
  const filter = { active: true }

  if (query.q) {
    const q = escRegex(query.q.trim().slice(0, 100))
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { brand: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
    ]
  }
  if (query.cat) {
    // هم اسلاگ و هم شناسهٔ دسته را می‌پذیرد
    filter.category = /^[0-9a-fA-F]{24}$/.test(query.cat)
      ? query.cat
      : { $in: [] } // جایگزین با slug در ادامه
    if (!/^[0-9a-fA-F]{24}$/.test(query.cat)) {
      // شناسهٔ دسته از روی اسلاگ — در کنترلر به‌صورت مجزا حل می‌شود
      filter.__catSlug = query.cat
    }
  }
  if (query.family) filter.family = query.family
  if (query.edition) filter.edition = query.edition

  if (query.price) {
    // قالب: min-max به تومان (مثلاً 1000000-3000000) یا فقط min/max
    const raw = String(query.price).replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).trim()
    const [min, max] = raw.split('-').map((n) => Number(n))
    if (Number.isFinite(min) && min >= 0) filter.price = { ...(filter.price || {}), $gte: min }
    if (Number.isFinite(max) && max >= 0) filter.price = { ...(filter.price || {}), $lte: max }
  }

  if (query.featured === 'true') filter.featured = true
  if (query.isNew === 'true') filter.isNew = true

  return filter
}

const SORTS = {
  'price': { price: 1 },
  '-price': { price: -1 },
  '-rating': { rating: -1, ratingCount: -1 },
  '-createdAt': { createdAt: -1 },
  '-sold': { sold: -1 },
}

/** لیست محصولات با فیلتر، مرتب‌سازی و صفحه‌بندی */
export const listProducts = asyncHandler(async (req, res) => {
  const filter = buildFilter(req.query)

  // حل اسلاگ دسته
  if (filter.__catSlug) {
    const Category = (await import('../models/Category.js')).default
    const cat = await Category.findOne({ slug: filter.__catSlug })
    filter.category = cat?._id || null
    if (!cat) {
      return res.json({ products: [], page: 1, pages: 1, total: 0 })
    }
  }
  delete filter.__catSlug

  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = clamp(Number(req.query.limit) || PAGE_SIZE_DEFAULT, 1, 40)
  const sort = SORTS[req.query.sort] || SORTS['-sold']

  const [total, products] = await Promise.all([
    Product.countDocuments(filter),
    Product.find(filter)
      .populate('category', 'name slug')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
  ])

  res.json({ products, total, page, pages: Math.max(1, Math.ceil(total / limit)) })
})

/** یک محصول با اسلاگ — همراه با محصولات مرتبط */
export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, active: true })
    .populate('category', 'name slug')
    .lean()

  if (!product) throw notFound('عطر یافت نشد')

  const [reviews, related] = await Promise.all([
    Review.find({ product: product._id }).populate('user', 'name').sort('-createdAt').limit(8).lean(),
    Product.find({
      active: true,
      _id: { $ne: product._id },
      $or: [{ family: product.family }, { category: product.category?._id }],
    })
      .limit(4)
      .lean(),
  ])

  res.json({ product: { ...product, reviews }, related })
})

/** ثبت نظر — فقط کاربران واردشده، فقط یک نظر برای هر محصول */
export const addReview = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { rating, comment } = req.body

  const product = await Product.findById(id)
  if (!product) throw notFound('عطر یافت نشد')

  const r = clamp(Number(rating) || 0, 1, 5)
  const c = String(comment || '').trim()
  if (c.length < 3) throw badRequest('نظر باید دست‌کم چند کلمه باشد')

  const existing = await Review.findOne({ user: req.user._id, product: id })
  if (existing) {
    existing.rating = r
    existing.comment = c
    await existing.save()
    await Product.recalcRating(id)
    res.json({ review: await existing.toPublic(), message: 'نظر شما به‌روزرسانی شد' })
    return
  }

  const review = await Review.create({ user: req.user._id, product: id, rating: r, comment: c })
  await Product.recalcRating(id)
  res.status(201).json({ review: await review.toPublic(), message: 'نظر شما ثبت شد' })
})
