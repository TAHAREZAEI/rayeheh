import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { productApi, categoryApi } from '../lib/api'
import { toFa } from '../lib/utils'
import { FEATURES, STEPS, TESTIMONIALS, STATS, BLOG } from '../data/static'
import BottleArt from '../components/BottleArt'
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard'
import SectionHeading from '../components/SectionHeading'
import Seal from '../components/Seal'
import { useCart } from '../context/CartContext'

const PERFUME_COLLAGES = [
  {
    name: 'گل محمدی',
    desc: 'رز قمصر، یاس، گل‌بنفشه',
    emoji: '🌹',
  },
  {
    name: 'عود و عنبر',
    desc: 'چوب عود، صندل، عنبر',
    emoji: '🪵',
  },
  {
    name: 'مرکبات و شمیم',
    desc: 'برگاموت، لیمو، ترنج',
    emoji: '🍋',
  },
]

function Hero() {
  const { addItem } = useCart()
  const featured = {
    name: 'رایحهٔ ناب شب',
    brand: 'رایحه — نسخهٔ محدود',
    edition: 'ادوپرفیوم',
    price: 2_850_000,
    oldPrice: 3_400_000,
    _id: 'hero-1',
    slug: 'rayeheh-nab-e-shab',
    qty: 1,
  }

  const handleAdd = () => {
    addItem({ ...featured, key: featured._id, img: undefined })
  }

  return (
    <section className="relative overflow-hidden">
      {/* هاله‌های نور */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-saffron/10 blur-[130px]" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-0 right-[-120px] h-72 w-72 rounded-full bg-rosewood/15 blur-[100px]" aria-hidden="true" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-10 lg:grid-cols-2 lg:gap-6 lg:pb-24 lg:pt-16">
        {/* متن */}
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-saffron/30 bg-saffron/5 px-4 py-1.5 text-xs font-medium text-saffron-light">
            ✨ نسخهٔ محدود — رایحهٔ ناب شب
          </span>
          <h1 className="mt-6 font-display text-5xl leading-[1.25] text-mist sm:text-6xl lg:text-7xl">
            عطری که
            <br />
            <span className="text-saffron">شبِ تو</span> را
            <br />
            ماندگار می‌کند
          </h1>
          <p className="mt-6 max-w-md text-base leading-8 text-mist/70">
            از گلاب قمصر تا عود و عنبر؛ رایحه‌هایی اصیل که برای همیشه در خاطر می‌مانند.
            با ضمانت اصالت، ارسال سریع و هدیه‌ای که پاپیون طلایی دارد.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button type="button" onClick={handleAdd} className="btn-gold">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 7h12l1.5 12.5a1 1 0 0 1-1 1.5h-13a1 1 0 0 1-1-1.5L6 7Z" />
                <path d="M9 10V6a3 3 0 0 1 6 0v4" />
              </svg>
              افزودن به سبد
            </button>
            <Link to="/shop" className="btn-outline">
              مشاهدهٔ فروشگاه
            </Link>
          </div>

          {/* آمار کوچک */}
          <div className="mt-10 flex flex-wrap gap-8">
            {[
              { v: '۴۸۰+', l: 'عطر اورجینال' },
              { v: '۹۸٪', l: 'رضایت مشتری' },
              { v: '۱۵ سال', l: 'تجربهٔ عطر' },
            ].map((s) => (
              <div key={s.l}>
                <p className="font-display text-2xl text-saffron">{s.v}</p>
                <p className="mt-1 text-xs text-mist/50">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* بطری هیرو */}
        <div className="relative mx-auto w-full max-w-md animate-fade-up" style={{ animationDelay: '0.15s' }}>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <div className="h-96 w-96 rounded-full border border-saffron/20 animate-spin-slow" />
            <div className="absolute h-72 w-72 rounded-full border border-saffron/10" />
            <div className="absolute h-48 w-48 rounded-full bg-saffron/10 blur-2xl" />
          </div>
          <div className="relative animate-floaty">
            <BottleArt name="رایحهٔ ناب شب" className="mx-auto h-[420px] w-[300px] drop-shadow-2xl" alt="بطری رایحهٔ ناب شب" />
          </div>
          {/* برچسب قیمت */}
          <div className="absolute -bottom-2 left-0 rounded-2xl border border-saffron/30 bg-ink-light/90 px-5 py-3 shadow-glow backdrop-blur">
            <p className="text-[10px] text-mist/50">رایحهٔ ناب شب — {toFa(50)} میلی‌لیتر</p>
            <p className="font-display text-xl text-saffron">
              {toFa(2_850_000)} <span className="text-xs">تومان</span>
            </p>
          </div>
        </div>
      </div>

      {/* نوار اعتماد */}
      <div className="border-t border-mist/5 bg-ink-light/40">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-6 md:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-saffron/30 text-saffron">
                ✦
              </span>
              <div>
                <p className="text-sm font-bold text-mist">{f.title}</p>
                <p className="text-[11px] text-mist/50">{f.text.split('；')[0] || f.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CategoryShowcase() {
  const [categories, setCategories] = useState([])
  useEffect(() => {
    categoryApi.list().then(({ data }) => setCategories(data.categories)).catch(() => {})
  }, [])

  const fallback = [
    { name: 'زنانه', slug: 'women', desc: 'گلی، گلاب و میوه‌ای' },
    { name: 'مردانه', slug: 'men', desc: 'چوبی، خنک و کلاسیک' },
    { name: 'یونیسکس', slug: 'unisex', desc: 'تکرارنشدنی، برای همه' },
  ]
  const list = categories.length ? categories : fallback

  return (
    <section className="mx-auto max-w-7xl px-4 py-20">
      <SectionHeading eyebrow="خانواده‌های بویایی" title="دنیای رایحه‌ها" center />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c, i) => (
          <Link
            key={c.slug}
            to={`/shop?cat=${c.slug}`}
            className="group relative overflow-hidden rounded-3xl border border-mist/10 bg-ink-light/50 p-8 transition-all duration-500 hover:border-saffron/40 hover:-translate-y-1"
          >
            <span className="absolute -left-6 -top-6 font-display text-[120px] leading-none text-mist/5 transition-colors duration-500 group-hover:text-saffron/10">
              {toFa(i + 1)}
            </span>
            <span className="text-4xl" aria-hidden="true">{PERFUME_COLLAGES[i % 3].emoji}</span>
            <h3 className="mt-5 font-display text-2xl text-mist transition-colors group-hover:text-saffron">
              {c.name}
            </h3>
            <p className="mt-2 text-sm leading-7 text-mist/60">{c.desc || PERFUME_COLLAGES[i % 3].desc}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-xs font-medium text-saffron">
              مشاهدهٔ محصولات
              <span className="transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true">←</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

function ProductRail({ title, eyebrow, query, link }) {
  const [products, setProducts] = useState(null)
  const [failed, setFailed] = useState(false)
  const [tick, setTick] = useState(0)
  useEffect(() => {
    setProducts(null)
    setFailed(false)
    productApi
      .list(query)
      .then(({ data }) => setProducts(data.products))
      .catch(() => {
        setFailed(true)
        setProducts([])
      })
  }, [JSON.stringify(query), tick])

  return (
    <section className="mx-auto max-w-7xl px-4 py-20">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading eyebrow={eyebrow} title={title} />
        {link && (
          <Link to={link.to} className="btn-outline">{link.label}</Link>
        )}
      </div>
      {failed ? (
        <div className="mt-12 rounded-3xl border border-rosewood/30 bg-rosewood/5 p-8 text-center">
          <p className="text-sm text-mist/70">در بارگذاری این بخش خطایی رخ داد.</p>
          <button
            type="button"
            onClick={() => setTick((t) => t + 1)}
            className="btn-outline mt-4"
          >
            تلاش دوباره
          </button>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {!products
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </section>
  )
}

function SignatureBand() {
  return (
    <section className="relative overflow-hidden border-y border-mist/10 bg-ink-light/40 py-24">
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-40" aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-saffron/5 blur-[120px]" aria-hidden="true" />
      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 text-center">
        <Seal size="lg" />
        <h2 className="mt-8 font-display text-4xl leading-snug text-mist sm:text-5xl">
          عطر، فقط عطر نیست؛
          <br />
          <span className="text-saffron">امضای توست.</span>
        </h2>
        <p className="mt-6 max-w-xl text-base leading-8 text-mist/70">
          هر بطری رایحه با دست انتخاب شده، با مهر اصالت مهر شده و در قابی از مخمل و پاپیون طلایی
          به دست شما می‌رسد؛ چون باور داریم خاطر‌ه‌ها با بو ساخته می‌شوند.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.title} className="rounded-3xl border border-mist/10 bg-ink/70 p-6 text-center backdrop-blur">
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-saffron font-display text-lg text-ink">
                {toFa(i + 1)}
              </span>
              <h3 className="mt-4 font-display text-lg text-mist">{s.title}</h3>
              <p className="mt-2 text-sm leading-7 text-mist/60">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function StatsBand() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20">
      <div className="grid gap-px overflow-hidden rounded-3xl border border-mist/10 bg-mist/10 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="bg-ink-light/60 px-8 py-10 text-center">
            <p className="font-display text-4xl text-saffron">{toFa(s.value)}</p>
            <p className="mt-2 text-sm text-mist/60">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section className="border-t border-mist/10 bg-ink-light/30 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading eyebrow="راز رایحه" title="مشتری‌های ما چه می‌گویند؟" center />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="flex flex-col rounded-3xl border border-mist/10 bg-ink/70 p-7">
              <span className="font-display text-5xl leading-none text-saffron/60" aria-hidden="true">”</span>
              <blockquote className="mt-3 flex-1 text-sm leading-8 text-mist/80">{t.text}</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-mist/10 pt-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-saffron/15 font-display text-lg text-saffron">
                  {t.name[0]}
                </span>
                <div>
                  <p className="text-sm font-bold text-mist">{t.name}</p>
                  <p className="text-xs text-mist/50">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function Journal() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20">
      <SectionHeading eyebrow="مجلهٔ رایحه" title="از دنیای عطرها" center />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {BLOG.map((b) => (
          <Link
            key={b.title}
            to="/journal"
            className="group flex flex-col rounded-3xl border border-mist/10 bg-ink-light/40 p-7 transition-all duration-500 hover:border-saffron/40 hover:-translate-y-1"
          >
            <span className="self-start rounded-full bg-saffron/10 px-3 py-1 text-[10px] font-bold tracking-widest text-saffron">
              {b.tag}
            </span>
            <h3 className="mt-4 font-display text-lg leading-8 text-mist transition-colors group-hover:text-saffron">
              {b.title}
            </h3>
            <p className="mt-3 flex-1 text-sm leading-7 text-mist/60">{b.excerpt}</p>
            <span className="mt-5 flex items-center gap-2 text-xs text-mist/50">
              <span>{b.read} مطالعه</span>
              <span aria-hidden="true">•</span>
              <span className="text-saffron">خواندن ادامه ←</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Hero />
      <CategoryShowcase />
      <ProductRail
        eyebrow="منتخب عطار"
        title="پرفروش‌ترین‌ها"
        query={{ sort: '-sold', limit: 8 }}
        link={{ to: '/shop', label: 'همهٔ عطرها' }}
      />
      <SignatureBand />
      <ProductRail
        eyebrow="تازه‌ها"
        title="جدیدترین رایحه‌ها"
        query={{ sort: '-createdAt', limit: 4 }}
        link={{ to: '/shop?sort=-createdAt', label: 'مشاهدهٔ همه' }}
      />
      <StatsBand />
      <Testimonials />
      <Journal />
    </>
  )
}
