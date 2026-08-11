import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    ref: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true }, // snapshot در لحظهٔ خرید
        price: { type: Number, required: true }, // snapshot
        qty: { type: Number, required: true, min: 1, max: 5 },
      },
    ],
    customer: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      province: { type: String, required: true },
      city: { type: String, required: true },
      address: { type: String, required: true },
      postalCode: { type: String, default: '' },
    },
    shippingFee: { type: Number, default: 0 },
    subtotal: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    paymentMethod: { type: String, enum: ['online', 'cod'], default: 'online' },
    paymentRef: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    trackingCode: { type: String, default: '' },
    note: { type: String, default: '', maxlength: 500 },
  },
  { timestamps: true }
)

orderSchema.index({ user: 1, createdAt: -1 })
orderSchema.index({ status: 1, createdAt: -1 })

// بعد از ثبت: محاسبهٔ مبالغ و شمارهٔ پیگیری
orderSchema.pre('save', function (next) {
  this.subtotal = this.items.reduce((s, i) => s + i.price * i.qty, 0)
  this.total = this.subtotal + this.shippingFee
  next()
})

export default mongoose.model('Order', orderSchema)
