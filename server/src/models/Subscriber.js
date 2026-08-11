import mongoose from 'mongoose'

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'ایمیل معتبر نیست'],
    },
  },
  { timestamps: true }
)

export default mongoose.model('Subscriber', subscriberSchema)
