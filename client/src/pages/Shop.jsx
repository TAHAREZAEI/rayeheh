import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { productApi, categoryApi } from '../lib/api'
import { toFa } from '../lib/utils'
import { useFocusTrap } from '../lib/useFocusTrap'
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard'
import EmptyState from '../components/EmptyState'

const FAMILY_OPTIONS = ['گلی', 'میوه‌ای', 'چوبی', 'شرقی', 'مرکباتی', 'خنک']
const EDITION_OPTIONS = ['ادوپرفیوم', 'ادوتویلت', 'ادکلن']
const PRICE_RANGES = [
  { label: 'زیر ۱ میلیون', min: 0, max: 1_000_000 },
  { label: '۱ تا ۳ میلیون', min: 1_000_000, max: 3_000_000 },
  { label: '۳ تا ۶ میلیون', min: 3_000_000, max: 6_000_000 },
  { label: 'بالای ۶ میلیون', min: 6_000_000, max: Infinity },
]

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const [products, setProducts] = useState(null)
  const [categories, setCategories] = useState([])
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const timer = useRef(null)
  const mobRef = useFocusTrap(sidebarOpen, () => setSidebarOpen(false))

  const q = params.get('q') || ''
  const cat = params.get('cat') || ''
  const sort = params.get('sort') || '-sold'
  const family = params.get('family') || ''
  const edition = params.get('edition') || ''
  const price = params.get('price') || ''
  const page = Number(params.get('page') || '1')

  useEffect(() => {
    categoryApi.list().then(({ data }) => setCategories(data.categories)).catch(() => {})
  }, [])

  // جستجو با debounce برای جلوگیری از درخواست‌های اضافی
  useEffect(() => {
    setProducts(null)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      productApi
        .list({ q, cat, family, edition, price, sort, page, limit: 12 })
        .then(({ data }) => {
          setProducts(data.products)
          setPagination({ total: data.total, page: data.page, pages: data.pages })
        })
        .catch(() => setProducts([]))
    }, 250)
    return () => clearTimeout(timer.current)
  }, [q, cat, family, edition, price, sort, page])

  const setParam = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete('page')
    setParams(next, { replace: true })
  }

  // شناسهٔ یکتا برای ورودی جستجو در هر نسخهٔ فیلتر (دسکتاپ/موبایل)
  const [qId, setQId] = useState('q')
  useEffect(() => {
    setQId(sidebarOpen ? 'q-mobile' : 'q')
  }, [sidebarOpen])

  const clearFilters = () => setParams({}, { replace: true })

  const activeCount = useMemo(
    () => [cat, family, edition, price, q].filter(Boolean).length,
    [cat, family, edition, price, q]
  )

  const FilterPanel = (
    <div className="space-y-7">
      {/* جستجو */}
      <div>
        <label htmlFor={qId} className="mb-2 block text-xs font-bold tracking-widest text-mist/60">
          جستجو
        </label>
        <input
          id={qId}
          type="search"
          value={q}
          onChange={(e) => setParam('q', e.target.value)}
          placeholder="نام عطر یا برند…"
          className="field-dark"
        />
      </div>

      {/* دسته‌بندی */}
      <div>
        <h3 className="mb-3 text-xs font-bold tracking-widest text-mist/60">دسته‌بندی</h3>
        <ul className="space-y-1">
          <li>
            <button
              type="button"
              onClick={() => setParam('cat', '')}
              className={`w-full rounded-xl px-3 py-2 text-right text-sm transition-colors ${
                !cat ? 'bg-saffron/15 font-bold text-saffron' : 'text-mist/70 hover:bg-mist/5'
              }`}
            >
              همه
            </button>
          </li>
          {categories.map((c) => (
            <li key={c._id}>
              <button
                type="button"
                onClick={() => setParam('cat', c.slug)}
                className={`w-full rounded-xl px-3 py-2 text-right text-sm transition-colors ${
                  cat === c.slug ? 'bg-saffron/15 font-bold text-saffron' : 'text-mist/70 hover:bg-mist/5'
                }`}
              >
                {c.name}
                <span className="mr-2 text-xs text-mist/40">({toFa(c.productCount || 0)})</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* خانوادهٔ بویایی */}
      <div>
        <h3 className="mb-3 text-xs font-bold tracking-widest text-mist/60">خانوادهٔ بویایی</h3>
        <div className="flex flex-wrap gap-2">
          {FAMILY_OPTIONS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setParam('family', family === f ? '' : f)}
              className={`rounded-full px-3.5 py-1.5 text-xs transition-all ${
                family === f
                  ? 'bg-saffron font-bold text-ink'
                  : 'border border-mist/15 text-mist/70 hover:border-saffron/50 hover:text-saffron'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* نوع عطر */}
      <div>
        <h3 className="mb-3 text-xs font-bold tracking-widest text-mist/60">نوع عطر</h3>
        <div className="space-y-1">
          {EDITION_OPTIONS.map((e) => (
            <label key={e} className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm text-mist/80 transition-colors hover:bg-mist/5">
              <input
                type="radio"
                name="edition"
                checked={edition === e}
                onClick={() => { if (edition === e) setParam('edition', '') }}
                onChange={() => setParam('edition', e)}
                className="h-4 w-4 rounded-full border-mist/30 bg-transparent text-saffron focus:ring-saffron/40"
              />
              {e}
            </label>
          ))}
        </div>
      </div>

      {/* بازهٔ قیمت */}
      <div>
        <h3 className="mb-3 text-xs font-bold tracking-widest text-mist/60">بازهٔ قیمت</h3>
        <div className="space-y-1">
          {PRICE_RANGES.map((r) => {
            const val = Number.isFinite(r.max) ? `${r.min}-${r.max}` : `${r.min}-`
            return (
              <label key={r.label} className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm text-mist/80 transition-colors hover:bg-mist/5">
                <input
                  type="radio"
                  name="price"
                  checked={price === val}
                  onClick={() => { if (price === val) setParam('price', '') }}
                  onChange={() => setParam('price', val)}
                  className="h-4 w-4 rounded-full border-mist/30 bg-transparent text-saffron focus:ring-saffron/40"
                />
                {r.label}
              </label>
            )
          })}
        </div>
      </div>

      {activeCount > 0 && (
        <button
          type="button"
          onClick={clearFilters}
          className="w-full rounded-full border border-rosewood/40 py-2.5 text-xs font-medium text-rosewood transition-colors hover:bg-rosewood/10"
        >
          حذف همهٔ فیلترها ({toFa(activeCount)})
        </button>
      )}
    </div>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      {/* سربرگ */}
      <div className="mb-8">
        <h1 className="font-display text-4xl text-mist">فروشگاه عطر</h1>
        <p className="mt-2 text-sm text-mist/60">
          {q && <>نتایج جستجو برای «{q}» — </>}
          <span>{toFa(pagination.total)} عطر یافت شد</span>
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* فیلترها — دسکتاپ */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-3xl border border-mist/10 bg-ink-light/40 p-6">{FilterPanel}</div>
        </aside>

        {/* فیلترها — موبایل */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="فیلترها">
            <div className="absolute inset-0 bg-black/60 animate-fade-in" onClick={() => setSidebarOpen(false)} />
            <aside ref={mobRef} tabIndex={-1} className="absolute inset-y-0 right-0 w-80 max-w-[85%] overflow-y-auto bg-ink-light p-6 shadow-2xl animate-fade-in outline-none">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-display text-lg text-mist">فیلترها</h2>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-mist/15 text-mist"
                  aria-label="بستن فیلترها"
                >
                  ✕
                </button>
              </div>
              {FilterPanel}
              <button type="button" className="btn-gold mt-6 w-full" onClick={() => setSidebarOpen(false)}>
                اعمال فیلترها
              </button>
            </aside>
          </div>
        )}

        {/* لیست محصولات */}
        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-mist/15 px-4 py-2 text-xs text-mist/80 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              فیلترها {activeCount > 0 && <span className="rounded-full bg-saffron px-1.5 text-[10px] font-bold text-ink">{toFa(activeCount)}</span>}
            </button>

            <select
              value={sort}
              onChange={(e) => setParam('sort', e.target.value)}
              className="field-dark w-auto cursor-pointer rounded-full px-4 py-2 text-xs"
              aria-label="مرتب‌سازی"
            >
              <option value="-sold">پرفروش‌ترین</option>
              <option value="-rating">بالاترین امتیاز</option>
              <option value="price">ارزان‌ترین</option>
              <option value="-price">گران‌ترین</option>
              <option value="-createdAt">جدیدترین</option>
            </select>
          </div>

          {!products ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              icon="🫧"
              title="عطری با این مشخصات پیدا نشد"
              text="فیلترها را تغییر دهید یا همهٔ عطرهای ما را ببینید؛ شاید رایحهٔ بعدی‌تان همین‌جا منتظر باشد."
              action="مشاهدهٔ همهٔ عطرها"
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>

              {/* صفحه‌بندی */}
              {pagination.pages > 1 && (
                <nav className="mt-12 flex flex-wrap items-center justify-center gap-2" aria-label="صفحه‌بندی">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setParam('page', String(page - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-mist/15 text-mist transition-colors hover:border-saffron hover:text-saffron disabled:opacity-30"
                    aria-label="صفحهٔ قبل"
                  >
                    →
                  </button>
                  {Array.from({ length: pagination.pages }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setParam('page', String(i + 1))}
                      className={`h-10 w-10 rounded-full text-sm transition-colors ${
                        page === i + 1
                          ? 'bg-saffron font-bold text-ink'
                          : 'border border-mist/15 text-mist/70 hover:border-saffron hover:text-saffron'
                      }`}
                      aria-current={page === i + 1 ? 'page' : undefined}
                    >
                      {toFa(i + 1)}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={page >= pagination.pages}
                    onClick={() => setParam('page', String(page + 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-mist/15 text-mist transition-colors hover:border-saffron hover:text-saffron disabled:opacity-30"
                    aria-label="صفحهٔ بعد"
                  >
                    ←
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
