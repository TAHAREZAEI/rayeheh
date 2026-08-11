import { Router } from 'express'
import { createOrder, verifyOrder, myOrders, getOrder } from '../controllers/orderController.js'
import { protect } from '../middlewares/auth.js'
import { orderLimiter } from '../middlewares/rateLimiter.js'

const router = Router()

router.post('/', orderLimiter, createOrder)
router.post('/verify/:ref', protect, verifyOrder)
router.get('/mine', protect, myOrders)
router.get('/:ref', getOrder)

export default router
