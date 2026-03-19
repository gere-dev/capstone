import type { RootState } from '../../store';

export const selectAllProducts = (state: RootState) => state.products.products;
export const selectPagination = (state: RootState) => state.products.pagination;
export const selectSelectedProduct = (state: RootState) => state.products.selectedProduct;
export const selectStockReport = (state: RootState) => state.products.stockReport;
