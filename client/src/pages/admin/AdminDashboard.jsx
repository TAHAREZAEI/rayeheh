import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '../../lib/api'
import { formatPrice, formatDate, toFa } from '../../lib/utils'
import PageLoader from '../../components/PageLoader'

const STATUS_LABELS = {
  pending: 'در انتظار پرداخت',
  paid: 'پرداخت شده',
  processing: 'در حال آماده‌سازی',
  shipped: 'ارسال شده',
  delivered: 'تحویل شده',
  cancelled: 'لغو شده',
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    adminApi.stats().then(({ data }) => setStats(data)).catch(() => setStats({}))
  }, [])

  if (!stats) return <PageLoader />

  const cards = [
    { label: 'درآمد کل', value: formatPrice(stats.totalRevenue), icon: '💰' },
    { label: 'سفارش‌ها', value: toFa(stats.totalOrders), icon: '📦' },
    { label: 'محصولات', value: toFa(stats.totalProducts), icon: '🫙' },
    { label: 'کاربران', value: toFa(stats.totalUsers), icon: '👥' },
    { label: 'پیام‌های خوانده‌نشده', value: toFa(stats.unreadMessages), icon: '💌' },
    { label: 'اعضای خبرنامه', value: toFa(stats.totalSubscribers), icon: '✉️' },
  ]

  return (
    <div className="space-y-10">
      {/* کارت‌های آمار */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="flex items-center gap-4 rounded-3xl border border-mist/10 bg-ink-light/40 p-6">
            <span className="text-3xl" aria-hidden="true">{c.icon}</span>
            <div>
              <p className="text-xs text-mist/70">{c.label}</p>
              <p className="mt-1 font-display text-2xl text-saffron">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* توزیع وضعیت سفارش‌ها */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-mist/10 bg-ink-light/40 p-6">
          <h2 className="font-display text-lg text-mist">وضعیت سفارش‌های فعال</h2>
          <div className="mt-5 space-y-3">
            {Object.entries(stats.statusCounts || {}).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between text-sm">
                <span className="text-mist/70">{STATUS_LABELS[status] || status}</span>
                <span className="font-bold text-mist">{toFa(count)}</span>
              </div>
            ))}
            {!Object.keys(stats.statusCounts || {}).length && (
              <p className="text-sm text-mist/60">سفارشی ثبت نشده است.</p>
            )}
          </div>
          <Link to="/admin/orders" className="btn-outline mt-6 w-full">مدیریت سفارش‌ها</Link>
        </div>

        {/* آخرین سفارش‌ها */}
        <div className="rounded-3xl border border-mist/10 bg-ink-light/40 p-6">
          <h2 className="font-display text-lg text-mist">آخرین سفارش‌ها</h2>
          {stats.recentOrders?.length ? (
            <ul className="mt-5 space-y-3">
              {stats.recentOrders.map((o) => (
                <li key={o._id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-bold text-mist" dir="ltr">{o.ref}</span>
                  <span className="flex-1 truncate text-mist/70">{o.customer?.fullName}</span>
                  <span className="text-mist/70">{formatPrice(o.total)}</span>
                  <span className="text-[11px] text-mist/60">{formatDate(o.createdAt, false)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 text-sm text-mist/60">هنوز سفارشی نداریم.</p>
          )}
        </div>
      </div>

      {/* محصولات کم‌موجود */}
      <div className="rounded-3xl border border-mist/10 bg-ink-light/40 p-6">
        <h2 className="font-display text-lg text-mist">محصولات کم‌موجود (زیر ۵ عدد)</h2>
        {stats.lowStock?.length ? (
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stats.lowStock.map((p) => (
              <li key={p._id} className="flex items-center justify-between rounded-2xl border border-mist/10 bg-ink p-4 text-sm">
                <span className="font-bold text-mist">{p.name}</span>
                <span className={`font-bold ${p.stock <= 2 ? 'text-rosewood' : 'text-amber-400'}`}>
                  {toFa(p.stock)} عدد
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-5 text-sm text-mist/60">همهٔ محصولات به اندازهٔ کافی موجودند. 🌿</p>
        )}
      </div>
    </div>
  )
}
