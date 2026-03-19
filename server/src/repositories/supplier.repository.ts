import { Op } from 'sequelize';
import { Supplier } from '../models/index.js';
import { supplierBaseSchema, supplierSchema, type TSupplier, type TSupplierBase } from '../schema/suppliers.schema.js';
import { BaseRepository, type IBaseRepository } from './base.repository.js';
import { extend } from 'zod/mini';
export interface ISupplierRepository extends IBaseRepository<TSupplier, TSupplierBase> {}

class SupplierRepository extends BaseRepository<TSupplier, TSupplierBase, Supplier> implements ISupplierRepository {
	constructor() {
		super(Supplier, supplierSchema, supplierBaseSchema);
	}

	protected format(record: any): TSupplier {
		{
			return {
				id: record.id,
				name: record.name,
				contact: record.contact,
				address: record.address,
			};
		}
	}

	async search(userId: string, term: string) {
		const records = await this.model.findAll({
			where: {
				userId,
				[Op.or]: [
					{ name: { [Op.iLike]: `%${term}%` } },
					{ contact: { [Op.iLike]: `%${term}%` } },
					{ address: { [Op.iLike]: `%${term}%` } },
				],
			},
		});

		return records.map((rec) => this.format(rec));
	}
}

export const supplierRepo = new SupplierRepository();
