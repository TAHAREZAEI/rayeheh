import { useState } from 'react'
import { miscApi, extractMessage } from '../lib/api'
import { BRAND, FAQS } from '../data/static'
import { isValidEmail, toEn } from '../lib/utils'

const TOPICS = ['سفارش و پرداخت', 'پیگیری ارسال', 'مشاورهٔ عطر', 'همکاری با ما', 'سایر']

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', topic: '', message: '' })
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.name.trim().length < 3) return setError('نام و نام خانوادگی را کامل بنویسید.')
    if (!isValidEmail(form.email)) return setError('ایمیل معتبر نیست.')
    if (form.message.trim().length < 10) return setError('پیام باید دست‌کم ۱۰ کاراکتر باشد.')
    setSending(true)
    try {
      await miscApi.contact({ ...form, phone: toEn(form.phone) })
      setSent(true)
    } catch (err) {
      setError(extractMessage(err))
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14">
      <div className="text-center">
        <h1 className="font-display text-5xl text-mist">در خدمت شماییم</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-8 text-mist/60">
          برای انتخاب عطر، پیگیری سفارش یا هر سوال دیگر؛ عطارهای ما همه‌روزه از ۱۰ صبح تا ۱۰ شب در کنارتان هستند.
        </p>
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_420px]">
        {/* فرم */}
        <div className="rounded-[2.5rem] border border-mist/10 bg-ink-light/40 p-6 sm:p-10">
          {sent ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <span className="text-5xl" aria-hidden="true">💌</span>
              <h2 className="font-display text-2xl text-mist">پیام شما رسید!</h2>
              <p className="max-w-sm text-sm leading-7 text-mist/60">
                کارشناسان ما حداکثر تا ۲۴ ساعت آینده با شما تماس می‌گیرند. ممنون که به ما اعتماد کردید.
              </p>
              <button
                type="button"
                className="btn-outline mt-4"
                onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', topic: '', message: '' }) }}
              >
                ارسال پیام دیگر
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <h2 className="font-display text-2xl text-mist">فرم تماس</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-name" className="mb-2 block text-xs font-bold text-mist/60">نام و نام خانوادگی *</label>
                  <input id="c-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="field-dark" placeholder="مثلاً: امیرحسین رضایی" />
                </div>
                <div>
                  <label htmlFor="c-phone" className="mb-2 block text-xs font-bold text-mist/60">شمارهٔ موبایل</label>
                  <input id="c-phone" dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="field-dark text-left" placeholder="09123456789" inputMode="tel" />
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-email" className="mb-2 block text-xs font-bold text-mist/60">ایمیل *</label>
                  <input id="c-email" type="email" dir="ltr" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="field-dark text-left" placeholder="you@example.com" />
                </div>
                <div>
                  <label htmlFor="c-topic" className="mb-2 block text-xs font-bold text-mist/60">موضوع</label>
                  <select id="c-topic" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} className="field-dark">
                    <option value="">انتخاب موضوع</option>
                    {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="c-message" className="mb-2 block text-xs font-bold text-mist/60">پیام شما *</label>
                <textarea id="c-message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="field-dark" placeholder="سوال یا پیام خود را بنویسید…" />
              </div>
              {error && <p role="alert" className="text-xs text-rosewood-bright">{error}</p>}
              <button type="submit" disabled={sending} className="btn-gold">
                {sending ? 'در حال ارسال…' : 'ارسال پیام'}
              </button>
            </form>
          )}
        </div>

        {/* اطلاعات تماس */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-mist/10 bg-ink-light/40 p-8">
            <h3 className="font-display text-xl text-mist">راه‌های ارتباطی</h3>
            <ul className="mt-6 space-y-5 text-sm text-mist/70">
              <li className="flex gap-4">
                <span className="text-xl" aria-hidden="true">📍</span>
                <div>
                  <p className="font-bold text-mist">فروشگاه ما</p>
                  <p className="mt-1 leading-7">{BRAND.address}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-xl" aria-hidden="true">📞</span>
                <div>
                  <p className="font-bold text-mist">تلفن</p>
                  <p className="mt-1" dir="ltr">{BRAND.phone}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-xl" aria-hidden="true">📱</span>
                <div>
                  <p className="font-bold text-mist">موبایل و واتساپ</p>
                  <p className="mt-1" dir="ltr">{BRAND.mobile}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-xl" aria-hidden="true">✉️</span>
                <div>
                  <p className="font-bold text-mist">ایمیل</p>
                  <p className="mt-1" dir="ltr">{BRAND.email}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-xl" aria-hidden="true">🕙</span>
                <div>
                  <p className="font-bold text-mist">ساعات کاری</p>
                  <p className="mt-1">{BRAND.workHours}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* سوالات پرتکرار */}
          <div className="rounded-3xl border border-mist/10 bg-ink-light/40 p-8">
            <h3 className="font-display text-xl text-mist">سوالات پرتکرار</h3>
            <ul className="mt-4 divide-y divide-mist/10">
              {FAQS.slice(0, 4).map((f, i) => (
                <li key={f.q}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-4 text-right text-sm font-bold text-mist/80 transition-colors hover:text-saffron"
                    aria-expanded={openFaq === i}
                  >
                    {f.q}
                    <span className={`text-saffron transition-transform duration-300 ${openFaq === i ? 'rotate-45' : ''}`} aria-hidden="true">+</span>
                  </button>
                  {openFaq === i && <p className="pb-4 text-sm leading-7 text-mist/60">{f.a}</p>}
                </li>
              ))}
            </ul>
            <a href="/faq" className="mt-4 inline-block text-xs font-bold text-saffron hover:underline">
              همهٔ سوالات ←
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
