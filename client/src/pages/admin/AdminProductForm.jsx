import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { adminApi, categoryApi, extractMessage } from '../../lib/api'
import { slugifyFa, toEn } from '../../lib/utils'
import PageLoader from '../../components/PageLoader'
import { toast } from 'react-hot-toast'

const FAMILIES = ['گلی', 'میوه‌ای', 'چوبی', 'شرقی', 'مرکباتی', 'خنک']
const EDITIONS = ['ادوپرفیوم', 'ادوتویلت', 'ادکلن', 'عطر خالص']

const EMPTY = {
  name: '',
  brand: 'رایحه',
  slug: '',
  category: '',
  price: '',
  oldPrice: '',
  stock: '10',
  weight: '50',
  edition: 'ادوپرفیوم',
  family: '',
  description: '',
  notesTop: '',
  notesHeart: '',
  notesBase: '',
  longevity: '4',
  sillage: '4',
  badge: '',
  isNew: false,
  featured: false,
  active: true,
}

export default function AdminProductForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    categoryApi.list().then(({ data }) => setCategories(data.categories)).catch(() => {})
    if (isEdit) {
      adminApi.product(id).then(({ data }) => {
        const p = data.product
        setForm({
          name: p.name,
          brand: p.brand,
          slug: p.slug,
          category: p.category?._id || '',
          price: String(p.price),
          oldPrice: p.oldPrice ? String(p.oldPrice) : '',
          stock: String(p.stock),
          weight: String(p.weight),
          edition: p.edition,
          family: p.family,
          description: p.description,
          notesTop: p.notes?.top || '',
          notesHeart: p.notes?.heart || '',
          notesBase: p.notes?.base || '',
          longevity: String(p.longevity),
          sillage: String(p.sillage),
          badge: p.badge || '',
          isNew: p.isNew,
          featured: p.featured,
          active: p.active,
        })
        setLoading(false)
      }).catch((err) => {
        setError(extractMessage(err, 'محصول پیدا نشد'))
        setLoading(false)
      })
    }
  }, [id, isEdit])

  const set = (key) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [key]: v }))
  }

  // اسلاگ به‌طور خودکار از نام ساخته می‌شود
  const setName = (e) => {
    const name = e.target.value
    setForm((f) => ({
      ...f,
      name,
      slug: slugifyFa(name) || f.slug,
    }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    const price = Number(toEn(form.price))
    if (form.name.trim().length < 3) return setError('نام محصول را کامل بنویسید.')
    if (!form.category) return setError('دسته‌بندی را انتخاب کنید.')
    if (!price || price <= 0) return setError('قیمت معتبر وارد کنید.')
    if (!form.family) return setError('خانوادهٔ بویایی را انتخاب کنید.')

    const payload = {
      name: form.name.trim(),
      brand: form.brand.trim() || 'رایحه',
      slug: form.slug.trim() || slugifyFa(form.name),
      category: form.category,
      price,
      oldPrice: Number(toEn(form.oldPrice)) || 0,
      stock: Math.max(0, Number(toEn(form.stock)) || 0),
      weight: Number(toEn(form.weight)) || 50,
      edition: form.edition,
      family: form.family,
      description: form.description.trim(),
      notes: {
        top: form.notesTop.trim(),
        heart: form.notesHeart.trim(),
        base: form.notesBase.trim(),
      },
      longevity: Math.min(5, Math.max(1, Number(toEn(form.longevity)) || 4)),
      sillage: Math.min(5, Math.max(1, Number(toEn(form.sillage)) || 4)),
      badge: form.badge.trim(),
      isNew: form.isNew,
      featured: form.featured,
      active: form.active,
    }

    setSaving(true)
    try {
      if (isEdit) {
        await adminApi.updateProduct(id, payload)
        toast.success('محصول به‌روزرسانی شد')
      } else {
        await adminApi.createProduct(payload)
        toast.success('محصول جدید ساخته شد')
      }
      navigate('/admin/products')
    } catch (err) {
      setError(extractMessage(err))
      setSaving(false)
    }
  }

  if (loading) return <PageLoader />

  return (
    <div>
      <div className="flex items-center gap-4">
        <Link to="/admin/products" className="text-sm text-mist/50 transition-colors hover:text-saffron">← بازگشت</Link>
        <h2 className="font-display text-2xl text-mist">
          {isEdit ? 'ویرایش محصول' : 'محصول جدید'}
        </h2>
      </div>

      <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          {/* مشخصات */}
          <section className="rounded-3xl border border-mist/10 bg-ink-light/40 p-6 sm:p-8">
            <h3 className="mb-6 font-display text-lg text-mist">مشخصات اصلی</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold text-mist/60">نام محصول *</label>
                <input value={form.name} onChange={setName} className="field-dark" placeholder="مثلاً: عطر سلطنتی" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold text-mist/60">برند</label>
                <input value={form.brand} onChange={set('brand')} className="field-dark" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold text-mist/60">اسلاگ (آدرس)</label>
                <input dir="ltr" value={form.slug} onChange={set('slug')} className="field-dark text-left" placeholder="royal-parfum" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold text-mist/60">دسته‌بندی *</label>
                <select value={form.category} onChange={set('category')} className="field-dark">
                  <option value="">انتخاب دسته</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-2 block text-xs font-bold text-mist/60">توضیحات</label>
                <textarea rows={3} value={form.description} onChange={set('description')} className="field-dark" placeholder="توضیحی شاعرانه و دقیق از این رایحه…" />
              </div>
            </div>
          </section>

          {/* قیمت و موجودی */}
          <section className="rounded-3xl border border-mist/10 bg-ink-light/40 p-6 sm:p-8">
            <h3 className="mb-6 font-display text-lg text-mist">قیمت و موجودی</h3>
            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-xs font-bold text-mist/60">قیمت (تومان) *</label>
                <input value={form.price} onChange={set('price')} className="field-dark" inputMode="numeric" placeholder="2500000" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold text-mist/60">قیمت قبل (برای تخفیف)</label>
                <input value={form.oldPrice} onChange={set('oldPrice')} className="field-dark" inputMode="numeric" placeholder="3000000" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold text-mist/60">موجودی</label>
                <input value={form.stock} onChange={set('stock')} className="field-dark" inputMode="numeric" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold text-mist/60">حجم (میلی‌لیتر)</label>
                <input value={form.weight} onChange={set('weight')} className="field-dark" inputMode="numeric" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold text-mist/60">نوع عطر</label>
                <select value={form.edition} onChange={set('edition')} className="field-dark">
                  {EDITIONS.map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold text-mist/60">برچسب (اختیاری)</label>
                <input value={form.badge} onChange={set('badge')} className="field-dark" placeholder="مثلاً: پرفروش" />
              </div>
            </div>
          </section>

          {/* بویایی */}
          <section className="rounded-3xl border border-mist/10 bg-ink-light/40 p-6 sm:p-8">
            <h3 className="mb-6 font-display text-lg text-mist">مشخصات بویایی</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold text-mist/60">خانوادهٔ بویایی *</label>
                <select value={form.family} onChange={set('family')} className="field-dark">
                  <option value="">انتخاب کنید</option>
                  {FAMILIES.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-xs font-bold text-mist/60">ماندگاری (۱–۵)</label>
                  <input value={form.longevity} onChange={set('longevity')} className="field-dark" inputMode="numeric" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold text-mist/60">پخش بو (۱–۵)</label>
                  <input value={form.sillage} onChange={set('sillage')} className="field-dark" inputMode="numeric" />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold text-mist/60">نت آغازین</label>
                <input value={form.notesTop} onChange={set('notesTop')} className="field-dark" placeholder="برگاموت، لیمو…" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold text-mist/60">نت میانی</label>
                <input value={form.notesHeart} onChange={set('notesHeart')} className="field-dark" placeholder="گل محمدی، یاس…" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold text-mist/60">نت پایانی</label>
                <input value={form.notesBase} onChange={set('notesBase')} className="field-dark" placeholder="عود، عنبر، مشک…" />
              </div>
            </div>
          </section>
        </div>

        {/* وضعیت */}
        <aside className="h-fit space-y-6 lg:sticky lg:top-28">
          <section className="rounded-3xl border border-mist/10 bg-ink-light/40 p-6">
            <h3 className="mb-5 font-display text-lg text-mist">وضعیت انتشار</h3>
            <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-mist/10 p-4">
              <span className="text-sm font-bold text-mist">فعال در فروشگاه</span>
              <input type="checkbox" checked={form.active} onChange={set('active')} className="h-5 w-5 rounded border-mist/30 text-saffron focus:ring-saffron/40" />
            </label>
            <label className="mt-3 flex cursor-pointer items-center justify-between rounded-2xl border border-mist/10 p-4">
              <span className="text-sm font-bold text-mist">برچسب «جدید»</span>
              <input type="checkbox" checked={form.isNew} onChange={set('isNew')} className="h-5 w-5 rounded border-mist/30 text-saffron focus:ring-saffron/40" />
            </label>
            <label className="mt-3 flex cursor-pointer items-center justify-between rounded-2xl border border-mist/10 p-4">
              <span className="text-sm font-bold text-mist">ویژهٔ صفحهٔ نخست</span>
              <input type="checkbox" checked={form.featured} onChange={set('featured')} className="h-5 w-5 rounded border-mist/30 text-saffron focus:ring-saffron/40" />
            </label>
          </section>

          {error && <p className="rounded-2xl bg-rosewood/15 px-4 py-3 text-xs leading-6 text-rosewood">{error}</p>}

          <button type="submit" disabled={saving} className="btn-gold w-full">
            {saving ? 'در حال ذخیره…' : isEdit ? 'ذخیرهٔ تغییرات' : 'ایجاد محصول'}
          </button>
        </aside>
      </form>
    </div>
  )
}
