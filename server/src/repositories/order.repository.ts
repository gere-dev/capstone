import { Op } from 'sequelize';
import { OrderModel, ProductModel } from '../models/index.js';
import type { OrderInstance } from '../models/Order.js';
import { orderBaseSchema, orderSchema, type TOrder, type TOrderBase } from '../schema/order.schema.js';
import { BaseRepository } from './base.repository.js';

export class OrderRepository extends BaseRepository<TOrder, TOrderBase, OrderInstance> {
	constructor() {
		super(OrderModel, orderSchema, orderBaseSchema);
	}

	protected format(record: any): TOrder {
		return {
			id: record.id,
			name: record.name,
			phone: record.phone,
			address: record.address,
			purchaseDate: new Date(record.purchaseDate),
			productId: record.Product.id,
			productName: record.productName,
			quantity: record.quantity,
			availableQuantity: record.Product.quantity,
			productPrice: record.productPrice,
			sku: record.sku,
			status: record.status,
		};
	}

	async search(userId: string, term: string): Promise<TOrder[]> {
		const records = await this.model.findAll({
			where: {
				userId,
				[Op.or]: [
					{ name: { [Op.iLike]: `%${term}%` } },
					{ sku: { [Op.iLike]: `%${term}%` } },
					{ phone: { [Op.iLike]: `%${term}%` } },
					{ address: { [Op.iLike]: `%${term}%` } },
				],
			},
			raw: true,
			nest: true,
		});

		return records.map((rec) => this.format(rec));
	}

	protected getQueryOptions(userId: string, id?: string) {
		return {
			where: this.getWhereIds(userId, id),
			include: [ProductModel],
			raw: true,
			nest: true,
		};
	}
}
