import { Router } from 'express'
import { subscribe, contact, shippingSettings } from '../controllers/miscController.js'

const router = Router()

router.post('/newsletter', subscribe)
router.post('/contact', contact)
router.get('/shipping', shippingSettings)

export default router
