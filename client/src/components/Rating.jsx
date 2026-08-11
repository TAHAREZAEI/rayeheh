import { toFa } from '../lib/utils'

/**
 * ستاره‌های امتیاز — خوانا و با اندازهٔ ثابت.
 * روی زمینهٔ روشن (paper) ستارهٔ پر با جوهر و ستارهٔ خالی با میانهٔ تهداب رسم می‌شود
 * تا کنتراست (≥۳:۱) حفظ شود.
 */
export default function Rating({ value = 0, count, className = '', size = 'text-sm', light = false }) {
  const filled = light ? 'text-ink' : 'text-saffron'
  const empty = light ? 'text-soil/30' : 'text-mist/25'
  return (
    <span className={`inline-flex items-center gap-1 ${className}`} aria-label={`امتیاز ${value} از ۵`}>
      <span className={`flex items-center ${size} leading-none`} aria-hidden="true">
        {[1, 2, 3, 4, 5].map((n) => {
          const fill = value >= n ? 'full' : value >= n - 0.5 ? 'half' : 'empty'
          return (
            <span key={n} className={`relative inline-block w-[1em] overflow-hidden ${empty}`}>
              <span className="absolute inset-0 overflow-hidden" style={{ width: fill === 'half' ? '50%' : '100%', display: fill === 'empty' ? 'none' : 'block' }}>
                <span className={filled}>★</span>
              </span>
              ★
            </span>
          )
        })}
      </span>
      {typeof count === 'number' && (
        <span className="text-xs text-mist/60">({toFa(count)})</span>
      )}
    </span>
  )
}
