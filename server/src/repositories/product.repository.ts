import { Product, Category } from '../models/index.js';
import { productBaseSchema, productSchema, type TProduct, type TProductBase } from '../schema/product.schema.js';
import { Op } from 'sequelize';
import { BaseRepository, type IBaseRepository } from './base.repository.js';
import { EProductStatus } from '../enums/product.enum.js';

export interface IProductRepository extends IBaseRepository<TProduct, TProductBase> {
	search(userId: string, term: string): Promise<TProduct[]>;
	getStockReport(
		userId: string,
		type: 'low' | 'out',
	): Promise<{ title: string; generatedAt: Date; products: TProduct[] }> | null;

	updateProductQuantity(
		userId: string,
		productId: string,
		quantityChange: number,
	): Promise<{ productId: string; productQuantity: number; status: string }>;
}
class ProductRepository extends BaseRepository<TProduct, TProductBase, Product> implements IProductRepository {
	constructor() {
		super(Product, productSchema, productBaseSchema);
	}

	private getStockStatus(qty: number): string {
		if (qty <= 0) return EProductStatus.OUT_OF_STOCK;
		if (qty <= 5) return EProductStatus.LOW_STOCK;
		return EProductStatus.IN_STOCK;
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
			include: [Category],
			raw: true,
			nest: true,
		};
	}

	public async search(userId: string, term: string): Promise<TProduct[]> {
		if (!term || term.trim() === '') {
			return this.findAll(userId);
		}

		const { rows, count } = await this.model.findAndCountAll({
			where: {
				userId,
				[Op.or]: [{ name: { [Op.iLike]: `%${term}%` } }, { sku: { [Op.iLike]: `%${term}%` } }],
			},
			include: [{ all: true }],
			distinct: true,
			raw: false,
			subQuery: false,
			nest: true,
		});

		return rows.map((rec) => this.format(rec));
	}

	public async update(id: string, data: Partial<TProductBase>, userId: string) {
		const { sku, ...rest } = data;

		const definedData = Object.fromEntries(Object.entries(rest).filter(([_, value]) => value !== undefined));

		await this.model.update(definedData, {
			where: { id, userId } as any,
		});

		const options = this.getQueryOptions(userId, id);
		const record = await this.model.findOne(options);

		const formatttedProduct = this.format(record);
		return this.schema.parse(formatttedProduct);
	}

	public async updateProductQuantity(
		userId: string,
		productId: string,
		quantityChange: number,
	): Promise<{ productId: string; productQuantity: number; status: string }> {
		const product = await this.model.findOne({
			where: {
				id: productId,
				userId: userId,
			},
		});

		if (!product) {
			throw new Error('Product not found ');
		}

		const newQuantity = product.quantity + quantityChange;

		product.quantity = newQuantity;

		await product.save();

		return {
			productId,
			productQuantity: newQuantity,
			status: this.getStockStatus(newQuantity),
		};
	}

	public async getStockReport(
		userId: string,
		type: 'low' | 'out',
	): Promise<{ title: string; generatedAt: Date; products: TProduct[] }> {
		const products = await this.findAll(userId);

		let filtered: TProduct[] = [];

		if (type === 'low') {
			filtered = products.filter((p) => p.quantity > 0 && p.quantity <= 5);
		}

		if (type === 'out') {
			filtered = products.filter((p) => p.quantity === 0);
		}

		return {
			title: type === 'low' ? 'Low Stock Report' : 'Out of Stock Report',
			generatedAt: new Date(),
			products: filtered,
		};
	}
}

export const productRepo = new ProductRepository();
