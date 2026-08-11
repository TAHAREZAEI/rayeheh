import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { orderApi, extractMessage } from '../lib/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useSettings } from '../context/SettingsContext'
import { formatPrice, toEn, toFa } from '../lib/utils'
import { BRAND } from '../data/static'
import BottleArt from '../components/BottleArt'

const PROVINCES = [
  'تهران', 'البرز', 'اصفهان', 'فارس', 'خراسان رضوی', 'آذربایجان شرقی',
  'آذربایجان غربی', 'اردبیل', 'ایلام', 'بوشهر', 'چهارمحال و بختیاری',
  'خراسان جنوبی', 'خراسان شمالی', 'خوزستان', 'زنجان', 'سمنان', 'سیستان و بلوچستان',
  'قزوین', 'قم', 'کردستان', 'کرمان', 'کرمانشاه', 'کهگیلویه و بویراحمد',
  'گلستان', 'گیلان', 'لرستان', 'مازندران', 'مرکزی', 'هرمزگان', 'همدان', 'یزد',
]

const EMPTY_FORM = {
  fullName: '',
  phone: '',
  province: '',
  city: '',
  address: '',
  postalCode: '',
  note: '',
}

export default function Checkout() {
  const { items, count, amount, clear } = useCart()
  const { user } = useAuth()
  const { shipping } = useSettings()
  const navigate = useNavigate()

  const [form, setForm] = useState(() => ({
    ...EMPTY_FORM,
    fullName: user?.name || '',
    phone: user?.phone || '',
  }))
  const [paymentMethod, setPaymentMethod] = useState('online')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // پیش‌پر کردن اطلاعات کاربر
  useEffect(() => {
    if (user) {
      setForm((f) => ({ ...f, fullName: f.fullName || user.name || '', phone: f.phone || user.phone || '' }))
    }
  }, [user])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const codEnabled = shipping?.codEnabled !== false
  const isTeheran = form.province === 'تهران'
  const fee = isTeheran ? shipping?.teheranFee ?? 45000 : shipping?.cityFee ?? 65000
  const freeAbove = isTeheran ? shipping?.teheranFreeAbove ?? 2_000_000 : shipping?.cityFreeAbove ?? 2_500_000
  const shippingFee = amount >= freeAbove ? 0 : fee
  const total = amount + shippingFee

  const formValid = useMemo(
    () =>
      form.fullName.trim().length >= 3 &&
      /^09\d{9}$/.test(toEn(form.phone)) &&
      form.province &&
      form.city.trim().length >= 2 &&
      form.address.trim().length >= 10 &&
      form.postalCode.trim().length >= 5,
    [form]
  )

  if (items.length === 0)
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-mist">سبد خرید خالی است</h1>
        <Link to="/shop" className="btn-gold mt-8">رفتن به فروشگاه</Link>
      </div>
    )

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formValid) {
      setError('لطفاً همهٔ فیلدها را دقیق پر کنید؛ شمارهٔ موبایل با ۰۹ شروع شود.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const { data } = await orderApi.create({
        items: items.map((i) => ({ product: i.id, qty: i.qty })),
        customer: {
          fullName: form.fullName.trim(),
          phone: toEn(form.phone),
          province: form.province,
          city: form.city.trim(),
          address: form.address.trim(),
          postalCode: toEn(form.postalCode.trim()),
        },
        note: form.note.trim(),
        paymentMethod,
      })
      clear()
      navigate(`/order/success/${data.order.ref}`)
    } catch (err) {
      setError(extractMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-display text-4xl text-mist">تسویه حساب</h1>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          {/* اطلاعات گیرنده */}
          <section className="rounded-3xl border border-mist/10 bg-ink-light/40 p-6 sm:p-8">
            <h2 className="font-display text-xl text-mist">اطلاعات گیرنده</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="fullName" className="mb-2 block text-xs font-bold text-mist/60">نام و نام خانوادگی *</label>
                <input id="fullName" value={form.fullName} onChange={set('fullName')} className="field-dark" placeholder="مثلاً: نگار محمدی" />
              </div>
              <div>
                <label htmlFor="phone" className="mb-2 block text-xs font-bold text-mist/60">شمارهٔ موبایل *</label>
                <input
                  id="phone"
                  dir="ltr"
                  value={form.phone}
                  onChange={set('phone')}
                  className="field-dark text-left"
                  placeholder="09123456789"
                  inputMode="tel"
                />
              </div>
            </div>
            {!user && (
              <p className="mt-4 rounded-2xl bg-saffron/5 px-4 py-3 text-xs leading-6 text-mist/60">
                <Link to="/login" className="text-saffron hover:underline">وارد شوید</Link> تا سفارش‌تان را در پنل کاربری پیگیری کنید و دفعهٔ بعد، آدرس‌تان از قبل پر شود.
              </p>
            )}
          </section>

          {/* آدرس */}
          <section className="rounded-3xl border border-mist/10 bg-ink-light/40 p-6 sm:p-8">
            <h2 className="font-display text-xl text-mist">آدرس تحویل</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="province" className="mb-2 block text-xs font-bold text-mist/60">استان *</label>
                <select id="province" value={form.province} onChange={set('province')} className="field-dark">
                  <option value="">انتخاب استان</option>
                  {PROVINCES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="city" className="mb-2 block text-xs font-bold text-mist/60">شهر *</label>
                <input id="city" value={form.city} onChange={set('city')} className="field-dark" placeholder="مثلاً: تهران" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="address" className="mb-2 block text-xs font-bold text-mist/60">نشانی کامل *</label>
                <textarea id="address" rows={2} value={form.address} onChange={set('address')} className="field-dark" placeholder="خیابان، کوچه، پلاک، واحد…" />
              </div>
              <div>
                <label htmlFor="postalCode" className="mb-2 block text-xs font-bold text-mist/60">کد پستی *</label>
                <input id="postalCode" dir="ltr" value={form.postalCode} onChange={set('postalCode')} className="field-dark text-left" placeholder="1234567890" inputMode="numeric" />
              </div>
              <div>
                <label htmlFor="note" className="mb-2 block text-xs font-bold text-mist/60">یادداشت (اختیاری)</label>
                <input id="note" value={form.note} onChange={set('note')} className="field-dark" placeholder="مثلاً: زمان تماس، بسته‌بندی هدیه…" />
              </div>
            </div>
          </section>

          {/* روش پرداخت */}
          <section className="rounded-3xl border border-mist/10 bg-ink-light/40 p-6 sm:p-8">
            <h2 className="font-display text-xl text-mist">روش پرداخت</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <label className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition-colors ${paymentMethod === 'online' ? 'border-saffron bg-saffron/10' : 'border-mist/10 hover:border-mist/25'}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'online'}
                  onChange={() => setPaymentMethod('online')}
                  className="mt-1 h-4 w-4 rounded-full border-mist/30 text-saffron focus:ring-saffron/40"
                />
                <span>
                  <span className="block text-sm font-bold text-mist">پرداخت آنلاین</span>
                  <span className="mt-1 block text-xs leading-6 text-mist/60">
                    با کارت‌های شتاب از طریق درگاه امن پرداخت؛ در این نسخهٔ نمایشی، سفارش مستقیم ثبت می‌شود.
                  </span>
                </span>
              </label>
              {codEnabled && (
                <label className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition-colors ${paymentMethod === 'cod' ? 'border-saffron bg-saffron/10' : 'border-mist/10 hover:border-mist/25'}`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 h-4 w-4 rounded-full border-mist/30 text-saffron focus:ring-saffron/40"
                  />
                  <span>
                    <span className="block text-sm font-bold text-mist">پرداخت در محل</span>
                    <span className="mt-1 block text-xs leading-6 text-mist/60">
                      فقط تهران و کرج؛ مبلغ را هنگام تحویل به مامور بپردازید.
                    </span>
                  </span>
                </label>
              )}
            </div>
          </section>
        </div>

        {/* خلاصه سفارش */}
        <aside className="h-fit rounded-3xl border border-saffron/20 bg-saffron/5 p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-xl text-mist">سفارش شما</h2>
          <ul className="mt-5 space-y-3">
            {items.map((item) => (
              <li key={item.key} className="flex items-center gap-3 text-sm">
                <span className="flex h-11 w-9 shrink-0 items-center justify-center rounded-lg bg-paper/5">
                  <BottleArt name={item.name} className="h-9 w-7" alt="" />
                </span>
                <span className="flex-1">
                  <span className="block truncate font-bold text-mist">{item.name}</span>
                  <span className="text-xs text-mist/50">تعداد {toFa(item.qty)}</span>
                </span>
                <span className="font-bold text-mist">{formatPrice(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-3 border-t border-mist/10 pt-5 text-sm">
            <div className="flex justify-between text-mist/70">
              <dt>جمع کالاها</dt>
              <dd className="font-bold text-mist">{formatPrice(amount)}</dd>
            </div>
            <div className="flex justify-between text-mist/70">
              <dt>هزینهٔ ارسال ({isTeheran ? 'تهران' : form.province || 'شهرستان'})</dt>
              <dd className="font-bold text-mist">{shippingFee === 0 ? 'رایگان 🎉' : formatPrice(shippingFee)}</dd>
            </div>
            <div className="flex justify-between border-t border-mist/10 pt-3 text-base">
              <dt className="font-bold text-mist">مبلغ نهایی</dt>
              <dd className="font-display text-2xl text-saffron">{formatPrice(total)}</dd>
            </div>
          </dl>

          {error && (
            <p role="alert" className="mt-4 rounded-2xl bg-rosewood/15 px-4 py-3 text-xs leading-6 text-rosewood-dark">{error}</p>
          )}

          <button type="submit" disabled={submitting} className="btn-gold mt-6 w-full">
            {submitting ? 'در حال ثبت سفارش…' : `ثبت سفارش — ${formatPrice(total)}`}
          </button>
          <p className="mt-4 text-center text-[11px] leading-5 text-mist/40">
            با ثبت سفارش، شرایط استفاده و حریم خصوصی {BRAND.name} را می‌پذیرید.
          </p>
        </aside>
      </form>
    </div>
  )
}
