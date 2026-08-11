import Category from '../models/Category.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { notFound } from '../utils/apiError.js'

export const listCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ order: 1, name: 1 })
  const publicList = await Promise.all(categories.map((c) => c.toPublic()))
  res.json({ categories: publicList })
})

export const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug })
  if (!category) throw notFound('دسته‌بندی یافت نشد')
  res.json({ category: await category.toPublic() })
})
