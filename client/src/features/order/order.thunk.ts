import { createAsyncThunk } from '@reduxjs/toolkit';
import type { IOrderPaginated, TOrder } from '../../schemas';
import { orderService } from '../../services/order.service';
import { isAxiosError } from 'axios';

const getAllOrders = createAsyncThunk<IOrderPaginated, { currentPage: number; limit: number }, { rejectValue: string }>(
	'order/getAllOrders',
	async ({ currentPage, limit }, { rejectWithValue }) => {
		try {
			return await orderService.getAllOrders(currentPage, limit);
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				return rejectWithValue(error.response.data);
			} else {
				return rejectWithValue('UnKnown error occured while fetching orders.');
			}
		}
	},
);

const searchOrder = createAsyncThunk<TOrder[], string, { rejectValue: string }>(
	'order/searchOrder',
	async (term, { rejectWithValue }) => {
		try {
			return await orderService.searchOrder(term);
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				return rejectWithValue(error.response.data);
			} else {
				return rejectWithValue('UnKnown error occured while searching for order');
			}
		}
	},
);

const createOrder = createAsyncThunk<TOrder, Omit<TOrder, 'id'>, { rejectValue: string }>(
	'order/createOrder',
	async (order, { rejectWithValue }) => {
		try {
			return await orderService.createOrder(order);
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				return rejectWithValue(error.response.data);
			} else {
				return rejectWithValue('UnKnown error occured while creating order');
			}
		}
	},
);

const updateOrder = createAsyncThunk<
	{ id: string; order: TOrder },
	{ id: string; order: TOrder },
	{ rejectValue: string }
>('order/updateOrder', async ({ id, order }, { rejectWithValue }) => {
	try {
		return await orderService.updateOrder({ id, order });
	} catch (error) {
		if (isAxiosError(error) && error.response) {
			return rejectWithValue(error.response.data);
		} else {
			return rejectWithValue('UnKnown error occured while updating order');
		}
	}
});

const getOrderById = createAsyncThunk<TOrder, string, { rejectValue: string }>(
	'order/getById',
	async (id, { rejectWithValue }) => {
		try {
			return await orderService.getOrderById(id);
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				return rejectWithValue(error.response.data);
			} else {
				return rejectWithValue('UnKnown error occured while getting order by id');
			}
		}
	},
);

export const orderThunk = { getAllOrders, searchOrder, createOrder, updateOrder, getOrderById };
