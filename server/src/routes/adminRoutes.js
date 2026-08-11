import { Router } from 'express'
import {
  stats,
  adminListProducts,
  adminGetProduct,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminListOrders,
  adminUpdateOrder,
  adminDeleteOrder,
  adminListMessages,
  adminDeleteMessage,
  adminListSubscribers,
  adminDeleteSubscriber,
  adminListUsers,
  adminSetUserRole,
  adminListCategories,
} from '../controllers/adminController.js'
import { protect, adminOnly } from '../middlewares/auth.js'
import { validateObjectId } from '../middlewares/validateObjectId.js'

const router = Router()

// همهٔ مسیرهای اینجا محافظت‌شده‌اند: ابتدا احراز هویت، سپس بررسی نقش مدیر
router.use(protect, adminOnly)

router.get('/stats', stats)
router.get('/categories', adminListCategories)

router.get('/products', adminListProducts)
router.get('/products/:id', validateObjectId('id'), adminGetProduct)
router.post('/products', adminCreateProduct)
router.put('/products/:id', validateObjectId('id'), adminUpdateProduct)
router.delete('/products/:id', validateObjectId('id'), adminDeleteProduct)

router.get('/orders', adminListOrders)
router.put('/orders/:id', validateObjectId('id'), adminUpdateOrder)
router.delete('/orders/:id', validateObjectId('id'), adminDeleteOrder)

router.get('/messages', adminListMessages)
router.delete('/messages/:id', validateObjectId('id'), adminDeleteMessage)

router.get('/subscribers', adminListSubscribers)
router.delete('/subscribers/:id', validateObjectId('id'), adminDeleteSubscriber)

router.get('/users', adminListUsers)
router.put('/users/:id', validateObjectId('id'), adminSetUserRole)

export default router
