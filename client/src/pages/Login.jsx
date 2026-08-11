import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { extractMessage } from '../lib/api'
import { toEn } from '../lib/utils'
import Seal from '../components/Seal'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(form)
      navigate('/account')
    } catch (err) {
      setError(extractMessage(err, 'ایمیل یا رمز عبور اشتباه است.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative mx-auto max-w-md px-4 py-16">
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-saffron/10 blur-[100px]" aria-hidden="true" />
      <div className="relative rounded-[2rem] border border-mist/10 bg-ink-light/50 p-8 backdrop-blur">
        <Seal className="mx-auto" size="sm" />
        <h1 className="mt-4 text-center font-display text-3xl text-mist">خوش آمدید</h1>
        <p className="mt-2 text-center text-sm text-mist/60">برای ادامه، وارد حساب کاربری‌تان شوید</p>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-xs font-bold text-mist/60">ایمیل</label>
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
            <label htmlFor="password" className="mb-2 block text-xs font-bold text-mist/60">رمز عبور</label>
            <input
              id="password"
              type="password"
              dir="ltr"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="field-dark text-left"
              placeholder="••••••••"
            />
          </div>
          {error && <p role="alert" className="text-xs leading-6 text-rosewood-bright">{error}</p>}
          <button type="submit" disabled={loading} className="btn-gold w-full">
            {loading ? 'در حال ورود…' : 'ورود به حساب'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-mist/60">
          حساب ندارید؟{' '}
          <Link to="/register" className="font-bold text-saffron hover:underline">ثبت‌نام کنید</Link>
        </p>
        <button
          type="button"
          className="mt-4 w-full rounded-full border border-mist/15 py-2.5 text-xs text-mist/50 transition-colors hover:text-saffron"
          onClick={() => {
            setForm({ email: 'demo@rayeheh.com', password: 'demo1234' })
          }}
        >
          ورود سریع با حساب نمایشی
        </button>
      </div>
    </div>
  )
}
