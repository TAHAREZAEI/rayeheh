import { useFocusTrap } from '../lib/useFocusTrap'

/**
 * دیالوگ تأیید حذف — با فوکوس‌ترپ، خروج با Escape و برگرداندن فوکوس
 */
export default function ConfirmDialog({ open, title, body, busy = false, onCancel, onConfirm }) {
  const ref = useFocusTrap(open, onCancel)
  if (!open) return null

  return (
    <div ref={ref} tabIndex={-1} className="fixed inset-0 z-50 flex items-center justify-center p-4 outline-none" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-black/70 animate-fade-in" onClick={busy ? undefined : onCancel} />
      <div className="relative w-full max-w-sm rounded-3xl border border-mist/10 bg-ink-light p-8 text-center animate-scale-in">
        <span className="text-4xl" aria-hidden="true">🗑️</span>
        <h3 className="mt-4 font-display text-xl text-mist">{title}</h3>
        {body && <p className="mt-2 text-sm leading-7 text-mist/60">{body}</p>}
        <div className="mt-6 flex gap-3">
          <button type="button" disabled={busy} className="btn-outline flex-1" onClick={onCancel}>
            انصراف
          </button>
          <button type="button" disabled={busy} className="btn-gold flex-1 !bg-rosewood !text-paper hover:!bg-rosewood-dark" onClick={onConfirm}>
            {busy ? '...' : 'حذف کن'}
          </button>
        </div>
      </div>
    </div>
  )
}