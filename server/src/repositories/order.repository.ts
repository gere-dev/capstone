import { Op } from 'sequelize';
import { Order, Product } from '../models/index.js';
import { orderBaseSchema, orderSchema, type TOrder, type TOrderBase } from '../schema/order.schema.js';
import { BaseRepository, type IBaseRepository } from './base.repository.js';
export interface IOrderRepository extends IBaseRepository<TOrder, TOrderBase> {}

class OrderRepository extends BaseRepository<TOrder, TOrderBase, Order> implements IOrderRepository {
	constructor() {
		super(Order, orderSchema, orderBaseSchema);
	}

	protected format(record: any): TOrder {
		return {
			id: record.id,
			name: record.name,
			phone: record.phone,
			address: record.address,
			purchaseDate: new Date(record.purchaseDate),
			productId: record?.Product?.id,
			productName: record.productName,
			quantity: record.quantity,
			availableQuantity: record?.Product?.quantity ? record.Product.quantity : 0,
			productPrice: record.productPrice,
			sku: record.sku,
			status: record.status,
		};
	}

	async search(userId: string, term: string): Promise<TOrder[]> {
		if (!term || term.trim() === '') {
			return this.findAll(userId);
		}
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
			include: [Product],
			raw: true,
			nest: true,
		};
	}
}

export const orderRepo = new OrderRepository();
