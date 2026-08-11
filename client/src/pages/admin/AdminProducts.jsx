import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi, extractMessage } from '../../lib/api'
import { formatPrice, toFa } from '../../lib/utils'
import BottleArt from '../../components/BottleArt'
import Spinner from '../../components/Spinner'
import ConfirmDialog from '../../components/ConfirmDialog'
import { toast } from 'react-hot-toast'

export default function AdminProducts() {
  const [products, setProducts] = useState(null)
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = (params = {}) => {
    setProducts(null)
    adminApi
      .products({ q, page, limit: 12, ...params })
      .then(({ data }) => {
        setProducts(data.products)
        setPages(data.pages)
        setTotal(data.total)
      })
      .catch(() => setProducts([]))
  }

  useEffect(() => {
    const t = setTimeout(() => load(), 300)
    return () => clearTimeout(t)
  }, [q, page])

  const doDelete = async (id) => {
    setDeleting(true)
    try {
      await adminApi.deleteProduct(id)
      toast.success('محصول حذف شد')
      setConfirmDelete(null)
      load()
    } catch (err) {
      toast.error(extractMessage(err))
    } finally {
      setDeleting(false)
    }
  }

  const stats = useMemo(
    () => ({
      total,
      active: products?.filter((p) => p.active).length ?? 0,
      low: products?.filter((p) => p.stock < 5).length ?? 0,
    }),
    [products, total]
  )

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-mist">محصولات</h2>
          <p className="mt-1 text-xs text-mist/50">
            {toFa(stats.total)} محصول — {toFa(stats.active)} فعال — {toFa(stats.low)} کم‌موجود
          </p>
        </div>
        <Link to="/admin/products/new" className="btn-gold">+ محصول جدید</Link>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <input
          type="search"
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1) }}
          placeholder="جستجو در محصولات…"
          className="field-dark max-w-sm"
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-mist/10">
        {!products ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : products.length === 0 ? (
          <p className="py-16 text-center text-sm text-mist/40">محصولی یافت نشد.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-right text-sm">
              <thead>
                <tr className="border-b border-mist/10 bg-ink-light/60 text-xs text-mist/50">
                  <th className="px-5 py-4 font-medium">محصول</th>
                  <th className="px-5 py-4 font-medium">دسته</th>
                  <th className="px-5 py-4 font-medium">قیمت</th>
                  <th className="px-5 py-4 font-medium">موجودی</th>
                  <th className="px-5 py-4 font-medium">فروش</th>
                  <th className="px-5 py-4 font-medium">وضعیت</th>
                  <th className="px-5 py-4 font-medium">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mist/5">
                {products.map((p) => (
                  <tr key={p._id} className="transition-colors hover:bg-mist/5">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-12 w-10 shrink-0 items-center justify-center rounded-xl bg-paper/5">
                          <BottleArt name={p.name} className="h-10 w-8" alt="" />
                        </span>
                        <div>
                          <Link to={`/product/${p.slug}`} className="font-bold text-mist hover:text-saffron">{p.name}</Link>
                          <p className="text-xs text-mist/40">{p.edition} · {toFa(p.weight)} میلی‌لیتر</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-mist/60">{p.category?.name || '—'}</td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-saffron">{formatPrice(p.price)}</p>
                      {p.oldPrice > p.price && <p className="text-xs line-through text-mist/30">{formatPrice(p.oldPrice)}</p>}
                    </td>
                    <td className={`px-5 py-4 font-bold ${p.stock < 5 ? 'text-rosewood' : 'text-mist'}`}>{toFa(p.stock)}</td>
                    <td className="px-5 py-4 text-mist/60">{toFa(p.sold)}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${p.active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-mist/10 text-mist/40'}`}>
                        {p.active ? 'فعال' : 'غیرفعال'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link to={`/admin/products/${p._id}`} className="rounded-full border border-mist/20 px-3 py-1.5 text-xs text-mist/80 transition-colors hover:border-saffron hover:text-saffron">
                          ویرایش
                        </Link>
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(p)}
                          className="rounded-full border border-rosewood/30 px-3 py-1.5 text-xs text-rosewood transition-colors hover:bg-rosewood/10"
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* صفحه‌بندی */}
      {pages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i + 1)}
              className={`h-9 w-9 rounded-full text-sm ${page === i + 1 ? 'bg-saffron font-bold text-ink' : 'border border-mist/15 text-mist/70'}`}
            >
              {toFa(i + 1)}
            </button>
          ))}
        </div>
      )}

      {/* تأیید حذف */}
      <ConfirmDialog
        open={!!confirmDelete}
        title={confirmDelete ? `حذف «${confirmDelete.name}»؟` : ''}
        body="این عمل قابل بازگشت نیست و محصول از فروشگاه حذف می‌شود."
        busy={deleting}
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => doDelete(confirmDelete._id)}
      />
    </div>
  )
}
