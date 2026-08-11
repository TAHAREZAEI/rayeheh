import { useState } from 'react'
import { FAQS } from '../data/static'

export default function Faq() {
  const [open, setOpen] = useState(0)
  const groups = [
    { title: 'خرید و اصالت', items: FAQS.slice(0, 2) },
    { title: 'ارسال و تحویل', items: FAQS.slice(2, 4) },
    { title: 'بازگشت و مرجوعی', items: FAQS.slice(4, 6) },
  ]
  let idx = 0
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <div className="text-center">
        <h1 className="font-display text-5xl text-mist">سوالات پرتکرار</h1>
        <p className="mt-4 text-sm text-mist/60">پاسخ سوال‌های پرتکرار شما را اینجا جمع کرده‌ایم.</p>
      </div>
      <div className="mt-12 space-y-10">
        {groups.map((g) => (
          <div key={g.title}>
            <h2 className="mb-4 flex items-center gap-3 text-sm font-bold tracking-widest text-saffron">
              <span className="h-px w-8 bg-saffron/50" aria-hidden="true" />
              {g.title}
            </h2>
            <ul className="divide-y divide-mist/10 rounded-3xl border border-mist/10 bg-ink-light/40">
              {g.items.map((f) => {
                const i = idx++
                return (
                  <li key={f.q}>
                    <button
                      type="button"
                      onClick={() => setOpen(open === i ? -1 : i)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-right font-display text-base text-mist transition-colors hover:text-saffron"
                      aria-expanded={open === i}
                    >
                      {f.q}
                      <span className={`shrink-0 font-display text-xl text-saffron transition-transform duration-300 ${open === i ? 'rotate-45' : ''}`} aria-hidden="true">+</span>
                    </button>
                    {open === i && (
                      <p className="px-6 pb-6 text-sm leading-8 text-mist/70">{f.a}</p>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
