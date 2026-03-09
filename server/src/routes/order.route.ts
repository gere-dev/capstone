import { Router } from 'express';
import { orderController } from '../controllers/order.controller.js';

const router = Router();

router.get('/', orderController.getAllOrders);
router.get('/search', orderController.searchOrders);
router.post('/', orderController.createOrder);
router.put('/:orderId', orderController.updateOrder);
router.get('/:orderId', orderController.getOrderById);

export default router;
