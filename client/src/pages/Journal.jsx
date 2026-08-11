import { BLOG } from '../data/static'

export default function Journal() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <div className="text-center">
        <span className="eyebrow justify-center">مجلهٔ رایحه</span>
        <h1 className="mt-3 font-display text-5xl text-mist">از دنیای عطرها</h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-8 text-mist/60">
          مقاله‌ها، راهنماها و تجربه‌های عطارهای ما؛ برای اینکه عطر را بهتر بشناسید و بهتر انتخاب کنید.
        </p>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {BLOG.map((b) => (
          <article key={b.title} className="group flex flex-col rounded-3xl border border-mist/10 bg-ink-light/40 p-7 transition-all duration-500 hover:border-saffron/40 hover:-translate-y-1">
            <span className="self-start rounded-full bg-saffron/10 px-3 py-1 text-[10px] font-bold tracking-widest text-saffron">{b.tag}</span>
            <h2 className="mt-4 font-display text-lg leading-8 text-mist transition-colors group-hover:text-saffron">{b.title}</h2>
            <p className="mt-3 flex-1 text-sm leading-7 text-mist/60">{b.excerpt}</p>
            <span className="mt-5 flex items-center gap-2 text-xs text-mist/50">
              <span>{b.read} مطالعه</span>
              <span aria-hidden="true">•</span>
              <span className="text-saffron">خواندن ادامه ←</span>
            </span>
          </article>
        ))}
      </div>
      <div className="mt-16 rounded-3xl border border-saffron/20 bg-saffron/5 p-10 text-center">
        <h2 className="font-display text-2xl text-mist">می‌خواهید زودتر از همه باخبر شوید؟</h2>
        <p className="mt-2 text-sm text-mist/60">در خبرنامهٔ رایحه عضو شوید؛ رایحه‌های تازه و تخفیف‌های ویژه را اول از همه ببینید.</p>
        <a href="/" className="btn-gold mt-6 inline-block">عضویت در خبرنامه</a>
      </div>
    </div>
  )
}
