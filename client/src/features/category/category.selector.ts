import { type RootState } from '../../store';

export const selectAllCategories = (state: RootState) => state.categories;
