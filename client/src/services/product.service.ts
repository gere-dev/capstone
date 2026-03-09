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
	product: IProduct;
}): Promise<{ id: string; product: IProduct }> => {
	const { data } = await privateInstance.put(`/product/${id}`, product);

	return { id, product: data };
};

const createProduct = async (product: IProduct): Promise<IProduct> => {
	const { data } = await privateInstance.post('/product', product);
	return data;
};

const deleteProduct = async (id: string): Promise<void> => {
	await privateInstance.delete(`/product/${id}`);
};

const getProductById = async (id: string): Promise<IProduct> => {
	const { data } = await privateInstance.get(`/product/${id}`);
	return data;
};

const searchProduct = async (term: string) => {
	const { data } = await privateInstance.get('/product/search', { params: { term } });

	return data;
};

export const productService = {
	getAllProducts,
	updateProduct,
	getProductById,
	createProduct,
	deleteProduct,
	searchProduct,
};
