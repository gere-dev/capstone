import { Op } from 'sequelize';
import { Category } from '../models/index.js';
import { categoryBaseSchema, categorySchema, type TCategory, type TCategoryBase } from '../schema/category.schema.js';
import { BaseRepository, type IBaseRepository } from './base.repository.js';

export interface ICategoryRepository extends IBaseRepository<TCategory, TCategoryBase> {}
class CategoryRespository extends BaseRepository<TCategory, TCategoryBase, Category> implements ICategoryRepository {
	constructor() {
		super(Category, categorySchema, categoryBaseSchema);
	}

	protected format(record: any): TCategory {
		return {
			id: record.id,
			name: record.name,
			description: record.description,
			createdAt: record.createdAt,
			updatedAt: record.updatedAt,
		};
	}
	public async search(userId: string, term: string): Promise<TCategory[]> {
		if (!term || !term.trim()) {
			return await this.model.findAll({
				where: {
					userId,
				},
				raw: true,
				nest: true,
				limit: 10,
				order: [['createdAt', 'DESC']],
			});
		}

		const records = await this.model.findAll({
			where: {
				userId,
				name: { [Op.iLike]: `%${term}%` },
			},
			raw: true,
			nest: true,
		});

		return records.map((rec) => this.format(rec));
	}
}

export const categoryRepo = new CategoryRespository();
