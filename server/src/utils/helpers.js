import crypto from 'crypto'

/** کد پیگیری سفارش — خوانا، مثلاً RY-8K3F2M7Q9 */
export function orderRef(prefix = 'RY') {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let s = ''
  for (let i = 0; i < 9; i++) s += chars[crypto.randomInt(chars.length)]
  return `${prefix}-${s}`
}

/** کد رهگیری پست — فقط برای نمایش */
export function trackingCode() {
  const d = String(Date.now()).slice(-6)
  const r = Math.floor(1000 + Math.random() * 9000)
  return `R${d}${r}`
}

/** اسلاگ فارسی → انگلیسی (برای آدرس محصولات) */
export function slugify(text = '') {
  const map = {
    آ: 'a', ا: 'a', ب: 'b', پ: 'p', ت: 't', ث: 's', ج: 'j', چ: 'ch',
    ح: 'h', خ: 'kh', د: 'd', ذ: 'z', ر: 'r', ز: 'z', ژ: 'zh', س: 's',
    ش: 'sh', ص: 's', ض: 'z', ط: 't', ظ: 'z', ع: 'a', غ: 'gh', ف: 'f',
    ق: 'gh', ک: 'k', گ: 'g', ل: 'l', م: 'm', ن: 'n', و: 'v', ه: 'h',
    ی: 'y', 'ي': 'y', ' ': '-',
  }
  return text
    .split('')
    .map((c) => map[c] || c)
    .join('')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

/** یک‌تا (عنوان/ایمیل) را یکدست می‌کند */
export function normalize(s = '') {
  return s.normalize('NFKC').replace(/[‌]/g, '').trim().toLowerCase()
}

export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n))
}

/** پاک‌سازی فیلدهای حساس کاربر قبل از ارسال به کلاینت */
export function publicUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    role: user.role,
    createdAt: user.createdAt,
  }
}
