import type { IOrderPaginated, TOrder } from '../schemas';
import { privateInstance } from './config.service';

const getAllOrders = async (currentPage: number, itemsPerPage: number): Promise<IOrderPaginated> => {
	const orders = await privateInstance.get('/order', {
		params: {
			currentPage,
			itemsPerPage,
		},
	});

	return orders.data;
};

const searchOrder = async (term: string) => {
	const { data } = await privateInstance.get('/order/search', { params: { term } });

	return data;
};

const createOrder = async (order: TOrder): Promise<TOrder> => {
	const { data } = await privateInstance.post('/order', order);
	return data;
};

const updateOrder = async ({ id, order }: { id: string; order: TOrder }): Promise<{ id: string; order: TOrder }> => {
	const { data } = await privateInstance.put(`/order/${id}`, order);

	return { id, order: data };
};

const getOrderById = async (id: string): Promise<TOrder> => {
	const { data } = await privateInstance.get(`/order/${id}`);
	return data;
};

export const orderService = { getAllOrders, searchOrder, createOrder, updateOrder, getOrderById };
