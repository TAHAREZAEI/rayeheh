import { toFa } from '../lib/utils'

export default function QtyPicker({ value, onChange, min = 1, max = 5, small = false }) {
  const step = (d) => onChange(Math.max(min, Math.min(max, value + d)))
  const btn = small
    ? 'h-7 w-7 text-sm'
    : 'h-10 w-10 text-base'
  return (
    <div className="inline-flex items-center rounded-full border border-mist/20 bg-ink-light">
      <button
        type="button"
        onClick={() => step(1)}
        disabled={value >= max}
        className={`${btn} flex items-center justify-center text-saffron transition-colors hover:bg-saffron hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent rounded-full`}
        aria-label="افزایش تعداد"
        title={value >= max ? `حداکثر ${toFa(max)} عدد` : undefined}
      >
        +
      </button>
      <span className={`${small ? 'w-8' : 'w-10'} text-center font-bold text-mist tabular-nums`}>
        {toFa(value)}
      </span>
      <button
        type="button"
        onClick={() => step(-1)}
        disabled={value <= min}
        className={`${btn} flex items-center justify-center text-saffron transition-colors hover:bg-saffron hover:text-ink disabled:opacity-30 rounded-full`}
        aria-label="کاهش تعداد"
      >
        −
      </button>
    </div>
  )
}
