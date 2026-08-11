import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import mongoose from 'mongoose'

import { connectDB } from './config/db.js'
import { errorHandler, notFoundRoute } from './middlewares/errorHandler.js'
import { apiLimiter } from './middlewares/rateLimiter.js'
import { seedIfEmpty } from './seed/seed.js'

import authRoutes from './routes/authRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import miscRoutes from './routes/miscRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

const app = express()
const PORT = process.env.PORT || 5000

// بدون پراکسی جلو (سرور مستقیم به اینترنت وصل است) trust proxy را تنظیم نمی‌کنیم؛
// در غیر این صورت X-Forwarded-For کلاینت کنترل می‌شود و rate-limit دور می‌زند.

app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'))
app.use('/api', apiLimiter)

// سلامت
app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', time: new Date().toISOString() })
)

// مسیرها
app.use('/api/auth', authRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api', miscRoutes)
app.use('/api/admin', adminRoutes)

// 404 و خطاها
app.use(notFoundRoute)
app.use(errorHandler)

async function main() {
  await connectDB(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rayeheh')
  await seedIfEmpty()

  app.listen(PORT, () => {
    console.log(`✓ RAYEHEH API running on http://localhost:${PORT}`)
  })
}

// خاموشی نرم
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, async () => {
    console.log(`\n${signal} received, closing…`)
    await mongoose.connection.close()
    process.exit(0)
  })
}

main().catch((err) => {
  console.error('✗ Server failed to start:', err.message)
  process.exit(1)
})
