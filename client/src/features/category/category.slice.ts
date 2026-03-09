import { createSlice } from '@reduxjs/toolkit';
import type { ICategory } from '../../types';
import { categoryThunks } from './category.thunk';

interface CategoryState {
	categories: ICategory[];
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	error: string | null;
}

const initialState: CategoryState = {
	categories: [],
	status: 'idle',
	error: null,
};

export const categorySlice = createSlice({
	name: 'cateogry',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			// get all categories
			.addCase(categoryThunks.getAllCategories.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(categoryThunks.getAllCategories.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.categories = action.payload;
			})

			.addCase(categoryThunks.getAllCategories.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as string;
			});
	},
});
