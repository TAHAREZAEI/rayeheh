import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { UiProvider } from './context/UiContext'
import { SettingsProvider } from './context/SettingsContext'

import ErrorBoundary from './components/ErrorBoundary'
import Header from './components/Header'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import SearchOverlay from './components/SearchOverlay'

import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Login from './pages/Login'
import Register from './pages/Register'
import Account from './pages/Account'
import Orders from './pages/Orders'
import About from './pages/About'
import Contact from './pages/Contact'
import Faq from './pages/Faq'
import Journal from './pages/Journal'

import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminProductForm from './pages/admin/AdminProductForm'
import AdminOrders from './pages/admin/AdminOrders'
import AdminMessages from './pages/admin/AdminMessages'
import AdminSubscribers from './pages/admin/AdminSubscribers'
import AdminUsers from './pages/admin/AdminUsers'

// عنوان تب را به‌ازای هر صفحه به‌روزرسانی می‌کند — برای ناوبری و صفحه‌خوان‌ها
const PAGE_TITLES = [
  ['/admin', 'پنل مدیریت'],
  ['/account', 'حساب کاربری'],
  ['/orders', 'سفارش‌های من'],
  ['/checkout', 'تسویه حساب'],
  ['/cart', 'سبد خرید'],
  ['/shop', 'فروشگاه'],
  ['/about', 'دربارهٔ ما'],
  ['/contact', 'تماس با ما'],
  ['/faq', 'سوالات پرتکرار'],
  ['/journal', 'مجلهٔ رایحه'],
  ['/login', 'ورود'],
  ['/register', 'ثبت‌نام'],
]

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  useEffect(() => {
    const pair = PAGE_TITLES.find(([p]) => pathname.startsWith(p))
    document.title = pair ? `${pair[1]} | رایحه` : 'رایحه | خانهٔ عطرهای ناب'
  }, [pathname])
  return null
}

function Shell({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <SearchOverlay />
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SettingsProvider>
          <CartProvider>
            <UiProvider>
              <BrowserRouter>
                <ScrollToTop />
                <Shell>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:slug" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order/success/:ref" element={<OrderSuccess />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/faq" element={<Faq />} />
                    <Route path="/journal" element={<Journal />} />

                    {/* پنل مدیریت */}
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="products" element={<AdminProducts />} />
                      <Route path="products/new" element={<AdminProductForm />} />
                      <Route path="products/:id" element={<AdminProductForm />} />
                      <Route path="orders" element={<AdminOrders />} />
                      <Route path="messages" element={<AdminMessages />} />
                      <Route path="subscribers" element={<AdminSubscribers />} />
                      <Route path="users" element={<AdminUsers />} />
                    </Route>

                    {/* 404 */}
                    <Route
                      path="*"
                      element={
                        <div className="mx-auto max-w-7xl px-4 py-24 text-center">
                          <h1 className="font-display text-6xl text-saffron">۴۰۴</h1>
                          <p className="mt-4 text-mist/60">این مسیر به هیچ رایحه‌ای نمی‌رسد.</p>
                          <a href="/" className="btn-gold mt-8 inline-block">بازگشت به خانه</a>
                        </div>
                      }
                    />
                  </Routes>
                </Shell>
              </BrowserRouter>
              <Toaster
                position="bottom-left"
                toastOptions={{
                  style: {
                    background: '#1A2118',
                    color: '#E9E4D6',
                    border: '1px solid rgba(200,162,75,0.3)',
                    fontFamily: 'Vazirmatn, sans-serif',
                    borderRadius: '1rem',
                  },
                  success: { iconTheme: { primary: '#C8A24B', secondary: '#10160F' } },
                }}
              />
            </UiProvider>
          </CartProvider>
        </SettingsProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}
