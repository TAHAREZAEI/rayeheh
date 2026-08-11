import { paletteFor } from '../lib/palette'
import { computeDiscount, toFa } from '../lib/utils'

/**
 * بطری عطر SVG دست‌ساز — امضای بصری برند رایحه
 * هر محصول با پالت رنگیِ مخصوص خودش رندر می‌شود.
 */
export default function BottleArt({ name = '', className = '', alt, ...rest }) {
  const [bg, glass, liquid, cap, accent] = paletteFor(name)

  const gradientId = `liq-${Math.abs([...name].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 0))}`
  const shineId = `shn-${gradientId}`

  return (
    <svg
      viewBox="0 0 240 320"
      role="img"
      aria-label={alt || `بطری عطر ${name}`}
      className={className}
      {...rest}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={liquid} />
          <stop offset="55%" stopColor={liquid} stopOpacity="0.82" />
          <stop offset="100%" stopColor={liquid} stopOpacity="0.92" />
        </linearGradient>
        <linearGradient id={shineId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* سرپوش */}
      <rect x="96" y="34" width="48" height="20" rx="3" fill={cap} />
      <rect x="100" y="26" width="40" height="14" rx="4" fill={cap} />
      <rect x="106" y="54" width="28" height="18" rx="2" fill={accent} opacity="0.9" />
      <rect x="110" y="54" width="10" height="18" fill="#ffffff" opacity="0.08" />

      {/* گردن */}
      <rect x="100" y="72" width="40" height="16" fill={glass} />
      <rect x="104" y="72" width="12" height="16" fill="#ffffff" opacity="0.28" />

      {/* بدنه */}
      <path
        d="M120 88
           C 72 92, 50 122, 50 178
           C 50 238, 74 282, 120 288
           C 166 282, 190 238, 190 178
           C 190 122, 168 92, 120 88 Z"
        fill={glass}
      />
      {/* مایع داخل بطری */}
      <path
        d="M120 118
           C 78 124, 62 150, 62 196
           C 62 250, 82 276, 120 280
           C 158 276, 178 250, 178 196
           C 178 150, 162 124, 120 118 Z"
        fill={`url(#${gradientId})`}
        opacity="0.96"
      />
      {/* درخشش شیشه */}
      <path
        d="M120 92
           C 78 96, 58 122, 56 172
           C 66 140, 88 116, 118 110
           L 120 92 Z"
        fill={`url(#${shineId})`}
      />
      {/* برچسب */}
      <g>
        <ellipse cx="120" cy="200" rx="40" ry="52" fill={bg} opacity="0.95" />
        <ellipse cx="120" cy="200" rx="40" ry="52" fill="none" stroke={accent} strokeWidth="1.6" opacity="0.75" />
        <circle cx="120" cy="178" r="8.5" fill="none" stroke={accent} strokeWidth="1.4" opacity="0.9" />
        <text
          x="120"
          y="184"
          textAnchor="middle"
          fontFamily="Gulzar, Vazirmatn, serif"
          fontSize="14"
          fill={cap}
        >
          ر
        </text>
        <line x1="98" y1="216" x2="142" y2="216" stroke={accent} strokeWidth="1" opacity="0.6" />
        <text x="120" y="232" textAnchor="middle" fontFamily="Vazirmatn, sans-serif" fontSize="6.5" fill={cap} opacity="0.85">
          RAYEHEH
        </text>
      </g>
      {/* خط برش شیشه */}
      <path d="M118 288 Q120 294 122 288" stroke="#ffffff" strokeOpacity="0.3" fill="none" strokeWidth="2" />
    </svg>
  )
}

/** نسخهٔ کوچک بطری همراه با لوگوی قیمت — برای کارت محصول */
export function BottleCard({ product, size = 'md' }) {
  const discount = computeDiscount(product.price, product.oldPrice)
  const sizes = {
    sm: 'w-28 h-36',
    md: 'w-36 h-48',
    lg: 'w-44 h-56',
  }
  return (
    <div className="relative flex flex-col items-center">
      <div className={`relative ${sizes[size]}`}>
        <div
          className="absolute inset-0 rounded-full opacity-25 blur-2xl"
          style={{ background: paletteFor(product.name)[2] }}
          aria-hidden="true"
        />
        <BottleArt name={product.name} className="relative h-full w-full drop-shadow-2xl" alt={product.name} />
      </div>
      {discount > 0 && (
        <span className="absolute -left-1 top-1 z-10 -rotate-12 rounded-full bg-rosewood px-2.5 py-1 text-[10px] font-bold text-mist shadow-lg">
          {toFa(discount)}٪
        </span>
      )}
    </div>
  )
}
