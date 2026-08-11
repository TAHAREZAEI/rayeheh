import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    brand: { type: String, default: 'رایحه', trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    price: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, default: 0, min: 0 },
    stock: { type: Number, default: 10, min: 0 },
    weight: { type: Number, default: 50, min: 1 }, // میلی‌لیتر
    edition: {
      type: String,
      enum: ['ادوپرفیوم', 'ادوتویلت', 'ادکلن', 'عطر خالص'],
      default: 'ادوپرفیوم',
    },
    family: { type: String, default: '' }, // خانوادهٔ بویایی
    description: { type: String, default: '', maxlength: 2000 },
    notes: {
      top: { type: String, default: '' },
      heart: { type: String, default: '' },
      base: { type: String, default: '' },
    },
    longevity: { type: Number, min: 1, max: 5, default: 4 },
    sillage: { type: Number, min: 1, max: 5, default: 4 },
    badge: { type: String, default: '' },
    isNew: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    sold: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
    // قفل موقت برای ثبت اتمی سفارش‌ها (بدون تراکنش replica-set)
    lockedAt: { type: Date, default: null },
  },
  { timestamps: true }
)

productSchema.index({ name: 'text', brand: 'text', description: 'text' })
productSchema.index({ category: 1, price: 1, family: 1 })

// بعد از ثبت سفارش: کاهش موجودی، افزایش فروش
productSchema.statics.applyOrder = async function (items, session) {
  for (const it of items) {
    await this.findByIdAndUpdate(
      it.product,
      { $inc: { stock: -it.qty, sold: it.qty } },
      { session }
    )
  }
}

// محاسبهٔ امتیاز میانگین از روی نظرات
productSchema.statics.recalcRating = async function (productId) {
  const Review = mongoose.model('Review')
  const agg = await Review.aggregate([
    { $match: { product: productId } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ])
  const { avg = 0, count = 0 } = agg[0] || {}
  await this.findByIdAndUpdate(productId, {
    rating: Math.round(avg * 10) / 10,
    ratingCount: count,
  })
  return { rating: Math.round(avg * 10) / 10, ratingCount: count }
}

export default mongoose.model('Product', productSchema)
