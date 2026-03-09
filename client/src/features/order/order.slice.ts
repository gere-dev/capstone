import { createSlice } from '@reduxjs/toolkit';
import type { TOrder } from '../../schemas';
import { orderThunk } from './order.thunk';

interface OrderState {
	orders: TOrder[];
	selectedOrder: TOrder;
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	error: string | null;
	pagination: {
		currentPage: number;
		itemsPerPage: 10 | 25 | 50;
		totalPages: number;
		totalItems: number;
	};
}

const initialState: OrderState = {
	orders: [],
	selectedOrder: {} as TOrder,
	status: 'idle',
	error: null,
	pagination: {
		currentPage: 1,
		itemsPerPage: 10,
		totalPages: 1,
		totalItems: 0,
	},
};

export const OrderSlice = createSlice({
	name: 'order',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			// get all orders
			.addCase(orderThunk.getAllOrders.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(orderThunk.getAllOrders.fulfilled, (state, action) => {
				state.status = 'succeeded';
				const { data, pagination } = action.payload;
				state.orders = data;
				state.pagination = pagination;
			})

			.addCase(orderThunk.getAllOrders.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as string;
			})

			// search order
			.addCase(orderThunk.searchOrder.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(orderThunk.searchOrder.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.orders = action.payload;
			})

			.addCase(orderThunk.searchOrder.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as string;
			})
			// create order
			.addCase(orderThunk.createOrder.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(orderThunk.createOrder.fulfilled, (state, action) => {
				state.status = 'succeeded';
				const order = action.payload;
				state.orders.push(order);
			})
			.addCase(orderThunk.createOrder.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as string;
			})

			// update order
			.addCase(orderThunk.updateOrder.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(orderThunk.updateOrder.fulfilled, (state, action) => {
				state.status = 'succeeded';
				const { id, order } = action.payload;

				const productIndex = state.orders.findIndex((order) => order.id === id);
				if (productIndex !== -1) {
					state.orders[productIndex] = order;
				}
			})
			.addCase(orderThunk.updateOrder.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as string;
			})

			// get order by id
			.addCase(orderThunk.getOrderById.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(orderThunk.getOrderById.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.selectedOrder = action.payload;
			})
			.addCase(orderThunk.getOrderById.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as string;
			});
	},
});
