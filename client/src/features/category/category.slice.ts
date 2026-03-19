import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { categoryThunks } from './category.thunk';
import type { TCategory } from '../../schemas';
import type { ICategoryPaginated } from '../../types';

interface CategoryState {
	categories: TCategory[];
	paginatedCategories: TCategory[];
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	error: string | null;
	selectedCategory: TCategory;
	pagination: {
		currentPage: number;
		itemsPerPage: 10 | 25 | 50;
		totalPages: number;
		totalItems: number;
	};
}

const initialState: CategoryState = {
	categories: [],
	status: 'idle',
	error: null,
	paginatedCategories: [],
	selectedCategory: {
		id: '',
		name: '',
		description: '',
	},
	pagination: {
		currentPage: 1,
		itemsPerPage: 10,
		totalPages: 1,
		totalItems: 0,
	},
};

export const categorySlice = createSlice({
	name: 'category',
	initialState,
	reducers: {
		clearSelectedCategory: (state) => {
			state.selectedCategory = { id: '', name: '', description: '' };
		},
		setCategoryCurrentPage: (state, action: PayloadAction<number>) => {
			state.pagination.currentPage = action.payload;
		},
		setCategoryPerPage: (state, action: PayloadAction<10 | 25 | 50>) => {
			state.pagination.itemsPerPage = action.payload;
		},
	},
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
			})
			// get paginated categories

			.addCase(categoryThunks.getPaginatedCategories.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(categoryThunks.getPaginatedCategories.fulfilled, (state, action) => {
				state.status = 'succeeded';

				const { data, pagination } = action.payload;
				state.paginatedCategories = data;
				state.pagination = pagination;
			})

			.addCase(categoryThunks.getPaginatedCategories.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as string;
			})

			// create category
			.addCase(categoryThunks.createCategory.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(categoryThunks.createCategory.fulfilled, (state, action) => {
				state.status = 'succeeded';
				const category = action.payload;

				state.paginatedCategories.unshift(category);
			})
			.addCase(categoryThunks.createCategory.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as string;
			})
			// update category
			.addCase(categoryThunks.updateCategory.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(categoryThunks.updateCategory.fulfilled, (state, action) => {
				state.status = 'succeeded';
				const { id, category } = action.payload;

				const categoryIndex = state.paginatedCategories.findIndex((category) => category.id === id);
				if (categoryIndex !== -1) {
					state.paginatedCategories[categoryIndex] = category;
				}
			})
			.addCase(categoryThunks.updateCategory.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as string;
			})
			// get category by id
			.addCase(categoryThunks.getCategoryById.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(categoryThunks.getCategoryById.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.selectedCategory = action.payload;
			})
			.addCase(categoryThunks.getCategoryById.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as string;
			})

			// delete category
			.addCase(categoryThunks.deleteCategory.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(categoryThunks.deleteCategory.fulfilled, (state, action) => {
				state.status = 'succeeded';
				const id = action.payload;
				const categoryIndex = state.paginatedCategories.findIndex((category) => category.id === id);
				if (categoryIndex !== -1) {
					state.paginatedCategories.splice(categoryIndex, 1);
				}
			})
			.addCase(categoryThunks.deleteCategory.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as string;
			})

			// search by name
			.addCase(categoryThunks.searchCategory.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(categoryThunks.searchCategory.fulfilled, (state, action) => {
				state.status = 'succeeded';

				const categories = action.payload;
				console.log(categories);
				state.paginatedCategories = categories;
			})

			.addCase(categoryThunks.searchCategory.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as string;
			});
	},
});

export const { clearSelectedCategory, setCategoryCurrentPage, setCategoryPerPage } = categorySlice.actions;
