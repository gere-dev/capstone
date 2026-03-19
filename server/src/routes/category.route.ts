import { Router } from 'express';
import { categoryController } from '../controllers/category.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', categoryController.getAll);
router.get('/paginated', categoryController.getPaginated);
router.get('/search', categoryController.search);
router.post('/', categoryController.create);
router.put('/:id', authMiddleware.validateParams(['id']), categoryController.update);
router.get('/:id', authMiddleware.validateParams(['id']), categoryController.getById);
router.delete('/:id', authMiddleware.validateParams(['id']), categoryController.delete);

export default router;
