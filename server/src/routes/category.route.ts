import { Router } from 'express';
import { categoryController } from '../controllers/category.controller.js';

const route = Router();

route.get('/', categoryController.getAllCateogries);

export default route;
