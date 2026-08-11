import { ApiError } from '../utils/apiError.js'

/** مدیریت متمرکز خطاها */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  let status = err.statusCode || 500
  let message = err.message || 'خطای داخلی سرور'
  let errors = err.errors || []

  // خطاهای معروف mongoose
  if (err.name === 'ValidationError') {
    status = 400
    message = 'اطلاعات واردشده معتبر نیست'
    errors = Object.values(err.errors).map((e) => ({ msg: e.message }))
  } else if (err.code === 11000) {
    status = 400
    const field = Object.keys(err.keyValue || {})[0]
    message = `این مقدار تکراری است (${field})`
  } else if (err.name === 'CastError') {
    status = 400
    message = 'شناسهٔ نامعتبر است'
  } else if (err.name === 'MulterError') {
    status = 400
    message = 'خطا در آپلود فایل'
  }

  if (status >= 500) console.error('[error]', err)

  res.status(status).json({ message, ...(errors.length ? { errors } : {}) })
}

export function notFoundRoute(req, res) {
  res.status(404).json({ message: `مسیر ${req.originalUrl} یافت نشد` })
}
