import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { toast } from 'react-hot-toast'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

const STORAGE_KEY = 'rayeheh_cart'

function init() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const existing = state.find(
        (i) => i.id === action.item.id && i.edition === action.item.edition
      )
      if (existing) {
        return state.map((i) =>
          i.id === action.item.id && i.edition === action.item.edition
            ? { ...i, qty: Math.min(i.qty + action.item.qty, 5) }
            : i
        )
      }
      return [...state, action.item]
    }
    case 'setQty': {
      return state
        .map((i) => (i.key === action.key ? { ...i, qty: Math.max(1, Math.min(action.qty, 5)) } : i))
        .filter((i) => i.qty > 0)
    }
    case 'remove':
      return state.filter((i) => i.key !== action.key)
    case 'clear':
      return []
    case 'sync':
      return action.items
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, undefined, init)
  const { user } = useAuth()

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const totals = useMemo(() => {
    const count = items.reduce((s, i) => s + i.qty, 0)
    const amount = items.reduce((s, i) => s + i.price * i.qty, 0)
    return { count, amount }
  }, [items])

  const addItem = (item, { silent = false } = {}) => {
    dispatch({ type: 'add', item })
    if (!silent) toast.success('به سبد اضافه شد')
  }

  const setQty = (key, qty) => dispatch({ type: 'setQty', key, qty })
  const removeItem = (key) => {
    dispatch({ type: 'remove', key })
    toast.success('از سبد حذف شد')
  }
  const clear = () => dispatch({ type: 'clear' })

  // بعد از ورود، سبد محلی را با حساب کاربری همگام می‌کنیم (ادغام با سبد سرور)
  const sync = (serverItems) => {
    if (!serverItems) return
    const merged = [...serverItems]
    for (const local of items) {
      const hit = merged.find((s) => s.product?.toString?.() === local.id)
      if (hit) hit.qty = Math.min(hit.qty + local.qty, 5)
      else merged.push(local)
    }
    dispatch({ type: 'sync', items: merged })
  }

  return (
    <CartContext.Provider
      value={{ items, ...totals, addItem, setQty, removeItem, clear, sync }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart باید داخل CartProvider استفاده شود')
  return ctx
}
