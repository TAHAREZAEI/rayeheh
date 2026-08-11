import { formatPrice, computeDiscount, toFa } from '../lib/utils'

/** قیمت + قیمت خط‌خورده — سازگار با زمینه تیره/روشن */
export default function Price({ price, oldPrice, dark = true, size = 'md' }) {
  const discount = computeDiscount(price, oldPrice)
  const cls = dark ? 'text-saffron-light' : 'text-ink'
  const sizes = { sm: 'text-sm', md: 'text-lg', lg: 'text-2xl' }
  return (
    <span className="flex flex-wrap items-center gap-2">
      <span className={`font-extrabold ${sizes[size]} ${cls}`}>{formatPrice(price)}</span>
      {oldPrice > price && (
        <span className={`text-xs line-through ${dark ? 'text-mist/60' : 'text-soil/50'}`}>
          {formatPrice(oldPrice)}
        </span>
      )}
      {discount > 0 && (
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${dark ? 'bg-rosewood text-mist' : 'bg-rosewood text-paper'}`}>
          {toFa(discount)}٪ تخفیف
        </span>
      )}
    </span>
  )
}
