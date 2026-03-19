import { Router } from 'express';
import authRoute from './auth.route.js';
import productRoute from './product.route.js';
import categoryRoute from './category.route.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import orderRoute from './order.route.js';
import supplierRoute from './supplier.route.js';

const router = Router();

router.use('/auth', authRoute);
router.use('/product', authMiddleware.protect, productRoute);
router.use('/category', authMiddleware.protect, categoryRoute);
router.use('/order', authMiddleware.protect, orderRoute);
router.use('/supplier', authMiddleware.protect, supplierRoute);

export default router;
