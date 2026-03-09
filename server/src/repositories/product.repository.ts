import { ProductModel, CategoryModel } from '../models/index.js';
import type { ProductAttributes, ProductInstance } from '../models/Product.js';
import { productBaseSchema, productSchema, type TProduct, type TProductBase } from '../schema/product.schema.js';
import { Op, Sequelize } from 'sequelize';
import z from 'zod';
import { BaseRepository } from './base.repository.js';

export class ProductRepository extends BaseRepository<TProduct, TProductBase, ProductInstance> {
	constructor() {
		super(ProductModel, productSchema, productBaseSchema);
	}

	private getStockStatus(qty: number): string {
		if (qty <= 0) return 'Out of Stock';
		if (qty <= 5) return 'Low Stock';
		return 'In Stock';
	}

	protected format(record: any): TProduct {
		return {
			id: record.id,
			name: record.name,
			price: record.price,
			quantity: record.quantity,
			sku: record.sku,
			description: record?.description,
			categoryId: record.categoryId,
			category: record.Category.name || '',
			status: this.getStockStatus(record.quantity) as any,
		};
	}

	protected getQueryOptions(userId: string, id?: string) {
		return {
			where: this.getWhereIds(userId, id),
			include: [CategoryModel],
			raw: true,
			nest: true,
		};
	}

	async search(userId: string, term: string): Promise<TProduct[]> {
		if (!term || term.trim() === '') {
			return this.findAll(userId);
		}

		const records = await this.model.findAll({
			where: {
				userId,
				[Op.or]: [{ name: { [Op.iLike]: `%${term}%` } }, { sku: { [Op.iLike]: `%${term}%` } }],
			},
			include: [{ all: true }],
			raw: true,
			nest: true,
		});

		return records.map((rec) => this.format(rec));
	}
}
