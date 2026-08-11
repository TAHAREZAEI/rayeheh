import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { orderApi } from '../lib/api'
import { formatPrice, formatDate, toFa } from '../lib/utils'
import Seal from '../components/Seal'
import PageLoader from '../components/PageLoader'

const STATUS_LABELS = {
  pending: 'در انتظار پرداخت',
  paid: 'پرداخت شده',
  processing: 'در حال آماده‌سازی',
  shipped: 'ارسال شده',
  delivered: 'تحویل شده',
  cancelled: 'لغو شده',
}

export default function OrderSuccess() {
  const { ref } = useParams()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    orderApi
      .id(ref)
      .then(({ data }) => setOrder(data.order))
      .catch(() => setError(true))
  }, [ref])

  if (error)
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-mist">سفارش پیدا نشد</h1>
        <Link to="/" className="btn-gold mt-8">بازگشت به خانه</Link>
      </div>
    )

  if (!order) return <PageLoader />

  const isCod = order.paymentMethod === 'cod'

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <Seal size="lg" className="mx-auto" />
      <h1 className="mt-8 font-display text-4xl text-mist">
        {isCod ? 'سفارش شما ثبت شد!' : 'پرداخت شما با موفقیت انجام شد!'}
      </h1>
      <p className="mx-auto mt-4 max-w-lg text-sm leading-8 text-mist/70">
        {isCod
          ? `سفارش با کد پیگیری ${toFa(order.ref)} ثبت شد. مبلغ ${formatPrice(order.total)} هنگام تحویل دریافت می‌شود.`
          : `سفارش با کد پیگیری ${toFa(order.ref)} و مبلغ ${formatPrice(order.total)} ثبت شد. جزئیات برایتان پیامک می‌شود.`}
      </p>

      {/* خلاصهٔ سفارش */}
      <div className="mt-10 rounded-3xl border border-mist/10 bg-ink-light/40 p-6 text-right sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-mist/10 pb-5">
          <div>
            <p className="text-xs text-mist/50">کد پیگیری</p>
            <p className="font-display text-xl text-saffron" dir="ltr">{order.ref}</p>
          </div>
          <div>
            <p className="text-xs text-mist/50">تاریخ ثبت</p>
            <p className="text-sm font-bold text-mist">{formatDate(order.createdAt)}</p>
          </div>
          <div>
            <p className="text-xs text-mist/50">وضعیت</p>
            <p className="text-sm font-bold text-saffron">{STATUS_LABELS[order.status]}</p>
          </div>
        </div>

        <ul className="mt-5 space-y-3">
          {order.items.map((i) => (
            <li key={i._id} className="flex items-center justify-between gap-3 text-sm">
              <span className="font-bold text-mist">
                {i.product?.name || 'محصول'}
                <span className="mr-2 text-xs font-normal text-mist/50">× {toFa(i.qty)}</span>
              </span>
              <span className="text-mist/80">{formatPrice(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex justify-between border-t border-mist/10 pt-4">
          <span className="text-sm text-mist/60">هزینهٔ ارسال</span>
          <span className="text-sm text-mist/80">{order.shippingFee === 0 ? 'رایگان' : formatPrice(order.shippingFee)}</span>
        </div>
        <div className="mt-2 flex justify-between">
          <span className="font-bold text-mist">مبلغ نهایی</span>
          <span className="font-display text-xl text-saffron">{formatPrice(order.total)}</span>
        </div>

        <div className="mt-6 rounded-2xl bg-ink p-5 text-sm leading-7 text-mist/70">
          <p className="font-bold text-mist">آدرس تحویل</p>
          <p className="mt-1">
            {order.customer.fullName} — {order.customer.province}، {order.customer.city}، {order.customer.address}
          </p>
          <p dir="ltr" className="mt-1 text-right">{order.customer.phone}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link to="/shop" className="btn-gold">ادامهٔ خرید</Link>
        <Link to="/orders" className="btn-outline">پیگیری سفارش‌های من</Link>
      </div>
    </div>
  )
}
