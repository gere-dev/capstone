import { Router } from 'express';
import { productController } from '../controllers/product.controller.js';

const router = Router();

router.get('/', productController.getAllProducts);
router.post('/', productController.createProduct);
router.put('/:productId', productController.updateProduct);
router.delete('/:productId', productController.deleteProduct);

router.get('/search', productController.searchProduct);
router.get('/:productId', productController.getProductById);

export default router;
