import { createContext, useContext, useEffect, useState } from 'react'
import { authApi, extractMessage } from '../lib/api'
import { toast } from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    try {
      const { data } = await authApi.me()
      setUser(data.user)
    } catch {
      setUser(null)
    }
  }

  useEffect(() => {
    ;(async () => {
      await refresh()
      setLoading(false)
    })()
  }, [])

  const login = async (credentials) => {
    const { data } = await authApi.login(credentials)
    setUser(data.user)
    toast.success('خوش آمدید!')
    return data.user
  }

  const register = async (info) => {
    const { data } = await authApi.register(info)
    setUser(data.user)
    toast.success('حساب کاربری‌تان ساخته شد. خوش آمدید!')
    return data.user
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch {
      /* حتی اگر سرور خطا بدهد، وضعیت محلی را پاک می‌کنیم */
    }
    setUser(null)
    toast.success('تا دیدار دوباره')
  }

  const updateProfile = async (info) => {
    const { data } = await authApi.updateProfile(info)
    setUser(data.user)
    toast.success('پروفایل به‌روزرسانی شد')
    return data.user
  }

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, register, logout, updateProfile, refresh }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth باید داخل AuthProvider استفاده شود')
  return ctx
}

export const isAdmin = (user) => user?.role === 'admin'
