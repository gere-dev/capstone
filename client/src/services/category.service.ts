import type { ICategory } from '../types';
import { privateInstance } from './config.service';

const getAllCategories = async (): Promise<ICategory[]> => {
	const categories = await privateInstance.get('/category');
	return categories.data;
};

export const categoryService = {
	getAllCategories,
};
