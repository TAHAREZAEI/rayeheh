import { Navigate, NavLink, Outlet } from 'react-router-dom'
import { useAuth, isAdmin } from '../../context/AuthContext'
import PageLoader from '../../components/PageLoader'

const TABS = [
  { to: '/admin', label: 'داشبورد', end: true },
  { to: '/admin/products', label: 'محصولات' },
  { to: '/admin/orders', label: 'سفارش‌ها' },
  { to: '/admin/messages', label: 'پیام‌ها' },
  { to: '/admin/subscribers', label: 'خبرنامه‌ها' },
  { to: '/admin/users', label: 'کاربران' },
]

export default function AdminLayout() {
  const { user, loading } = useAuth()

  if (loading) return <PageLoader />
  if (!user || !isAdmin(user)) return <Navigate to="/" replace />

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-widest2 text-saffron">پنل مدیریت</span>
          <h1 className="mt-1 font-display text-4xl text-mist">داخل خانهٔ رایحه</h1>
        </div>
      </div>

      {/* تب‌ها */}
      <nav className="mt-8 flex gap-2 overflow-x-auto border-b border-mist/10 pb-px no-scrollbar" aria-label="بخش‌های مدیریت">
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-t-2xl px-5 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-b-2 border-saffron text-saffron'
                  : 'text-mist/60 hover:text-mist'
              }`
            }
          >
            {t.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-8">
        <Outlet />
      </div>
    </div>
  )
}
