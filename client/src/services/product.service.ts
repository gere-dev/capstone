import type { EProductStatus } from '../enums';
import type { TProduct, TProductBase } from '../schemas';
import type { IProduct, IProductPaginated } from '../types';
import { privateInstance } from './config.service';

const getAllProducts = async (currentPage: number, itemsPerPage: number): Promise<IProductPaginated> => {
	const products = await privateInstance.get('/product', {
		params: {
			currentPage,
			itemsPerPage,
		},
	});

	return products.data;
};

const updateProduct = async ({
	id,
	product,
}: {
	id: string;
	product: TProduct;
}): Promise<{ id: string; product: TProduct }> => {
	const { data } = await privateInstance.put(`/product/${id}`, product);

	return { id, product: data };
};

const createProduct = async (product: TProductBase): Promise<TProduct> => {
	const { data } = await privateInstance.post('/product', product);
	return data;
};

const deleteProduct = async (id: string): Promise<void> => {
	await privateInstance.delete(`/product/${id}`);
};

const getProductById = async (id: string): Promise<TProduct> => {
	const { data } = await privateInstance.get(`/product/${id}`);
	return data;
};

const searchProduct = async (term: string): Promise<TProduct[]> => {
	const { data } = await privateInstance.get('/product/search', { params: { term } });

	return data;
};
const updateProductQuantity = async (
	productId: string,
	quantityChange: number,
): Promise<{ productId: string; productQuantity: number; status: EProductStatus }> => {
	const { data } = await privateInstance.post(`/product/${productId}/quantity-change`, { quantityChange });
	return data;
};
const getStockReport = async (
	typeReport: 'low' | 'out',
): Promise<{ title: string; generatedAt: Date; products: TProduct[] }> => {
	const { data } = await privateInstance.get('/product/stock-level', {
		params: {
			typeReport,
		},
	});
	return data;
};

export const productService = {
	getAllProducts,
	updateProduct,
	getProductById,
	createProduct,
	deleteProduct,
	searchProduct,
	updateProductQuantity,
	getStockReport,
};
