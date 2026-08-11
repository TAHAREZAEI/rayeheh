import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { orderApi } from '../lib/api'
import { formatPrice, formatDate, toFa } from '../lib/utils'
import PageLoader from '../components/PageLoader'

const STATUS_LABELS = {
  pending: 'در انتظار پرداخت',
  paid: 'پرداخت شده',
  processing: 'در حال آماده‌سازی',
  shipped: 'ارسال شده',
  delivered: 'تحویل شده',
  cancelled: 'لغو شده',
}

export default function Orders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState(null)

  useEffect(() => {
    if (!user) return
    orderApi.mine().then(({ data }) => setOrders(data.orders)).catch(() => setOrders([]))
  }, [user])

  if (!user)
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-mist">برای دیدن سفارش‌ها وارد شوید</h1>
        <a href="/login" className="btn-gold mt-8 inline-block">ورود به حساب</a>
      </div>
    )

  if (!orders) return <PageLoader />

  if (orders.length === 0)
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-mist">هنوز سفارشی ثبت نکرده‌اید</h1>
        <a href="/shop" className="btn-gold mt-8 inline-block">رفتن به فروشگاه</a>
      </div>
    )

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display text-4xl text-mist">سفارش‌های من</h1>
      <ul className="mt-8 space-y-4">
        {orders.map((o) => (
          <li key={o._id} className="rounded-3xl border border-mist/10 bg-ink-light/40 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-display text-lg text-mist" dir="ltr">{o.ref}</p>
                <p className="mt-1 text-xs text-mist/50">{formatDate(o.createdAt)}</p>
              </div>
              <span className="rounded-full bg-saffron/15 px-3 py-1 text-[11px] font-bold text-saffron">
                {STATUS_LABELS[o.status] || o.status}
              </span>
              <span className="font-display text-xl text-saffron">{formatPrice(o.total)}</span>
            </div>
            <ul className="mt-4 space-y-2 border-t border-mist/10 pt-4">
              {o.items.map((i) => (
                <li key={i._id} className="flex items-center justify-between text-sm">
                  <span className="text-mist/80">
                    {i.product?.name || 'محصول'} <span className="text-xs text-mist/40">× {toFa(i.qty)}</span>
                  </span>
                  <span className="text-mist/60">{formatPrice(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>
            {o.trackingCode && (
              <p className="mt-4 rounded-2xl bg-ink px-4 py-3 text-xs text-mist/60">
                کد رهگیری پست: <span dir="ltr" className="font-bold text-saffron">{o.trackingCode}</span>
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
