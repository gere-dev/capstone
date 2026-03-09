import { createSlice } from '@reduxjs/toolkit';
import type { IProduct } from '../../types';
import { productThunk } from './product.thunk';

interface ProductState {
	products: IProduct[];
	selectedProduct: IProduct;
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	error: string | null;
	pagination: {
		currentPage: number;
		itemsPerPage: 10 | 25 | 50;
		totalPages: number;
		totalItems: number;
	};
}

const initialState: ProductState = {
	products: [],
	status: 'idle',
	error: null,
	selectedProduct: {} as IProduct,
	pagination: {
		currentPage: 1,
		itemsPerPage: 10,
		totalPages: 1,
		totalItems: 0,
	},
};

export const productSlice = createSlice({
	name: 'product',
	initialState,
	reducers: {
		// clear selected product
		clearSelectedProduct: (state) => {
			state.selectedProduct = {} as IProduct;
		},

		setProductsPerPage: (state, action) => {
			state.pagination.itemsPerPage = action.payload;
		},
		setProductCurrentPage: (state, action) => {
			state.pagination.currentPage = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			// get all products
			.addCase(productThunk.getAllProduct.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(productThunk.getAllProduct.fulfilled, (state, action) => {
				state.status = 'succeeded';
				const { data, pagination } = action.payload;
				state.products = data;
				state.pagination = pagination;
			})

			.addCase(productThunk.getAllProduct.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as string;
			})
			// create product
			.addCase(productThunk.createProduct.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(productThunk.createProduct.fulfilled, (state, action) => {
				state.status = 'succeeded';
				const product = action.payload;
				state.products.push(product);
			})
			.addCase(productThunk.createProduct.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as string;
			})

			// update product by id
			.addCase(productThunk.updateProduct.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(productThunk.updateProduct.fulfilled, (state, action) => {
				state.status = 'succeeded';
				const { id, product } = action.payload;

				const productIndex = state.products.findIndex((product) => product.id === id);
				if (productIndex !== -1) {
					state.products[productIndex] = product;
				}
			})
			.addCase(productThunk.updateProduct.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as string;
			})
			// delete product
			.addCase(productThunk.deleteProduct.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(productThunk.deleteProduct.fulfilled, (state, action) => {
				state.status = 'succeeded';
				const id = action.payload;
				const productIndex = state.products.findIndex((product) => product.id === id);
				if (productIndex !== -1) {
					state.products.splice(productIndex, 1);
				}
			})
			.addCase(productThunk.deleteProduct.rejected, (state) => {
				state.status = 'failed';
			})

			// get product by id
			.addCase(productThunk.getProductById.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(productThunk.getProductById.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.selectedProduct = action.payload;
			})
			.addCase(productThunk.getProductById.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as string;
			})
			// search product
			.addCase(productThunk.searchProduct.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(productThunk.searchProduct.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.products = action.payload;
			})

			.addCase(productThunk.searchProduct.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as string;
			});
	},
});

export const { clearSelectedProduct, setProductCurrentPage, setProductsPerPage } = productSlice.actions;
