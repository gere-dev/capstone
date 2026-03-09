import type { RootState } from '../../store';

export const selectOrders = (state: RootState) => state.order;
export const selectSelectedOrder = (state: RootState) => state.order.selectedOrder;
