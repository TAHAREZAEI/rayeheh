import { Router } from 'express'
import { body } from 'express-validator'
import { listProducts, getProductBySlug, addReview } from '../controllers/productController.js'
import { protect } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import { validateObjectId } from '../middlewares/validateObjectId.js'

const router = Router()

router.get('/', listProducts)
router.get('/slug/:slug', getProductBySlug)

router.post(
  '/:id/reviews',
  protect,
  validateObjectId('id'),
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('امتیاز باید بین ۱ تا ۵ باشد'),
    body('comment').trim().isLength({ min: 3, max: 600 }).withMessage('نظر باید بین ۳ تا ۶۰۰ کاراکتر باشد'),
  ],
  validate,
  addReview
)

export default router
