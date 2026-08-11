import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

// تعداد محصولات هر دسته — بدون نیاز به ذخیرهٔ جدا
categorySchema.methods.toPublic = async function () {
  const count = await mongoose.model('Product').countDocuments({
    category: this._id,
    active: true,
  })
  return { _id: this._id, name: this.name, slug: this.slug, description: this.description, productCount: count }
}

export default mongoose.model('Category', categorySchema)
