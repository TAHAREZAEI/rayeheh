import { useEffect, useState } from 'react'
import { adminApi, extractMessage } from '../../lib/api'
import { formatDate, toFa } from '../../lib/utils'
import Spinner from '../../components/Spinner'
import ConfirmDialog from '../../components/ConfirmDialog'
import { toast } from 'react-hot-toast'

export default function AdminMessages() {
  const [messages, setMessages] = useState(null)
  const [confirm, setConfirm] = useState(null)

  const load = () => {
    adminApi.messages({ limit: 100 }).then(({ data }) => setMessages(data.messages)).catch(() => setMessages([]))
  }
  useEffect(load, [])

  const doDelete = async (id) => {
    try {
      await adminApi.deleteMessage(id)
      toast.success('پیام حذف شد')
      setConfirm(null)
      load()
    } catch (err) {
      toast.error(extractMessage(err))
    }
  }

  return (
    <div>
      <h2 className="font-display text-2xl text-mist">پیام‌های تماس</h2>
      <p className="mt-1 text-xs text-mist/70">پیام‌های دریافت‌شده از فرم تماس</p>

      <div className="mt-6 space-y-4">
        {!messages ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : messages.length === 0 ? (
          <p className="py-16 text-center text-sm text-mist/60">هنوز پیامی دریافت نشده است.</p>
        ) : (
          messages.map((m) => (
            <div key={m._id} className="rounded-3xl border border-mist/10 bg-ink-light/40 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-saffron/15 font-display text-lg text-saffron">
                    {m.name?.[0] || '؟'}
                  </span>
                  <div>
                    <p className="font-bold text-mist">{m.name}</p>
                    <p className="text-xs text-mist/70">{m.topic || 'بدون موضوع'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-mist/60">{formatDate(m.createdAt)}</span>
                  <button
                    type="button"
                    onClick={() => setConfirm(m)}
                    className="rounded-full border border-rosewood/30 px-3 py-1.5 text-xs text-rosewood transition-colors hover:bg-rosewood/10"
                  >
                    حذف
                  </button>
                </div>
              </div>
              <p className="mt-4 text-sm leading-8 text-mist/80">{m.message}</p>
              <div className="mt-4 flex flex-wrap gap-4 border-t border-mist/10 pt-4 text-xs text-mist/70">
                <a href={`mailto:${m.email}`} className="transition-colors hover:text-saffron" dir="ltr">✉️ {m.email}</a>
                {m.phone && <span dir="ltr">📱 {m.phone}</span>}
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmDialog
        open={!!confirm}
        title="حذف پیام؟"
        body="این پیام برای همیشه پاک می‌شود."
        onCancel={() => setConfirm(null)}
        onConfirm={() => doDelete(confirm._id)}
      />
    </div>
  )
}
