import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { extractMessage } from '../lib/api'
import { isValidEmail, toEn } from '../lib/utils'
import Seal from '../components/Seal'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.name.trim().length < 3) return setError('نام و نام خانوادگی را کامل بنویسید.')
    if (!isValidEmail(form.email)) return setError('ایمیل معتبر نیست.')
    if (form.phone && !/^09\d{9}$/.test(toEn(form.phone))) return setError('شمارهٔ موبایل باید با ۰۹ شروع و ۱۱ رقم باشد.')
    if (form.password.length < 8) return setError('رمز عبور باید دست‌کم ۸ کاراکتر باشد.')
    if (form.password !== form.confirm) return setError('رمز عبور و تکرار آن یکسان نیستند.')

    setLoading(true)
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: toEn(form.phone),
        password: form.password,
      })
      navigate('/account')
    } catch (err) {
      setError(extractMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative mx-auto max-w-md px-4 py-16">
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-saffron/10 blur-[100px]" aria-hidden="true" />
      <div className="relative rounded-[2rem] border border-mist/10 bg-ink-light/50 p-8 backdrop-blur">
        <Seal className="mx-auto" size="sm" />
        <h1 className="mt-4 text-center font-display text-3xl text-mist">عضویت در رایحه</h1>
        <p className="mt-2 text-center text-sm text-mist/60">
          با عضویت، سفارش‌هایتان را پیگیری و رایحه‌های محبوب‌تان را ذخیره کنید
        </p>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-xs font-bold text-mist/60">نام و نام خانوادگی *</label>
            <input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="field-dark"
              placeholder="مثلاً: نگار محمدی"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-xs font-bold text-mist/60">ایمیل *</label>
            <input
              id="email"
              type="email"
              dir="ltr"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="field-dark text-left"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="phone" className="mb-2 block text-xs font-bold text-mist/60">شمارهٔ موبایل</label>
            <input
              id="phone"
              dir="ltr"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="field-dark text-left"
              placeholder="09123456789"
              inputMode="tel"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="mb-2 block text-xs font-bold text-mist/60">رمز عبور *</label>
              <input
                id="password"
                type="password"
                dir="ltr"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="field-dark text-left"
                placeholder="حداقل ۸ کاراکتر"
              />
            </div>
            <div>
              <label htmlFor="confirm" className="mb-2 block text-xs font-bold text-mist/60">تکرار رمز *</label>
              <input
                id="confirm"
                type="password"
                dir="ltr"
                required
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                className="field-dark text-left"
                placeholder="••••••••"
              />
            </div>
          </div>
          {error && <p role="alert" className="text-xs leading-6 text-rosewood-bright">{error}</p>}
          <button type="submit" disabled={loading} className="btn-gold w-full">
            {loading ? 'در حال ساخت حساب…' : 'ایجاد حساب'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-mist/60">
          قبلاً عضو شده‌اید؟{' '}
          <Link to="/login" className="font-bold text-saffron hover:underline">وارد شوید</Link>
        </p>
      </div>
    </div>
  )
}
