import axios from 'axios'

const api = axios.create({ baseURL: '/api', withCredentials: true })

export function extractMessage(err, fallback = 'مشکلی پیش آمد؛ دوباره تلاش کنید.') {
  const data = err?.response?.data
  if (data?.message) return data.message
  if (data?.errors?.length) return data.errors[0].msg
  return err?.message === 'Network Error' ? 'اتصال به سرور برقرار نیست.' : fallback
}

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data),
  changePassword: (data) => api.put('/auth/password', data),
}

export const categoryApi = {
  list: () => api.get('/categories'),
}

export const productApi = {
  list: (params) => api.get('/products', { params }),
  featured: () => api.get('/products?featured=true&limit=8'),
  new: () => api.get('/products?sort=-createdAt&limit=4'),
  slug: (slug) => api.get(`/products/slug/${slug}`),
  id: (id) => api.get(`/products/${id}`),
  review: (id, data) => api.post(`/products/${id}/reviews`, data),
}

export const orderApi = {
  create: (data) => api.post('/orders', data),
  verify: (ref, data) => api.post(`/orders/verify/${ref}`, data),
  mine: () => api.get('/orders/mine'),
  id: (ref) => api.get(`/orders/${ref}`),
}

export const miscApi = {
  subscribe: (email) => api.post('/newsletter', { email }),
  contact: (data) => api.post('/contact', data),
  shipping: () => api.get('/shipping'),
}

export const adminApi = {
  stats: () => api.get('/admin/stats'),
  products: (params) => api.get('/admin/products', { params }),
  product: (id) => api.get(`/admin/products/${id}`),
  createProduct: (data) => api.post('/admin/products', data),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  orders: (params) => api.get('/admin/orders', { params }),
  updateOrder: (id, data) => api.put(`/admin/orders/${id}`, data),
  deleteOrder: (id) => api.delete(`/admin/orders/${id}`),
  messages: (params) => api.get('/admin/messages', { params }),
  deleteMessage: (id) => api.delete(`/admin/messages/${id}`),
  subscribers: (params) => api.get('/admin/subscribers', { params }),
  deleteSubscriber: (id) => api.delete(`/admin/subscribers/${id}`),
  users: (params) => api.get('/admin/users', { params }),
  setUserAdmin: (id, isAdmin) => api.put(`/admin/users/${id}`, { isAdmin }),
}

export default api
