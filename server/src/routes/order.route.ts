import { Router } from 'express';
import { orderController } from '../controllers/order.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', orderController.getPaginated);
router.get('/search', orderController.search);
router.post('/', orderController.create);
router.put('/:id', authMiddleware.validateParams(['id']), orderController.update);
router.get('/:id', authMiddleware.validateParams(['id']), orderController.getById);

export default router;
