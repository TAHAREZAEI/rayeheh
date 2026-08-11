import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BottleArt from './BottleArt'
import QtyPicker from './QtyPicker'
import { useCart } from '../context/CartContext'
import { useUi } from '../context/UiContext'
import { useSettings } from '../context/SettingsContext'
import { useFocusTrap } from '../lib/useFocusTrap'
import { formatPrice, toFa } from '../lib/utils'

export default function CartDrawer() {
  const { cartOpen, setCartOpen } = useUi()
  const { items, amount, count, setQty, removeItem } = useCart()
  const { shipping } = useSettings()
  const navigate = useNavigate()
  const drawerRef = useFocusTrap(cartOpen, () => setCartOpen(false))

  // قفل اسکرول صفحه هنگام باز بودن
  useEffect(() => {
    if (!cartOpen) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [cartOpen])

  if (!cartOpen) return null

  const freeAbove = shipping?.teheranFreeAbove || 2_000_000
  const remaining = Math.max(0, freeAbove - amount)
  const progress = Math.min(100, (amount / freeAbove) * 100)

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="سبد خرید">
      {/* پشت‌زمینه */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={() => setCartOpen(false)}
      />
      {/* کشو */}
      <aside
        ref={drawerRef}
        tabIndex={-1}
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-paper shadow-2xl animate-fade-in outline-none"
        style={{ animationName: 'slide-in-start' }}
      >
        <style>{`@keyframes slide-in-start { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>

        {/* سربرگ */}
        <div className="flex items-center justify-between border-b border-soil/10 px-6 py-4">
          <h2 className="font-display text-xl text-ink">
            سبد خرید <span className="mr-1 text-sm text-soil/50">({toFa(count)} کالا)</span>
          </h2>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-soil/15 text-soil transition-colors hover:border-rosewood hover:text-rosewood"
            aria-label="بستن سبد"
          >
            ✕
          </button>
        </div>

        {/* نوار پیشرفت ارسال رایگان */}
        <div className="border-b border-soil/10 px-6 py-3 text-xs text-soil/70">
          {remaining > 0 ? (
            <p>
              با خرید <strong className="text-rosewood">{formatPrice(remaining)}</strong> دیگر، ارسال رایگان می‌شود!
            </p>
          ) : (
            <p className="font-bold text-rosewood">🎉 ارسال شما رایگان شد!</p>
          )}
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-soil/10">
            <div
              className="h-full rounded-full bg-saffron transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* اقلام */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <BottleArt name="سبد خالی" className="h-36 w-28 opacity-40" alt="" />
              <p className="font-display text-lg text-soil">سبدتان هنوز خالی است</p>
              <p className="text-sm text-soil/60">رایحهٔ مناسب شما منتظر است…</p>
              <Link
                to="/shop"
                onClick={() => setCartOpen(false)}
                className="btn-dark mt-2"
              >
                رفتن به فروشگاه
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.key} className="flex gap-4 rounded-2xl border border-soil/10 bg-white/50 p-3">
                  <Link
                    to={`/product/${item.slug || item.id}`}
                    onClick={() => setCartOpen(false)}
                    className="shrink-0"
                  >
                    <div className="flex h-24 w-20 items-center justify-center rounded-xl bg-paper-dark/70">
                      <BottleArt name={item.name} className="h-20 w-16" alt={item.name} />
                    </div>
                  </Link>
                  <div className="flex flex-1 flex-col justify-between py-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          to={`/product/${item.slug || item.id}`}
                          onClick={() => setCartOpen(false)}
                          className="font-display text-sm text-soil hover:text-rosewood"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-0.5 text-[11px] text-soil/50">{item.edition}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-soil/60 transition-colors hover:text-rosewood"
                        aria-label={`حذف ${item.name}`}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m3 0-1 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 7" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <QtyPicker small value={item.qty} onChange={(q) => setQty(item.key, q)} />
                      <span className="text-sm font-extrabold text-ink">
                        {formatPrice(item.price * item.qty)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* پابرگ */}
        {items.length > 0 && (
          <div className="border-t border-soil/10 px-6 py-5">
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="text-soil/60">جمع کل</span>
              <span className="font-display text-xl text-ink">{formatPrice(amount)}</span>
            </div>
            <button
              type="button"
              className="btn-gold w-full"
              onClick={() => {
                setCartOpen(false)
                navigate('/checkout')
              }}
            >
              ثبت سفارش
            </button>
            <Link
              to="/shop"
              onClick={() => setCartOpen(false)}
              className="mt-3 block text-center text-xs text-soil/50 transition-colors hover:text-soil"
            >
              ادامهٔ خرید
            </Link>
          </div>
        )}
      </aside>
    </div>
  )
}
