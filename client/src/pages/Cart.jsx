import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useSettings } from '../context/SettingsContext'
import { formatPrice, toFa } from '../lib/utils'
import BottleArt from '../components/BottleArt'
import QtyPicker from '../components/QtyPicker'

export default function Cart() {
  const { items, count, amount, setQty, removeItem } = useCart()
  const { shipping } = useSettings()

  if (items.length === 0)
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <BottleArt name="سبد خالی" className="mx-auto h-44 w-32 opacity-40" alt="" />
        <h1 className="mt-6 font-display text-3xl text-mist">سبد خرید شما خالی است</h1>
        <p className="mt-3 text-sm text-mist/60">بگذارید یک رایحه، روزتان را ماندگار کند.</p>
        <Link to="/shop" className="btn-gold mt-8">رفتن به فروشگاه</Link>
      </div>
    )

  const teheranFee = shipping?.teheranFee ?? 45000
  const cityFee = shipping?.cityFee ?? 65000
  const teheranFreeAbove = shipping?.teheranFreeAbove ?? 2_000_000
  const cityFreeAbove = shipping?.cityFreeAbove ?? 2_500_000
  const codEnabled = shipping?.codEnabled !== false

  const teheranShipping = amount >= teheranFreeAbove ? 0 : teheranFee
  const cityShipping = amount >= cityFreeAbove ? 0 : cityFee

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-display text-4xl text-mist">
        سبد خرید <span className="text-lg text-mist/50">({toFa(count)} کالا)</span>
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* اقلام */}
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item.key}
              className="flex flex-wrap items-center gap-5 rounded-3xl border border-mist/10 bg-ink-light/40 p-5"
            >
              <Link to={`/product/${item.slug || item.id}`} className="shrink-0">
                <div className="flex h-28 w-24 items-center justify-center rounded-2xl bg-paper/5">
                  <BottleArt name={item.name} className="h-24 w-20" alt={item.name} />
                </div>
              </Link>
              <div className="min-w-40 flex-1">
                <Link
                  to={`/product/${item.slug || item.id}`}
                  className="font-display text-lg text-mist transition-colors hover:text-saffron"
                >
                  {item.name}
                </Link>
                <p className="mt-1 text-xs text-mist/50">{item.edition} — {item.brand || 'رایحه'}</p>
                <p className="mt-1 text-sm font-bold text-saffron">{formatPrice(item.price)}</p>
              </div>
              <div className="flex items-center gap-4">
                <QtyPicker small value={item.qty} onChange={(q) => setQty(item.key, q)} />
                <span className="min-w-24 text-left font-extrabold text-mist">
                  {formatPrice(item.price * item.qty)}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(item.key)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-mist/15 text-mist/50 transition-colors hover:border-rosewood hover:text-rosewood"
                  aria-label={`حذف ${item.name} از سبد`}
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* خلاصه */}
        <aside className="h-fit rounded-3xl border border-saffron/20 bg-saffron/5 p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-xl text-mist">جمع سفارش</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between text-mist/70">
              <dt>جمع کالاها</dt>
              <dd className="font-bold text-mist">{formatPrice(amount)}</dd>
            </div>
            <div className="flex justify-between text-mist/70">
              <dt>ارسال تهران</dt>
              <dd className="font-bold text-mist">{teheranShipping === 0 ? 'رایگان 🎉' : formatPrice(teheranShipping)}</dd>
            </div>
            <div className="flex justify-between text-mist/70">
              <dt>ارسال شهرستان</dt>
              <dd className="font-bold text-mist">{cityShipping === 0 ? 'رایگان 🎉' : formatPrice(cityShipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-mist/10 pt-3 text-base">
              <dt className="font-bold text-mist">قابل پرداخت</dt>
              <dd className="font-display text-xl text-saffron">{formatPrice(amount)}</dd>
            </div>
          </dl>
          <p className="mt-2 text-[11px] leading-5 text-mist/50">
            هزینهٔ ارسال در صفحهٔ پرداخت، بر اساس آدرس دقیق شما محاسبه می‌شود
            {codEnabled && '؛ پرداخت در محل (فقط تهران و کرج) نیز ممکن است.'}
          </p>
          <Link to="/checkout" className="btn-gold mt-6 w-full">
            ادامهٔ فرآیند خرید
          </Link>
          <Link to="/shop" className="mt-3 block text-center text-xs text-mist/50 transition-colors hover:text-saffron">
            ← ادامهٔ خرید
          </Link>
        </aside>
      </div>
    </div>
  )
}
