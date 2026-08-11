/** خطای قابل‌ارائه به کاربر — با کد وضعیت HTTP */
export class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message)
    this.statusCode = statusCode
    this.errors = errors
  }
}

export const notFound = (message = 'موردی پیدا نشد') => new ApiError(404, message)
export const badRequest = (message = 'درخواست نامعتبر است') => new ApiError(400, message)
export const unauthorized = (message = 'ابتدا وارد شوید') => new ApiError(401, message)
export const forbidden = (message = 'دسترسی مجاز نیست') => new ApiError(403, message)
