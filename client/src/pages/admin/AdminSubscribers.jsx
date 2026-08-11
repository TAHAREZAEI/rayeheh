import { useEffect, useState } from 'react'
import { adminApi, extractMessage } from '../../lib/api'
import { formatDate, toFa } from '../../lib/utils'
import Spinner from '../../components/Spinner'
import ConfirmDialog from '../../components/ConfirmDialog'
import { toast } from 'react-hot-toast'

export default function AdminSubscribers() {
  const [subs, setSubs] = useState(null)
  const [confirm, setConfirm] = useState(null)

  const load = () => {
    adminApi.subscribers({ limit: 200 }).then(({ data }) => setSubs(data.subscribers)).catch(() => setSubs([]))
  }
  useEffect(load, [])

  const doDelete = async (id) => {
    try {
      await adminApi.deleteSubscriber(id)
      toast.success('عضو خبرنامه حذف شد')
      setConfirm(null)
      load()
    } catch (err) {
      toast.error(extractMessage(err))
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-mist">اعضای خبرنامه</h2>
          <p className="mt-1 text-xs text-mist/50">{toFa(subs?.length ?? 0)} عضو</p>
        </div>
        <button
          type="button"
          className="btn-outline"
          onClick={() => {
            if (!subs?.length) return
            const text = subs.map((s) => s.email).join('\n')
            navigator.clipboard.writeText(text)
            toast.success('ایمیل‌ها کپی شد')
          }}
        >
          کپی همهٔ ایمیل‌ها
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-mist/10">
        {!subs ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : subs.length === 0 ? (
          <p className="py-16 text-center text-sm text-mist/40">هنوز عضوی ثبت نشده است.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-right text-sm">
              <thead>
                <tr className="border-b border-mist/10 bg-ink-light/60 text-xs text-mist/50">
                  <th className="px-5 py-4 font-medium">ایمیل</th>
                  <th className="px-5 py-4 font-medium">تاریخ عضویت</th>
                  <th className="px-5 py-4 font-medium">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mist/5">
                {subs.map((s) => (
                  <tr key={s._id} className="transition-colors hover:bg-mist/5">
                    <td className="px-5 py-4 font-bold text-mist" dir="ltr">{s.email}</td>
                    <td className="px-5 py-4 text-mist/60">{formatDate(s.createdAt)}</td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => setConfirm(s)}
                        className="rounded-full border border-rosewood/30 px-3 py-1.5 text-xs text-rosewood transition-colors hover:bg-rosewood/10"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!confirm}
        title="حذف از خبرنامه؟"
        body={confirm?.email}
        onCancel={() => setConfirm(null)}
        onConfirm={() => doDelete(confirm._id)}
      />
    </div>
  )
}
