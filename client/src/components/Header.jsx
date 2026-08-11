import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import Logo from './Logo'
import { useAuth, isAdmin } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useUi } from '../context/UiContext'
import { toFa } from '../lib/utils'

const NAV = [
  { to: '/', label: 'خانه' },
  { to: '/shop', label: 'فروشگاه' },
  { to: '/about', label: 'دربارهٔ ما' },
  { to: '/contact', label: 'تماس با ما' },
]

function UserMenu() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  if (!user)
    return (
      <Link
        to="/login"
        className="rounded-full border border-mist/20 px-4 py-2 text-xs font-medium text-mist transition-colors hover:border-saffron hover:text-saffron"
      >
        ورود | ثبت‌نام
      </Link>
    )

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-mist/20 py-1.5 pl-3 pr-1.5 text-xs font-medium text-mist transition-colors hover:border-saffron hover:text-saffron"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-saffron text-sm font-bold text-ink">
          {user.name?.[0] || 'ک'}
        </span>
        <span className="max-w-[7rem] truncate">{user.name || user.email}</span>
        <span aria-hidden="true">▾</span>
      </button>
      {open && (
        <div className="absolute left-auto right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-mist/10 bg-ink-light shadow-2xl animate-scale-in">
          <Link to="/account" onClick={() => setOpen(false)} className="block px-4 py-3 text-sm text-mist transition-colors hover:bg-saffron/10 hover:text-saffron">
            پنل کاربری
          </Link>
          <Link to="/orders" onClick={() => setOpen(false)} className="block px-4 py-3 text-sm text-mist transition-colors hover:bg-saffron/10 hover:text-saffron">
            سفارش‌های من
          </Link>
          {isAdmin(user) && (
            <Link to="/admin" onClick={() => setOpen(false)} className="block px-4 py-3 text-sm text-saffron transition-colors hover:bg-saffron/10">
              پنل مدیریت
            </Link>
          )}
          <button
            type="button"
            onClick={() => { setOpen(false); logout() }}
            className="block w-full border-t border-mist/10 px-4 py-3 text-right text-sm text-rosewood transition-colors hover:bg-rosewood/10"
          >
            خروج
          </button>
        </div>
      )}
    </div>
  )
}

export default function Header() {
  const { cartOpen, setCartOpen, searchOpen, setSearchOpen, mobileMenuOpen, setMobileMenuOpen } = useUi()
  const { count } = useCart()
  const { user } = useAuth()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-all duration-300 ${
        scrolled
          ? 'border-mist/10 bg-ink/95 backdrop-blur-md shadow-lg'
          : 'border-transparent bg-ink'
      }`}
    >
      {/* نوار بالایی */}
      <div className="hidden border-b border-mist/5 bg-ink-light/60 py-1.5 text-[11px] text-mist/60 lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4">
          <p>ارسال رایگان برای سفارش‌های بالای {toFa(2_000_000)} تومان در تهران 🚚</p>
          <p className="tracking-wider">۰۲۱-۹۱۰۰۸۸۶۶ | همه‌روزه ۱۰ تا ۲۲</p>
        </div>
      </div>

      {/* نوار اصلی */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        {/* موبایل: منو */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-mist/15 text-mist lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="منو"
          aria-expanded={mobileMenuOpen}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {mobileMenuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h10" />}
          </svg>
        </button>

        <Logo />

        {/* ناوبری دسکتاپ */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="ناوبری اصلی">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-saffron/10 text-saffron' : 'text-mist/80 hover:text-saffron'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* اکشن‌ها */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-mist/15 text-mist transition-colors hover:border-saffron hover:text-saffron"
            aria-label="جستجو"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-mist/15 text-mist transition-colors hover:border-saffron hover:text-saffron"
            aria-label={`سبد خرید، ${toFa(count)} کالا`}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 7h12l1.5 12.5a1 1 0 0 1-1 1.5h-13a1 1 0 0 1-1-1.5L6 7Z" />
              <path d="M9 10V6a3 3 0 0 1 6 0v4" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-saffron px-1 text-[10px] font-bold text-ink">
                {toFa(count)}
              </span>
            )}
          </button>

          <div className="hidden sm:block">
            <UserMenu />
          </div>
        </div>
      </div>

      {/* منوی موبایل */}
      {mobileMenuOpen && (
        <nav
          className="border-t border-mist/10 bg-ink px-4 pb-5 pt-2 lg:hidden animate-fade-in"
          aria-label="منوی موبایل"
        >
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive ? 'bg-saffron/10 text-saffron' : 'text-mist/80 hover:bg-mist/5'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div className="mt-3 border-t border-mist/10 pt-3">
            <UserMenu />
          </div>
        </nav>
      )}
    </header>
  )
}
