import { Op } from 'sequelize';
import type { CategoryInstance } from '../models/Category.js';
import { CategoryModel } from '../models/index.js';
import { categoryBaseSchema, categorySchema, type TCategory, type TCategoryBase } from '../schema/category.schema.js';
import type { ICategory } from '../types/category.type.js';
import { BaseRepository } from './base.repository.js';

export class CategoryRespository extends BaseRepository<TCategory, TCategoryBase, CategoryInstance> {
	constructor() {
		super(CategoryModel, categorySchema, categoryBaseSchema);
	}

	protected format(record: any): TCategory {
		return {
			id: record.id,
			name: record.name,
			description: record.description,
		};
	}
	async search(userId: string, term: string) {
		const records = await this.model.findAll({
			where: {
				userId,
				name: { [Op.iLike]: `${term}` },
			},
			raw: true,
			nest: true,
		});

		return records.map((rec) => this.format(rec));
	}
}
