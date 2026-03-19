import type { TCategory } from '../schemas';
import type { ICategoryPaginated } from '../types';
import { privateInstance } from './config.service';

const getAllCategories = async (): Promise<TCategory[]> => {
	const categories = await privateInstance.get('/category');
	return categories.data;
};

const getPaginatedCategories = async (currentPage: number, itemsPerPage: number): Promise<ICategoryPaginated> => {
	const categories = await privateInstance.get('/category/paginated', {
		params: {
			currentPage,
			itemsPerPage,
		},
	});
	return categories.data;
};

const searchCategory = async (term: string): Promise<TCategory[]> => {
	const { data } = await privateInstance.get('/category/search', { params: { term } });

	return data;
};

const createCategory = async (category: Omit<TCategory, 'id'>): Promise<TCategory> => {
	const { data } = await privateInstance.post('/category', category);
	return data;
};

const updateCategory = async ({
	id,
	category,
}: {
	id: string;
	category: TCategory;
}): Promise<{ id: string; category: TCategory }> => {
	const { data } = await privateInstance.put(`/category/${id}`, category);

	return { id, category: data };
};

const getCategoryById = async (id: string): Promise<TCategory> => {
	const { data } = await privateInstance.get(`/category/${id}`);
	return data;
};

const deleteCategory = async (id: string): Promise<void> => {
	await privateInstance.delete(`/category/${id}`);
};

export const categoryService = {
	getAllCategories,
	searchCategory,
	createCategory,
	updateCategory,
	getCategoryById,
	deleteCategory,
	getPaginatedCategories,
};
