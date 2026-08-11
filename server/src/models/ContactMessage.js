import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'ایمیل معتبر نیست'],
    },
    phone: { type: String, default: '' },
    topic: { type: String, default: '' },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
  },
  { timestamps: true }
)

export default mongoose.model('ContactMessage', contactSchema)
