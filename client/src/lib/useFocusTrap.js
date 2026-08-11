import { useEffect, useRef } from 'react'

/**
 * مدیریت فوکوس برای دیالوگ‌ها:
 * - با باز شدن، فوکوس را داخل دیالوگ می‌برد و عنصرِ قبلی را برای بازگشت ذخیره می‌کند
 * - Tab/Shift+Tab را داخل دیالوگ قفل می‌کند
 * - Escape دیالوگ را می‌بندد
 * - با بسته شدن، فوکوس به عنصرِ مبدأ برمی‌گردد
 */
export function useFocusTrap(active, onClose) {
  const ref = useRef(null)
  const lastFocus = useRef(null)

  useEffect(() => {
    if (!active) return undefined
    lastFocus.current = document.activeElement
    const node = ref.current
    if (node) {
      node.focus({ preventScroll: true })
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose?.()
        return
      }
      if (e.key !== 'Tab' || !node) return
      const focusables = node.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      if (lastFocus.current && typeof lastFocus.current.focus === 'function') {
        lastFocus.current.focus({ preventScroll: true })
      }
    }
  }, [active, onClose])

  return ref
}