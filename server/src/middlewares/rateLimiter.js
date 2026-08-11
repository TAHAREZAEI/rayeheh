import rateLimit from 'express-rate-limit'

// کلید بر اساس آدرس سوکت — هرگز X-Forwarded-For که کلاینت کنترل می‌کند نیست،
// پس حتی با پراکسی هم rate-limit قابل دور زدن نیست.
const keyGenerator = (req) => req.socket.remoteAddress || 'unknown'

const base = {
  keyGenerator,
  standardHeaders: true,
  legacyHeaders: false,
}

/** محدودسازی عمومی API */
export const apiLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { message: 'درخواست‌های زیادی ارسال کرده‌اید؛ کمی صبر کنید.' },
})

/** محدودسازی شدید برای ورود و ثبت‌نام */
export const authLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { message: 'تلاش‌های زیادی داشته‌اید؛ ۱۵ دقیقه بعد دوباره امتحان کنید.' },
})

/** محدودسازی ثبت سفارش */
export const orderLimiter = rateLimit({
  ...base,
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: { message: 'سفارش‌های زیادی ثبت کرده‌اید؛ کمی صبر کنید.' },
})
