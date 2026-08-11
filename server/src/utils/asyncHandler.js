/** بسته‌بندی کنترلرهای async — خطاها به middleware مرکزی ارسال می‌شوند */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)
