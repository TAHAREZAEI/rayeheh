import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { productApi, extractMessage } from '../lib/api'
import { formatPrice, formatWeight, toFa } from '../lib/utils'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import BottleArt from '../components/BottleArt'
import Price from '../components/Price'
import Rating from '../components/Rating'
import QtyPicker from '../components/QtyPicker'
import ProductCard from '../components/ProductCard'
import PageLoader from '../components/PageLoader'

const FAMILY_META = {
  گلی: '🌹 گل‌های بهاری و عاشقانه',
  میوه‌ای: '🍑 میوه‌های شیرین و شاد',
  چوبی: '🪵 چوب‌های گرم و نجیب',
  شرقی: '✨ ادویه، عود و افسون',
  مرکباتی: '🍋 ترنجِ تازه و پرانرژی',
  خنک: '💧 طراوتِ خنکِ دریا',
}

function StarsPicker({ value, onChange }) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="امتیاز شما">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          onClick={() => onChange(n)}
          className={`text-2xl transition-transform hover:scale-125 ${
            n <= value ? 'text-ink' : 'text-soil/30'
          }`}
          aria-label={`${toFa(n)} ستاره`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

function Reviews({ productId, initial }) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState(initial || [])
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (!rating) {
      setError('لطفاً یک امتیاز انتخاب کنید.')
      return
    }
    if (comment.trim().length < 3) {
      setError('نظرتان کمی کوتاه است؛ دست‌کم چند کلمه بنویسید.')
      return
    }
    setSending(true)
    setError('')
    try {
      const { data } = await productApi.review(productId, { rating, comment })
      setReviews([data.review, ...reviews])
      setRating(0)
      setComment('')
    } catch (err) {
      setError(extractMessage(err))
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      {/* فرم نظر */}
      <form onSubmit={submit} className="mb-8 rounded-3xl border border-soil/10 bg-white/50 p-6">
        <h3 className="font-display text-lg text-ink">نظر شما برای دیگران ارزشمند است</h3>
        <p className="mt-1 text-xs text-soil/60">
          {user ? 'تجربهٔ این رایحه را با ما به اشتراک بگذارید.' : 'برای ثبت نظر، ابتدا وارد حساب کاربری شوید.'}
        </p>
        {user ? (
          <>
            <div className="mt-4">
              <span className="mb-2 block text-xs font-bold text-soil/70">امتیاز شما</span>
              <StarsPicker value={rating} onChange={setRating} />
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="رایحه چطور بود؟ ماندگاری، پخش بو، مناسب چه موقعیتی…"
              className="field mt-4"
            />
            {error && <p className="mt-2 text-xs text-rosewood">{error}</p>}
            <button type="submit" disabled={sending} className="btn-dark mt-4">
              {sending ? 'در حال ثبت…' : 'ثبت نظر'}
            </button>
          </>
        ) : (
          <Link to="/login" className="btn-dark mt-4">
            ورود به حساب
          </Link>
        )}
      </form>

      {/* لیست نظرات */}
      {reviews.length === 0 ? (
        <p className="py-8 text-center text-sm text-soil/50">هنوز نظری ثبت نشده؛ اولین نفر باشید.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li key={r._id} className="rounded-2xl border border-soil/10 bg-white/40 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-saffron/20 font-display text-sm text-ink">
                    {r.user?.name?.[0] || 'ک'}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink">{r.user?.name || 'کاربر رایحه'}</p>
                    <Rating value={r.rating} size="text-xs" />
                  </div>
                </div>
                <span className="text-[11px] text-soil-light">
                  {new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(r.createdAt))}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-soil/80">{r.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function ProductDetail() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [related, setRelated] = useState([])
  const [qty, setQty] = useState(1)
  const { addItem } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    setProduct(null)
    setNotFound(false)
    productApi
      .slug(slug)
      .then(({ data }) => {
        setProduct(data.product)
        setRelated(data.related || [])
      })
      .catch(() => setNotFound(true))
  }, [slug])

  const familyMeta = useMemo(
    () => (product ? FAMILY_META[product.family] || null : null),
    [product]
  )

  if (notFound)
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-mist">این عطر را پیدا نکردیم</h1>
        <p className="mt-3 text-sm text-mist/60">شاید رایحهٔ مورد نظر دیگر در فروشگاه نباشد.</p>
        <Link to="/shop" className="btn-gold mt-8">بازگشت به فروشگاه</Link>
      </div>
    )

  if (!product) return <PageLoader />

  const handleAdd = () =>
    addItem({
      id: product._id,
      key: product._id,
      name: product.name,
      edition: product.edition,
      price: product.price,
      slug: product.slug,
      qty,
    })

  const handleBuyNow = () => {
    addItem({ id: product._id, key: product._id, name: product.name, edition: product.edition, price: product.price, slug: product.slug, qty }, { silent: true })
    navigate('/checkout')
  }

  const notes = product.notes || {}

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      {/* مسیر */}
      <nav className="mb-8 flex items-center gap-2 text-xs text-mist/50" aria-label="مسیر">
        <Link to="/" className="transition-colors hover:text-saffron">خانه</Link>
        <span aria-hidden="true">/</span>
        <Link to="/shop" className="transition-colors hover:text-saffron">فروشگاه</Link>
        <span aria-hidden="true">/</span>
        <span className="text-mist/80">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* بطری */}
        <div className="relative flex items-center justify-center rounded-[2.5rem] border border-mist/10 bg-paper/5 p-10">
          <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] bg-grain opacity-30" aria-hidden="true" />
          <div className="pointer-events-none absolute top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-saffron/10 blur-[100px]" aria-hidden="true" />
          <div className="relative animate-fade-up">
            <BottleArt name={product.name} className="h-[440px] w-[320px] drop-shadow-2xl" alt={product.name} />
          </div>
          {product.isNew && (
            <span className="absolute right-6 top-6 rounded-full bg-saffron px-4 py-1.5 text-xs font-bold text-ink">
              جدید
            </span>
          )}
        </div>

        {/* اطلاعات */}
        <div className="animate-fade-up">
          <span className="text-xs font-medium tracking-widest2 text-saffron">{product.brand}</span>
          <h1 className="mt-2 font-display text-4xl leading-snug text-mist lg:text-5xl">{product.name}</h1>
          <p className="mt-2 text-sm text-mist/50">{product.edition} · {formatWeight(product.weight)}</p>

          {product.ratingCount > 0 && (
            <div className="mt-3">
              <Rating value={product.rating} count={product.ratingCount} />
            </div>
          )}

          <p className="mt-6 text-base leading-8 text-mist/80">{product.description}</p>

          {/* ویژگی‌های کلیدی */}
          <div className="mt-6 flex flex-wrap gap-2">
            {product.badge && (
              <span className="rounded-full bg-rosewood/15 px-4 py-1.5 text-xs font-bold text-rosewood">{product.badge}</span>
            )}
            <span className="rounded-full border border-mist/15 px-4 py-1.5 text-xs text-mist/80">
              {familyMeta ? `${product.family} — ${familyMeta.split(' ').slice(1).join(' ')}` : product.family}
            </span>
            <span className="rounded-full border border-mist/15 px-4 py-1.5 text-xs text-mist/80">ماندگاری: {toFa(product.longevity || 4)} از ۵</span>
            <span className="rounded-full border border-mist/15 px-4 py-1.5 text-xs text-mist/80">پخش بو: {toFa(product.sillage || 4)} از ۵</span>
          </div>

          {/* نت‌های بویایی */}
          {notes.top && (
            <div className="mt-8 grid gap-4 rounded-3xl border border-mist/10 bg-ink-light/50 p-6 sm:grid-cols-3">
              {[
                { t: 'نت آغازین', list: notes.top },
                { t: 'نت میانی', list: notes.heart },
                { t: 'نت پایانی', list: notes.base },
              ].map((n) => (
                <div key={n.t} className="text-center">
                  <p className="text-[11px] font-bold tracking-widest text-saffron">{n.t}</p>
                  <p className="mt-2 text-sm leading-6 text-mist/80">{n.list}</p>
                </div>
              ))}
            </div>
          )}

          {/* خرید */}
          <div className="mt-8 rounded-3xl border border-saffron/20 bg-saffron/5 p-6">
            <Price price={product.price} oldPrice={product.oldPrice} size="lg" />
            <p className="mt-1 text-xs text-mist/50">
              در انبار موجود است — ارسال امروز تهران، {toFa(48)} ساعته شهرستان
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <QtyPicker value={qty} onChange={setQty} />
              <button type="button" onClick={handleAdd} className="btn-gold flex-1 sm:flex-none">
                افزودن به سبد
              </button>
              <button type="button" onClick={handleBuyNow} className="btn-outline flex-1 sm:flex-none">
                خرید فوری
              </button>
            </div>
          </div>

          {/* اعتماد */}
          <ul className="mt-8 grid gap-3 text-xs text-mist/60 sm:grid-cols-3">
            <li className="flex items-center gap-2"><span className="text-saffron">✓</span> ضمانت اصالت کالا</li>
            <li className="flex items-center gap-2"><span className="text-saffron">✓</span> بازگشت ۷ روزه</li>
            <li className="flex items-center gap-2"><span className="text-saffron">✓</span> بسته‌بندی هدیه</li>
          </ul>
        </div>
      </div>

      {/* نظرات */}
      <section className="mt-20">
        <div className="rounded-[2.5rem] bg-paper p-6 sm:p-10">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-2xl text-ink">دیدگاه‌ها دربارهٔ {product.name}</h2>
            {product.ratingCount > 0 && (
              <div className="flex items-center gap-2">
                <span className="font-display text-4xl text-ink">{toFa(product.rating.toFixed(1))}</span>
                <Rating value={product.rating} light />
                <span className="text-xs text-soil-light">از {toFa(product.ratingCount)} دیدگاه</span>
              </div>
            )}
          </div>
          <Reviews productId={product._id} initial={product.reviews} />
        </div>
      </section>

      {/* محصولات مرتبط */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl text-mist">عطرهایی که ممکن است بپسندید</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
