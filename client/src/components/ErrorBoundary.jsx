import { Component } from 'react'
import { Link } from 'react-router-dom'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
          <span className="text-5xl" aria-hidden="true">🍂</span>
          <h1 className="font-display text-2xl text-mist">چیزی خراب شد</h1>
          <p className="max-w-md text-sm leading-7 text-mist/60">
            یک خطای پیش‌بینی‌نشده رخ داد. صفحه را دوباره بارگذاری کنید یا به صفحهٔ نخست برگردید.
          </p>
          <Link to="/" className="btn-gold mt-2">بازگشت به خانه</Link>
        </div>
      )
    }
    return this.props.children
  }
}
