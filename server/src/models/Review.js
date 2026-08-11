import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, maxlength: 600 },
  },
  { timestamps: true }
)

// هر کاربر فقط یک نظر برای هر محصول
reviewSchema.index({ user: 1, product: 1 }, { unique: true })

// برای نمایش در صفحهٔ محصول: آوردن نام کاربر
reviewSchema.methods.toPublic = async function () {
  await this.populate('user', 'name')
  return {
    _id: this._id,
    user: this.user,
    rating: this.rating,
    comment: this.comment,
    createdAt: this.createdAt,
  }
}

export default mongoose.model('Review', reviewSchema)
