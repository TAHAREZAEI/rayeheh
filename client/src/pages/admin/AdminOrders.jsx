import { useEffect, useState } from 'react'
import { adminApi, extractMessage } from '../../lib/api'
import { formatPrice, formatDate, toFa } from '../../lib/utils'
import Spinner from '../../components/Spinner'
import { toast } from 'react-hot-toast'

const STATUSES = [
  { value: 'pending', label: 'در انتظار پرداخت', color: 'bg-amber-500/15 text-amber-400' },
  { value: 'paid', label: 'پرداخت شده', color: 'bg-sky-500/15 text-sky-400' },
  { value: 'processing', label: 'در حال آماده‌سازی', color: 'bg-saffron/15 text-saffron' },
  { value: 'shipped', label: 'ارسال شده', color: 'bg-violet-500/15 text-violet-400' },
  { value: 'delivered', label: 'تحویل شده', color: 'bg-emerald-500/15 text-emerald-400' },
  { value: 'cancelled', label: 'لغو شده', color: 'bg-rosewood/15 text-rosewood' },
]

const PAYMENT_LABELS = {
  online: 'آنلاین',
  cod: 'پرداخت در محل',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState(null)
  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [expanded, setExpanded] = useState(null)

  const load = () => {
    setOrders(null)
    adminApi
      .orders({ status: filter, page, limit: 10 })
      .then(({ data }) => {
        setOrders(data.orders)
        setPages(data.pages)
      })
      .catch(() => setOrders([]))
  }

  useEffect(load, [filter, page])

  const updateStatus = async (id, status, e) => {
    e.stopPropagation()
    try {
      await adminApi.updateOrder(id, { status })
      toast.success('وضعیت سفارش به‌روزرسانی شد')
      load()
    } catch (err) {
      toast.error(extractMessage(err))
    }
  }

  return (
    <div>
      <h2 className="font-display text-2xl text-mist">سفارش‌ها</h2>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => { setFilter(''); setPage(1) }}
          className={`rounded-full px-4 py-2 text-xs transition-colors ${!filter ? 'bg-saffron font-bold text-ink' : 'border border-mist/15 text-mist/70 hover:text-saffron'}`}
        >
          همه
        </button>
        {STATUSES.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => { setFilter(s.value); setPage(1) }}
            className={`rounded-full px-4 py-2 text-xs transition-colors ${filter === s.value ? 'bg-saffron font-bold text-ink' : 'border border-mist/15 text-mist/70 hover:text-saffron'}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {!orders ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : orders.length === 0 ? (
          <p className="py-16 text-center text-sm text-mist/60">سفارشی با این وضعیت نیست.</p>
        ) : (
          orders.map((o) => (
            <div key={o._id} className="rounded-3xl border border-mist/10 bg-ink-light/40">
              {/* ردیف اصلی */}
              <button
                type="button"
                onClick={() => setExpanded(expanded === o._id ? null : o._id)}
                className="flex w-full flex-wrap items-center justify-between gap-4 p-6 text-right"
                aria-expanded={expanded === o._id}
              >
                <div className="flex items-center gap-4">
                  <span className="font-display text-lg text-mist" dir="ltr">{o.ref}</span>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${STATUSES.find((s) => s.value === o.status)?.color || 'bg-mist/10 text-mist/60'}`}>
                    {STATUSES.find((s) => s.value === o.status)?.label || o.status}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <span className="text-mist/60">{o.customer?.fullName}</span>
                  <span className="text-mist/60">{formatDate(o.createdAt)}</span>
                  <span className="font-display text-lg text-saffron">{formatPrice(o.total)}</span>
                </div>
              </button>

              {/* جزئیات */}
              {expanded === o._id && (
                <div className="border-t border-mist/10 p-6">
                  <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
                    <div>
                      <h4 className="mb-3 text-xs font-bold tracking-widest text-mist/50">اقلام سفارش</h4>
                      <ul className="space-y-2 text-sm">
                        {o.items.map((i) => (
                          <li key={i._id} className="flex justify-between text-mist/80">
                            <span>{i.product?.name || 'محصول'} <span className="text-xs text-mist/60">× {toFa(i.qty)}</span></span>
                            <span>{formatPrice(i.price * i.qty)}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 space-y-1.5 border-t border-mist/10 pt-4 text-sm">
                        <div className="flex justify-between text-mist/60">
                          <span>ارسال</span>
                          <span>{o.shippingFee === 0 ? 'رایگان' : formatPrice(o.shippingFee)}</span>
                        </div>
                        <div className="flex justify-between text-mist/60">
                          <span>روش پرداخت</span>
                          <span>{PAYMENT_LABELS[o.paymentMethod] || o.paymentMethod}</span>
                        </div>
                        {o.trackingCode && (
                          <div className="flex justify-between text-mist/60">
                            <span>کد رهگیری</span>
                            <span dir="ltr" className="font-bold text-saffron">{o.trackingCode}</span>
                          </div>
                        )}
                        {o.note && (
                          <p className="mt-2 rounded-2xl bg-ink px-4 py-3 text-xs leading-6 text-mist/70">
                            📝 {o.note}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-3 text-xs font-bold tracking-widest text-mist/50">گیرنده</h4>
                      <div className="rounded-2xl bg-ink p-4 text-xs leading-6 text-mist/70">
                        <p className="font-bold text-mist">{o.customer?.fullName}</p>
                        <p dir="ltr" className="text-right">{o.customer?.phone}</p>
                        <p className="mt-2">{o.customer?.province}، {o.customer?.city}، {o.customer?.address}</p>
                        <p dir="ltr" className="text-right">کد پستی: {o.customer?.postalCode}</p>
                      </div>

                      <h4 className="mb-3 mt-6 text-xs font-bold tracking-widest text-mist/50">تغییر وضعیت</h4>
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o._id, e.target.value, { stopPropagation: () => {} })}
                        className="field-dark cursor-pointer text-xs"
                      >
                        {STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {pages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i + 1)}
              className={`h-9 w-9 rounded-full text-sm ${page === i + 1 ? 'bg-saffron font-bold text-ink' : 'border border-mist/15 text-mist/70'}`}
            >
              {toFa(i + 1)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
