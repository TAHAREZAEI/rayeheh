import { BRAND, FEATURES, STATS } from '../data/static'
import { toFa } from '../lib/utils'
import Seal from '../components/Seal'

export default function About() {
  return (
    <>
      {/* سربرگ */}
      <section className="relative overflow-hidden py-20 text-center">
        <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-saffron/10 blur-[120px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-4">
          <Seal className="mx-auto" size="lg" />
          <h1 className="mt-8 font-display text-5xl leading-snug text-mist">
            از گلاب قمصر تا
            <br />
            <span className="text-saffron">میزِ آرایشِ شما</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-9 text-mist/70">
            رایحه از سال {BRAND.since} در تهران آغاز شد؛ با یک ویترین کوچک پر از بطری‌های شیشه‌ای و
            یک باور ساده: عطر اورجینال، حقِ هر مشتری است.
          </p>
        </div>
      </section>

      {/* داستان */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <div className="rounded-[2.5rem] border border-mist/10 bg-ink-light/50 p-10">
              <span className="font-display text-[100px] leading-none text-saffron/20">ر</span>
              <h2 className="-mt-6 font-display text-3xl text-mist">قصهٔ ما</h2>
              <p className="mt-5 text-sm leading-8 text-mist/70">
                همه‌چیز از یک سفر به قمصر شروع شد؛ عطر گلابِ تازه، آن‌قدر ما را مبهوت کرد که تصمیم
                گرفتیم درِ دنیای عطر را به شکلی متفاوت باز کنیم؛ نه به شکل فروشگاه‌های شلوغ، بلکه
                مانند یک خانهٔ عطر که در آن، هر مشتری با یک «عطار» گفت‌وگو می‌کند.
              </p>
              <p className="mt-4 text-sm leading-8 text-mist/70">
                امروز، تیم رایحه هر محصول را می‌بوید، تاریخچه‌اش را می‌خواند و پیش از اینکه در
                ویترین بنشیند، مطمئن می‌شود که یک عطر سزاوار جای خودش است. ماندگاری، پخش بو و
                «هم‌نشینی» با پوست و مزاج شما، معیارهای ماست، نه صرفاً برند.
              </p>
            </div>
            <div className="pointer-events-none absolute -left-6 -top-6 h-24 w-24 rounded-full border border-saffron/30" aria-hidden="true" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-3xl border border-mist/10 bg-ink-light/40 p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-saffron/15 text-xl text-saffron">✦</span>
                <h3 className="mt-4 font-display text-lg text-mist">{f.title}</h3>
                <p className="mt-2 text-sm leading-7 text-mist/60">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* آمار */}
      <section className="border-y border-mist/10 bg-ink-light/30 py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-4xl text-saffron">{toFa(s.value)}</p>
              <p className="mt-2 text-sm text-mist/60">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ارزش‌ها */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="text-center font-display text-3xl text-mist">چه چیز ما را «رایحه» می‌کند؟</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              t: 'اصالت، بدون استثنا',
              d: 'هر بطری از مسیر رسمی وارد می‌شود و با هولوگرام قابل استعلام عرضه می‌شود؛ اگر شک کردید، ما شکِ شما را جدی می‌گیریم.',
            },
            {
              t: 'انتخابِ انسانی',
              d: 'الگوریتم‌ها بو نمی‌کشند. تیم ما هر رایحه را روی پوست می‌آزماید تا مطمئن شود به مزاج شما می‌نشیند.',
            },
            {
              t: 'بسته‌بندیِ نفیس',
              d: 'هر سفارش با قاب مخملی و پاپیون طلایی بسته می‌شود؛ چون می‌دانیم بسیاری از سفارش‌های ما، هدیه‌اند.',
            },
          ].map((v) => (
            <div key={v.t} className="rounded-3xl border border-mist/10 bg-ink-light/40 p-8 text-center">
              <span className="font-display text-5xl text-saffron/40" aria-hidden="true">❦</span>
              <h3 className="mt-4 font-display text-xl text-mist">{v.t}</h3>
              <p className="mt-3 text-sm leading-8 text-mist/60">{v.d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
