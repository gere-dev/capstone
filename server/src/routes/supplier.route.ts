import { Router } from 'express';
const router = Router();
import { supplierController } from '../controllers/supplier.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

router.get('/', supplierController.getPaginated);
router.get('/search', supplierController.search);
router.post('/', supplierController.create);
router.put('/:id', authMiddleware.validateParams(['id']), supplierController.update);
router.get('/:id', authMiddleware.validateParams(['id']), supplierController.getById);
router.delete('/:id', authMiddleware.validateParams(['id']), supplierController.delete);
export default router;
