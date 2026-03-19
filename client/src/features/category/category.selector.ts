import { type RootState } from '../../store';

export const selectAllCategories = (state: RootState) => state.categories;
export const selectPaginatedCategories = (state: RootState) => state.categories.paginatedCategories;
export const selectCategoryPagnation = (state: RootState) => state.categories.pagination;
export const selectSelectedCategory = (state: RootState) => state.categories.selectedCategory;
