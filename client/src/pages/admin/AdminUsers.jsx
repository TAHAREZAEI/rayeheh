import { useEffect, useState } from 'react'
import { adminApi, extractMessage } from '../../lib/api'
import { formatDate, toFa } from '../../lib/utils'
import Spinner from '../../components/Spinner'
import { toast } from 'react-hot-toast'

export default function AdminUsers() {
  const [users, setUsers] = useState(null)

  const load = () => {
    adminApi.users({ limit: 100 }).then(({ data }) => setUsers(data.users)).catch(() => setUsers([]))
  }
  useEffect(load, [])

  const toggleAdmin = async (user) => {
    try {
      await adminApi.setUserAdmin(user._id, !user.isAdmin)
      toast.success(user.isAdmin ? 'دسترسی مدیریت برداشته شد' : 'دسترسی مدیریت داده شد')
      load()
    } catch (err) {
      toast.error(extractMessage(err))
    }
  }

  return (
    <div>
      <h2 className="font-display text-2xl text-mist">کاربران</h2>
      <p className="mt-1 text-xs text-mist/50">{toFa(users?.length ?? 0)} کاربر ثبت‌نام‌شده</p>

      <div className="mt-6 overflow-hidden rounded-3xl border border-mist/10">
        {!users ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : users.length === 0 ? (
          <p className="py-16 text-center text-sm text-mist/40">کاربری ثبت نشده است.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-right text-sm">
              <thead>
                <tr className="border-b border-mist/10 bg-ink-light/60 text-xs text-mist/50">
                  <th className="px-5 py-4 font-medium">کاربر</th>
                  <th className="px-5 py-4 font-medium">تماس</th>
                  <th className="px-5 py-4 font-medium">تاریخ عضویت</th>
                  <th className="px-5 py-4 font-medium">نقش</th>
                  <th className="px-5 py-4 font-medium">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mist/5">
                {users.map((u) => (
                  <tr key={u._id} className="transition-colors hover:bg-mist/5">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-saffron/15 font-display text-sm text-saffron">
                          {u.name?.[0] || '؟'}
                        </span>
                        <span className="font-bold text-mist">{u.name || 'بدون نام'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-mist/60">
                      <p dir="ltr" className="text-right">{u.email}</p>
                      {u.phone && <p dir="ltr" className="text-xs text-mist/40">{u.phone}</p>}
                    </td>
                    <td className="px-5 py-4 text-mist/60">{formatDate(u.createdAt)}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${u.isAdmin ? 'bg-saffron/15 text-saffron' : 'bg-mist/10 text-mist/40'}`}>
                        {u.isAdmin ? 'مدیر' : 'مشتری'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => toggleAdmin(u)}
                        disabled={u.isAdmin && users.filter((x) => x.isAdmin).length === 1}
                        className="rounded-full border border-mist/20 px-3 py-1.5 text-xs text-mist/80 transition-colors hover:border-saffron hover:text-saffron disabled:opacity-30"
                      >
                        {u.isAdmin ? 'برداشتن مدیریت' : 'دادن دسترسی مدیریت'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
