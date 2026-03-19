import { orderRepo, type IOrderRepository } from '../repositories/order.repository.js';

import { type TOrder, type TOrderBase } from '../schema/order.schema.js';
import { BaseController } from './base.controller.js';
class OrderController extends BaseController<TOrder, TOrderBase, IOrderRepository> {
	constructor() {
		super(orderRepo);
	}
}

export const orderController = new OrderController();
