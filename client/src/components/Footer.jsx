import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'
import Seal from './Seal'
import { BRAND } from '../data/static'
import { miscApi, extractMessage } from '../lib/api'
import { isValidEmail } from '../lib/utils'

function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | ok | error
  const [msg, setMsg] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (!isValidEmail(email)) {
      setStatus('error')
      setMsg('لطفاً یک ایمیل معتبر بنویسید.')
      return
    }
    setStatus('loading')
    try {
      await miscApi.subscribe(email)
      setStatus('ok')
      setMsg('به باشگاه رایحه خوش آمدید؛ کد هدیه به ایمیل‌تان رسید. ✨')
      setEmail('')
    } catch (err) {
      setStatus('error')
      setMsg(extractMessage(err))
    }
  }

  return (
    <form onSubmit={submit} className="mt-4">
      <div className="flex overflow-hidden rounded-full border border-mist/15 bg-ink-light/60 focus-within:border-saffron">
        <input
          type="email"
          dir="ltr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ایمیل شما"
          className="w-full bg-transparent px-5 py-3 text-sm text-mist placeholder-mist/30 focus:outline-none"
          aria-label="ایمیل برای خبرنامه"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="m-1 rounded-full bg-saffron px-5 text-xs font-bold text-ink transition-colors hover:bg-saffron-light disabled:opacity-60"
        >
          {status === 'loading' ? '...' : 'عضویت'}
        </button>
      </div>
      {status === 'ok' && <p className="mt-2 text-xs text-saffron">{msg}</p>}
      {status === 'error' && <p className="mt-2 text-xs text-rosewood">{msg}</p>}
    </form>
  )
}

export default function Footer() {
  return (
    <footer className="relative border-t border-mist/10 bg-ink-light/40">
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-30" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* برند */}
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-7 text-mist/60">
              از سال {BRAND.since}، رایحه را با گلاب قمصر، عود و عنبر می‌شناسیم؛ جایی که
              عطر اورجینال، با مهر اصالت و بسته‌بندیِ نفیس به دست شما می‌رسد.
            </p>
            <div className="mt-4 flex items-center gap-3 text-mist/70">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-mist/10 opacity-70" title="به‌زودی">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" />
                </svg>
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-mist/10 opacity-70" title="به‌زودی">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M21.5 4.5 3.5 11.2l5 1.8 1.9 5.7 2.7-3.8 4.7 3.5L21.5 4.5Z" />
                </svg>
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-mist/10 opacity-70" title="به‌زودی">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3Z" />
                </svg>
              </span>
            </div>
          </div>

          {/* دسترسی سریع */}
          <nav aria-label="دسترسی سریع">
            <h4 className="mb-4 text-sm font-bold tracking-widest text-saffron">دسترسی سریع</h4>
            <ul className="space-y-2.5 text-sm text-mist/70">
              <li><Link to="/shop" className="transition-colors hover:text-saffron">فروشگاه عطر</Link></li>
              <li><Link to="/shop?cat=women" className="transition-colors hover:text-saffron">عطر زنانه</Link></li>
              <li><Link to="/shop?cat=men" className="transition-colors hover:text-saffron">عطر مردانه</Link></li>
              <li><Link to="/about" className="transition-colors hover:text-saffron">دربارهٔ ما</Link></li>
              <li><Link to="/contact" className="transition-colors hover:text-saffron">تماس با ما</Link></li>
              <li><Link to="/account" className="transition-colors hover:text-saffron">حساب کاربری</Link></li>
            </ul>
          </nav>

          {/* راهنما */}
          <nav aria-label="راهنمای خرید">
            <h4 className="mb-4 text-sm font-bold tracking-widest text-saffron">راهنمای خرید</h4>
            <ul className="space-y-2.5 text-sm text-mist/70">
              <li><Link to="/faq" className="transition-colors hover:text-saffron">سوالات پرتکرار</Link></li>
              <li><Link to="/contact" className="transition-colors hover:text-saffron">پیگیری سفارش</Link></li>
              <li><Link to="/faq" className="transition-colors hover:text-saffron">شرایط بازگشت کالا</Link></li>
              <li><Link to="/faq" className="transition-colors hover:text-saffron">ضمانت اصالت</Link></li>
              <li><Link to="/faq" className="transition-colors hover:text-saffron">حریم خصوصی</Link></li>
            </ul>
          </nav>

          {/* خبرنامه */}
          <div>
            <h4 className="mb-2 text-sm font-bold tracking-widest text-saffron">باشگاه رایحه</h4>
            <p className="text-sm leading-7 text-mist/60">
              عضو شوید تا از تخفیف‌های اختصاصی و رایحه‌های تازه زودتر از همه باخبر شوید؛
              به عنوان هدیه، یک کد تخفیف ۱۰٪ برایتان می‌فرستیم.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* اطلاعات تماس */}
        <div className="mt-12 grid gap-6 border-t border-mist/10 pt-8 text-sm text-mist/60 md:grid-cols-3">
          <p>📍 {BRAND.address}</p>
          <p dir="ltr" className="text-right">📞 {BRAND.phone} — {BRAND.mobile}</p>
          <p>🕙 {BRAND.workHours}</p>
        </div>

        {/* مهر + کپی‌رایت */}
        <div className="mt-10 flex flex-col items-center gap-4 border-t border-mist/10 pt-8 text-center">
          <Seal size="sm" />
          <p className="text-xs text-mist/60">
            © {new Date().getFullYear()} فروشگاه رایحه — تمامی حقوق محفوظ است. ساخته‌شده با عشق، در تهران.
          </p>
        </div>
      </div>
    </footer>
  )
}
