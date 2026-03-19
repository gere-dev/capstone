import { Router } from 'express';
import { productController } from '../controllers/product.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();
router.get('/stock-level', productController.getStockReport);

router.get('/', productController.getPaginated);
router.post('/', productController.create);
router.put('/:id', authMiddleware.validateParams(['id']), productController.update);
router.delete('/:id', authMiddleware.validateParams(['id']), productController.delete);

router.get('/search', productController.search);
router.get('/:id', authMiddleware.validateParams(['id']), productController.getById);
router.post('/:id/quantity-change', authMiddleware.validateParams(['id']), productController.updateProductQuantity);

export default router;
