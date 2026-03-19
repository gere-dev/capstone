import { createAsyncThunk } from '@reduxjs/toolkit';
import { categoryService } from '../../services/category.service';
import { isAxiosError } from 'axios';
import type { ICategoryPaginated } from '../../types';
import type { TCategory } from '../../schemas';

export const getAllCategories = createAsyncThunk<TCategory[], void, { rejectValue: string }>(
	'category/getAll',
	async (_, { rejectWithValue }) => {
		try {
			const reponse = await categoryService.getAllCategories();
			return reponse;
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				return rejectWithValue(error.response.data);
			} else {
				return rejectWithValue('Unknown error occurred while getting categories');
			}
		}
	},
);

export const getPaginatedCategories = createAsyncThunk<
	ICategoryPaginated,
	{ currentPage: number; limit: number },
	{ rejectValue: string }
>('category/getPaginatedCategories', async ({ currentPage, limit }, { rejectWithValue }) => {
	try {
		const reponse = await categoryService.getPaginatedCategories(currentPage, limit);
		return reponse;
	} catch (error) {
		if (isAxiosError(error) && error.response) {
			return rejectWithValue(error.response.data);
		} else {
			return rejectWithValue('Unknown error occurred while getting categories');
		}
	}
});

const searchCategory = createAsyncThunk<TCategory[], string, { rejectValue: string }>(
	'category/search',
	async (term, { rejectWithValue }) => {
		try {
			return await categoryService.searchCategory(term);
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				return rejectWithValue(error.response.data);
			} else {
				return rejectWithValue('UnKnown error occured while searching for category');
			}
		}
	},
);

const createCategory = createAsyncThunk<TCategory, Omit<TCategory, 'id'>, { rejectValue: string }>(
	'category/create',
	async (category, { rejectWithValue }) => {
		try {
			return await categoryService.createCategory(category);
		} catch (error) {
			console.log(error);
			if (isAxiosError(error) && error.response) {
				return rejectWithValue(error.response.data);
			} else {
				return rejectWithValue('UnKnown error occured while creating category');
			}
		}
	},
);

const updateCategory = createAsyncThunk<
	{ id: string; category: TCategory },
	{ id: string; category: TCategory },
	{ rejectValue: string }
>('category/update', async ({ id, category }, { rejectWithValue }) => {
	try {
		return await categoryService.updateCategory({ id, category });
	} catch (error) {
		if (isAxiosError(error) && error.response) {
			return rejectWithValue(error.response.data);
		} else {
			return rejectWithValue('UnKnown error occured while updating category');
		}
	}
});

const getCategoryById = createAsyncThunk<TCategory, string, { rejectValue: string }>(
	'category/getById',
	async (id, { rejectWithValue }) => {
		try {
			return await categoryService.getCategoryById(id);
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				return rejectWithValue(error.response.data);
			} else {
				return rejectWithValue('UnKnown error occured while getting category by id');
			}
		}
	},
);

const deleteCategory = createAsyncThunk<string, string, { rejectValue: string }>(
	'category/delete',
	async (id: string, { rejectWithValue }) => {
		try {
			await categoryService.deleteCategory(id);
			return id;
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				return rejectWithValue(error.response.data);
			} else {
				return rejectWithValue('UnKnown error occured while deleting a category');
			}
		}
	},
);

export const categoryThunks = {
	getAllCategories,
	getPaginatedCategories,
	searchCategory,
	createCategory,
	updateCategory,
	getCategoryById,
	deleteCategory,
};
