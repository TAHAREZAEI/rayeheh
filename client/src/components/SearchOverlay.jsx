import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUi } from '../context/UiContext'
import { productApi } from '../lib/api'
import { toFa } from '../lib/utils'
import { useFocusTrap } from '../lib/useFocusTrap'
import BottleArt from './BottleArt'
import { formatPrice } from '../lib/utils'

export default function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useUi()
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const timer = useRef(null)
  const seqRef = useRef(0)
  const overlayRef = useFocusTrap(searchOpen, () => setSearchOpen(false))

  useEffect(() => {
    if (!searchOpen) {
      setQ('')
      setResults([])
      setSearched(false)
      return
    }
    document.body.style.overflow = 'hidden'
    inputRef.current?.focus()
    return () => {
      document.body.style.overflow = ''
    }
  }, [searchOpen])

  useEffect(() => {
    if (!searchOpen || !q.trim()) {
      setResults([])
      setSearched(false)
      return
    }
    clearTimeout(timer.current)
    setLoading(true)
    setResults([]) // پاک‌سازی نتایج قبلی تا نتیجهٔ کهنه زیر «در حال جستجو» نمایش داده نشود
    const query = q.trim()
    timer.current = setTimeout(async () => {
      const seq = ++seqRef.current
      try {
        const { data } = await productApi.list({ q: query, limit: 6 })
        if (seq !== seqRef.current || !searchOpen) return // پاسخ قدیمی/پس از بستن را نادیده بگیر
        setResults(data.products)
      } catch {
        if (seq === seqRef.current && searchOpen) setResults([])
      } finally {
        if (seq === seqRef.current && searchOpen) {
          setLoading(false)
          setSearched(true)
        }
      }
    }, 350)
    return () => clearTimeout(timer.current)
  }, [q, searchOpen])

  if (!searchOpen) return null

  const go = (slug) => {
    setSearchOpen(false)
    navigate(`/product/${slug}`)
  }
  const goShop = () => {
    setSearchOpen(false)
    navigate(q.trim() ? `/shop?q=${encodeURIComponent(q.trim())}` : '/shop')
  }

  return (
    <div ref={overlayRef} tabIndex={-1} className="fixed inset-0 z-50 outline-none" role="dialog" aria-modal="true" aria-label="جستجو">
      <div className="absolute inset-0 bg-ink/95 backdrop-blur-md animate-fade-in" onClick={() => setSearchOpen(false)} />
      <div className="relative mx-auto mt-24 w-full max-w-2xl px-4 animate-fade-up">
        <div className="flex items-center gap-3 border-b-2 border-saffron/40 pb-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C8A24B" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && goShop()}
            placeholder="جستجوی عطر… نام، برند، خانوادهٔ بویایی"
            className="w-full bg-transparent font-display text-2xl text-mist placeholder-mist/25 focus:outline-none"
            aria-label="عبارت جستجو"
          />
          <button
            type="button"
            onClick={() => setSearchOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-mist/15 text-mist transition-colors hover:border-saffron hover:text-saffron"
            aria-label="بستن جستجو"
          >
            ✕
          </button>
        </div>

        {/* نتایج */}
        <div className="mt-6 max-h-[50vh] overflow-y-auto">
          {loading && <p className="py-8 text-center text-sm text-mist/60">در حال جستجو…</p>}
          {!loading && searched && results.length === 0 && (
            <p className="py-8 text-center text-sm text-mist/70">
              چیزی برای «{q}» پیدا نشد؛ جملهٔ دیگری را امتحان کنید.
            </p>
          )}
          <ul className="space-y-2">
            {results.map((p) => (
              <li key={p._id}>
                <button
                  type="button"
                  onClick={() => go(p.slug)}
                  className="flex w-full items-center gap-4 rounded-2xl border border-mist/10 bg-ink-light/60 p-3 text-right transition-colors hover:border-saffron/50"
                >
                  <span className="flex h-14 w-12 shrink-0 items-center justify-center rounded-xl bg-paper/10">
                    <BottleArt name={p.name} className="h-12 w-10" alt="" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-bold text-mist">{p.name}</span>
                    <span className="mt-0.5 block text-xs text-mist/70">
                      {p.brand} · {p.edition} · {toFa(p.weight)} میلی‌لیتر
                    </span>
                  </span>
                  <span className="text-sm font-bold text-saffron">{formatPrice(p.price)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {q.trim() && !loading && (
          <button
            type="button"
            onClick={goShop}
            className="mt-5 w-full rounded-full border border-saffron/40 py-3 text-sm font-medium text-saffron transition-colors hover:bg-saffron hover:text-ink"
          >
            مشاهدهٔ همهٔ نتایج در فروشگاه ←
          </button>
        )}
      </div>
    </div>
  )
}
