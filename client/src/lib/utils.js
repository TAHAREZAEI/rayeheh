const faDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']

export const toFa = (value) =>
  String(value ?? '').replace(/[0-9]/g, (d) => faDigits[d])

export const toEn = (value) =>
  String(value ?? '')
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))

export function formatPrice(value, { currency = true } = {}) {
  const n = Number(value) || 0
  const formatted = new Intl.NumberFormat('fa-IR').format(n)
  return currency ? `${formatted} تومان` : formatted
}

export function formatCount(value) {
  return new Intl.NumberFormat('fa-IR').format(Number(value) || 0)
}

export function formatDate(iso, withTime = true) {
  if (!iso) return '—'
  const d = new Date(iso)
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...(withTime && { hour: '2-digit', minute: '2-digit' }),
  }).format(d)
}

export function formatWeight(g) {
  return `${toFa(Number(g) || 0)} میلی‌لیتر`
}

export function computeDiscount(price, oldPrice) {
  if (!oldPrice || oldPrice <= price) return 0
  return Math.round(((oldPrice - price) / oldPrice) * 100)
}

export function slugifyFa(text) {
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

export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export function initials(name = '') {
  const parts = String(name).trim().split(/\s+/)
  return parts
    .slice(0, 2)
    .map((p) => p[0] || '')
    .join('')
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
}

/** یک رشته را تا حد دلخواه کوتاه می‌کند */
export function truncate(text, len = 80) {
  if (!text) return ''
  return text.length > len ? `${text.slice(0, len)}…` : text
}
