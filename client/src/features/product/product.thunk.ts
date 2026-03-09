import { createAsyncThunk } from '@reduxjs/toolkit';
import type { IProduct, IProductPaginated } from '../../types';
import { isAxiosError } from 'axios';
import { productService } from '../../services/product.service';

const getAllProduct = createAsyncThunk<
	IProductPaginated,
	{ currentPage: number; limit: number },
	{ rejectValue: string }
>('product/getAllProducts', async ({ currentPage, limit }, { rejectWithValue }) => {
	try {
		return await productService.getAllProducts(currentPage, limit);
	} catch (error) {
		if (isAxiosError(error) && error.response) {
			return rejectWithValue(error.message);
		} else {
			return rejectWithValue('UnKnown error occured while fetching products.');
		}
	}
});

const createProduct = createAsyncThunk<IProduct, IProduct, { rejectValue: string }>(
	'product/createProduct',
	async (product: IProduct, { rejectWithValue }) => {
		try {
			return await productService.createProduct(product);
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				return rejectWithValue(error.message || error.response.data?.message);
			} else {
				return rejectWithValue('UnKnown error occured while creating product');
			}
		}
	},
);

const updateProduct = createAsyncThunk<
	{ id: string; product: IProduct },
	{ id: string; product: IProduct },
	{ rejectValue: string }
>('product/updateProduct', async ({ id, product }, { rejectWithValue }) => {
	try {
		return await productService.updateProduct({ id, product });
	} catch (error) {
		if (isAxiosError(error) && error.response) {
			return rejectWithValue(error.message);
		} else {
			return rejectWithValue('UnKnown error occured while updating product');
		}
	}
});

const deleteProduct = createAsyncThunk<string, string, { rejectValue: string }>(
	'product/delete',
	async (id: string, { rejectWithValue }) => {
		try {
			await productService.deleteProduct(id);
			return id;
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				return rejectWithValue(error.message);
			} else {
				return rejectWithValue('UnKnown error occured while deleting a product');
			}
		}
	},
);

const getProductById = createAsyncThunk<IProduct, string, { rejectValue: string }>(
	'product/getById',
	async (id, { rejectWithValue }) => {
		try {
			return await productService.getProductById(id);
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				return rejectWithValue(error.message);
			} else {
				return rejectWithValue('UnKnown error occured while getting product by id');
			}
		}
	},
);
const searchProduct = createAsyncThunk<IProduct[], string, { rejectValue: string }>(
	'product/searchProduct',
	async (term, { rejectWithValue }) => {
		try {
			return await productService.searchProduct(term);
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				return rejectWithValue(error.message);
			} else {
				return rejectWithValue('UnKnown error occured while searching for product');
			}
		}
	},
);

export const productThunk = {
	getAllProduct,
	updateProduct,
	getProductById,
	createProduct,
	deleteProduct,
	searchProduct,
};
