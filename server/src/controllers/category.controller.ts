import { categoryRepo, type ICategoryRepository } from '../repositories/category.repository.js';
import { type TCategory, type TCategoryBase } from '../schema/category.schema.js';

import { BaseController } from './base.controller.js';

export class CategoryController extends BaseController<TCategory, TCategoryBase, ICategoryRepository> {
	constructor() {
		super(categoryRepo);
	}
}

export const categoryController = new CategoryController();
