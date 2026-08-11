import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { orderApi, authApi, extractMessage } from '../lib/api'
import { formatPrice, formatDate, toEn, toFa } from '../lib/utils'
import PageLoader from '../components/PageLoader'
import Spinner from '../components/Spinner'

const STATUS_LABELS = {
  pending: 'در انتظار پرداخت',
  paid: 'پرداخت شده',
  processing: 'در حال آماده‌سازی',
  shipped: 'ارسال شده',
  delivered: 'تحویل شده',
  cancelled: 'لغو شده',
}

const STATUS_COLORS = {
  pending: 'bg-amber-500/15 text-amber-400',
  paid: 'bg-sky-500/15 text-sky-400',
  processing: 'bg-saffron/15 text-saffron',
  shipped: 'bg-violet-500/15 text-violet-400',
  delivered: 'bg-emerald-500/15 text-emerald-400',
  cancelled: 'bg-rosewood/15 text-rosewood',
}

function ProfileForm({ user, updateProfile }) {
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMsg('')
    try {
      if (form.phone && !/^09\d{9}$/.test(toEn(form.phone))) {
        setMsg('شمارهٔ موبایل معتبر نیست.')
        return
      }
      await updateProfile({ name: form.name.trim(), phone: toEn(form.phone) })
      setMsg('✓ اطلاعات با موفقیت ذخیره شد')
    } catch (err) {
      setMsg(extractMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label htmlFor="p-name" className="mb-2 block text-xs font-bold text-mist/60">نام و نام خانوادگی</label>
        <input id="p-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="field-dark" />
      </div>
      <div>
        <label htmlFor="p-phone" className="mb-2 block text-xs font-bold text-mist/60">شمارهٔ موبایل</label>
        <input id="p-phone" dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="field-dark text-left" placeholder="09123456789" inputMode="tel" />
      </div>
      <div>
        <label htmlFor="p-email" className="mb-2 block text-xs font-bold text-mist/60">ایمیل (قابل تغییر نیست)</label>
        <input id="p-email" dir="ltr" value={user?.email || ''} disabled className="field-dark text-left opacity-60" />
      </div>
      {msg && <p className="text-xs text-saffron">{msg}</p>}
      <button type="submit" disabled={saving} className="btn-gold">
        {saving ? 'در حال ذخیره…' : 'ذخیرهٔ تغییرات'}
      </button>
    </form>
  )
}

function PasswordForm() {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [ok, setOk] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (form.next.length < 8) return setMsg('رمز جدید باید دست‌کم ۸ کاراکتر باشد.')
    if (form.next !== form.confirm) return setMsg('تکرار رمز جدید یکسان نیست.')
    setSaving(true)
    setMsg('')
    try {
      await authApi.changePassword({ currentPassword: form.current, newPassword: form.next })
      setOk(true)
      setMsg('✓ رمز عبور با موفقیت تغییر کرد')
      setForm({ current: '', next: '', confirm: '' })
    } catch (err) {
      setOk(false)
      setMsg(extractMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label htmlFor="pw-current" className="mb-2 block text-xs font-bold text-mist/60">رمز فعلی</label>
        <input id="pw-current" type="password" dir="ltr" required value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} className="field-dark text-left" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="pw-next" className="mb-2 block text-xs font-bold text-mist/60">رمز جدید</label>
          <input id="pw-next" type="password" dir="ltr" required value={form.next} onChange={(e) => setForm({ ...form, next: e.target.value })} className="field-dark text-left" />
        </div>
        <div>
          <label htmlFor="pw-confirm" className="mb-2 block text-xs font-bold text-mist/60">تکرار رمز جدید</label>
          <input id="pw-confirm" type="password" dir="ltr" required value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} className="field-dark text-left" />
        </div>
      </div>
      {msg && <p role="alert" className={`text-xs ${ok ? 'text-emerald-400' : 'text-rosewood-bright'}`}>{msg}</p>}
      <button type="submit" disabled={saving} className="btn-outline">
        {saving ? 'در حال تغییر…' : 'تغییر رمز عبور'}
      </button>
    </form>
  )
}

export default function Account() {
  const { user, updateProfile } = useAuth()
  const [orders, setOrders] = useState(null)
  const [tab, setTab] = useState('orders')

  useEffect(() => {
    orderApi.mine().then(({ data }) => setOrders(data.orders)).catch(() => setOrders([]))
  }, [])

  if (!user) return <Navigate to="/login" replace />
  if (!orders) return <PageLoader />

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-mist">سلام، {user.name || 'عزیز'} 👋</h1>
          <p className="mt-1 text-sm text-mist/70">{user.email}</p>
        </div>
        <span className="rounded-full border border-saffron/30 bg-saffron/10 px-4 py-1.5 text-xs font-bold text-saffron">
          {user.role === 'admin' ? 'مدیر فروشگاه' : 'مشتری وفادار'}
        </span>
      </div>

      {/* تب‌ها */}
      <div className="mt-8 flex gap-2 border-b border-mist/10">
        {[
          { key: 'orders', label: `سفارش‌ها (${toFa(orders.length)})` },
          { key: 'profile', label: 'پروفایل' },
          { key: 'password', label: 'رمز عبور' },
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`rounded-t-2xl px-5 py-3 text-sm font-medium transition-colors ${
              tab === t.key
                ? 'border-b-2 border-saffron text-saffron'
                : 'text-mist/60 hover:text-mist'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === 'orders' && (
          orders.length === 0 ? (
            <div className="rounded-3xl border border-mist/10 bg-ink-light/40 p-12 text-center">
              <p className="text-4xl" aria-hidden="true">📦</p>
              <h2 className="mt-4 font-display text-xl text-mist">هنوز سفارشی ندارید</h2>
              <p className="mt-2 text-sm text-mist/60">اولین رایحهٔ شما در انتظار است!</p>
              <a href="/shop" className="btn-gold mt-6 inline-block">رفتن به فروشگاه</a>
            </div>
          ) : (
            <ul className="space-y-4">
              {orders.map((o) => (
                <li key={o._id} className="rounded-3xl border border-mist/10 bg-ink-light/40 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-display text-lg text-mist" dir="ltr">{o.ref}</p>
                      <p className="mt-1 text-xs text-mist/70">{formatDate(o.createdAt)}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${STATUS_COLORS[o.status] || 'bg-mist/10 text-mist/60'}`}>
                      {STATUS_LABELS[o.status] || o.status}
                    </span>
                    <span className="font-display text-xl text-saffron">{formatPrice(o.total)}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-mist/10 pt-4 text-xs text-mist/70">
                    {o.items.map((i) => (
                      <span key={i._id} className="rounded-full border border-mist/15 px-3 py-1">
                        {i.product?.name || 'محصول'} × {toFa(i.qty)}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )
        )}

        {tab === 'profile' && (
          <div className="rounded-3xl border border-mist/10 bg-ink-light/40 p-6 sm:p-8">
            <h2 className="mb-6 font-display text-xl text-mist">اطلاعات حساب</h2>
            <ProfileForm user={user} updateProfile={updateProfile} />
          </div>
        )}

        {tab === 'password' && (
          <div className="rounded-3xl border border-mist/10 bg-ink-light/40 p-6 sm:p-8">
            <h2 className="mb-6 font-display text-xl text-mist">تغییر رمز عبور</h2>
            <PasswordForm />
          </div>
        )}
      </div>
    </div>
  )
}
