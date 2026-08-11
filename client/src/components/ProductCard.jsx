import { Link } from 'react-router-dom'
import BottleArt from './BottleArt'
import Price from './Price'
import Rating from './Rating'
import { useCart } from '../context/CartContext'
import { formatWeight, toFa } from '../lib/utils'

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  if (!product) return null

  const handleAdd = (e) => {
    e.preventDefault()
    addItem({
      id: product._id,
      key: product._id,
      name: product.name,
      edition: product.edition,
      price: product.price,
      img: product.img,
      slug: product.slug,
      qty: 1,
    })
  }

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl bg-paper p-5 text-right transition-all duration-500 hover:-translate-y-1.5 hover:shadow-card"
    >
      {/* تصویر بطری */}
      <div className="relative mb-4 flex h-52 items-center justify-center overflow-hidden rounded-2xl bg-paper-dark/60">
        <div className="absolute inset-0 bg-grain opacity-40" aria-hidden="true" />
        <BottleArt
          name={product.name}
          className="relative h-40 w-32 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-3"
        />
        {product.isNew && (
          <span className="absolute right-3 top-3 rounded-full bg-ink px-3 py-1 text-[10px] font-bold text-saffron-light">
            جدید
          </span>
        )}
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-rosewood px-3 py-1 text-[10px] font-bold text-paper">
            {product.badge}
          </span>
        )}
      </div>

      {/* اطلاعات */}
      <div className="flex flex-1 flex-col gap-1.5 px-1">
        <span className="text-[10px] font-medium tracking-widest text-saffron-dark">
          {product.brand || 'رایحه'}
        </span>
        <h3 className="font-display text-lg leading-snug text-soil transition-colors group-hover:text-rosewood">
          {product.name}
        </h3>
        <div className="flex items-center justify-between text-xs text-soil/60">
          <span>{product.edition || 'ادوپرفیوم'}</span>
          <span>{formatWeight(product.weight)}</span>
        </div>
        {product.ratingCount > 0 && <Rating value={product.rating} count={product.ratingCount} size="text-xs" />}
        <div className="mt-auto flex items-center justify-between pt-3">
          <Price price={product.price} oldPrice={product.oldPrice} dark={false} size="sm" />
          <button
            type="button"
            onClick={handleAdd}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-lg text-saffron transition-all duration-300 hover:scale-110 hover:bg-saffron hover:text-ink"
            aria-label={`افزودن ${product.name} به سبد`}
            title="افزودن به سبد"
          >
            +
          </button>
        </div>
      </div>
    </Link>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse rounded-3xl bg-paper p-5">
      <div className="mb-4 h-52 rounded-2xl bg-paper-dark/70" />
      <div className="h-3 w-16 rounded bg-soil/20" />
      <div className="mt-2 h-5 w-3/4 rounded bg-soil/20" />
      <div className="mt-3 h-4 w-1/2 rounded bg-soil/15" />
      <div className="mt-4 flex justify-between">
        <div className="h-4 w-20 rounded bg-soil/20" />
        <div className="h-9 w-9 rounded-full bg-soil/20" />
      </div>
    </div>
  )
}
