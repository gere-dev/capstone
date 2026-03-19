import { createAsyncThunk } from '@reduxjs/toolkit';
import type { IProductPaginated } from '../../types';
import { isAxiosError } from 'axios';
import { productService } from '../../services/product.service';
import type { EProductStatus } from '../../enums';
import type { TProduct, TProductBase } from '../../schemas';

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

const createProduct = createAsyncThunk<TProduct, TProductBase, { rejectValue: string }>(
	'product/createProduct',
	async (product: TProductBase, { rejectWithValue }) => {
		try {
			return await productService.createProduct(product);
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				console.log(error.response.data.errors);
				return rejectWithValue(error.response.data);
			} else {
				return rejectWithValue('UnKnown error occured while creating product');
			}
		}
	},
);

const updateProduct = createAsyncThunk<
	{ id: string; product: TProduct },
	{ id: string; product: TProduct },
	{ rejectValue: string }
>('product/updateProduct', async ({ id, product }, { rejectWithValue }) => {
	try {
		return await productService.updateProduct({ id, product });
	} catch (error) {
		if (isAxiosError(error) && error.response) {
			return rejectWithValue(error.response.data);
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
				return rejectWithValue(error.response.data);
			} else {
				return rejectWithValue('UnKnown error occured while deleting a product');
			}
		}
	},
);

const getProductById = createAsyncThunk<TProduct, string, { rejectValue: string }>(
	'product/getById',
	async (id, { rejectWithValue }) => {
		try {
			return await productService.getProductById(id);
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				return rejectWithValue(error.response.data);
			} else {
				return rejectWithValue('UnKnown error occured while getting product by id');
			}
		}
	},
);
const searchProduct = createAsyncThunk<TProduct[], string, { rejectValue: string }>(
	'product/searchProduct',
	async (term, { rejectWithValue }) => {
		try {
			return await productService.searchProduct(term);
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				return rejectWithValue(error.response.data);
			} else {
				return rejectWithValue('UnKnown error occured while searching for product');
			}
		}
	},
);
const updateQuantityProduct = createAsyncThunk<
	{ productId: string; productQuantity: number; status: EProductStatus },
	{ productId: string; productQuantity: number },
	{ rejectValue: string }
>('product/productQuantity', async ({ productId, productQuantity }, { rejectWithValue }) => {
	try {
		return await productService.updateProductQuantity(productId, productQuantity);
	} catch (error) {
		if (isAxiosError(error) && error.response) {
			return rejectWithValue(error.response.data);
		} else {
			return rejectWithValue('UnKnown error occured updating quantity');
		}
	}
});

const getStockLevel = createAsyncThunk<
	{ title: string; generatedAt: Date; products: TProduct[] },
	'low' | 'out',
	{ rejectValue: string }
>('product/getStockLevel', async (typeReport, { rejectWithValue }) => {
	try {
		return await productService.getStockReport(typeReport);
	} catch (error) {
		if (isAxiosError(error) && error.response) {
			return rejectWithValue(error.response.data);
		} else {
			return rejectWithValue('UnKnown error occured while getting product by id');
		}
	}
});

export const productThunk = {
	getAllProduct,
	updateProduct,
	getProductById,
	createProduct,
	deleteProduct,
	searchProduct,
	updateQuantityProduct,
	getStockLevel,
};
