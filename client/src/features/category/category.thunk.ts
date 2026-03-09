import { createAsyncThunk } from '@reduxjs/toolkit';
import { categoryService } from '../../services/category.service';
import { isAxiosError } from 'axios';
import type { ICategory } from '../../types';

export const getAllCategories = createAsyncThunk<ICategory[], void, { rejectValue: string }>(
	'category/getAll',
	async (_, { rejectWithValue }) => {
		try {
			const reponse = await categoryService.getAllCategories();
			return reponse;
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				return rejectWithValue(error.response.data.error);
			} else {
				return rejectWithValue('Unknown error occurred while getting categories');
			}
		}
	},
);

export const categoryThunks = { getAllCategories };
