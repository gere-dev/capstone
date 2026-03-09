import { Model, where, type ModelStatic } from 'sequelize';
import z from 'zod';
import type { PaginatedResult } from '../types/general.type.js';

export abstract class BaseRepository<T, TBase, M extends Model> {
	protected model: ModelStatic<M>;
	protected schema: z.ZodSchema<T>;
	protected baseSchema: z.ZodSchema<TBase>;

	constructor(model: ModelStatic<M>, schema: z.ZodSchema<T>, baseSchema: z.ZodSchema<TBase>) {
		this.model = model;
		this.schema = schema;
		this.baseSchema = baseSchema;
	}

	protected abstract format(record: any): T;

	async findAll(userId: string): Promise<T[]> {
		const options = this.getQueryOptions(userId);
		const records = await this.model.findAll(options);

		const formattedRecords = records.map((rec) => this.format(rec));
		return z.array(this.schema).parse(formattedRecords);
	}

	async findById(id: string, userId: string): Promise<T | null> {
		const options = this.getQueryOptions(userId, id);
		const record = await this.model.findOne(options);
		if (!record) return null;

		const formattedRecord = this.format(record);
		return this.schema.parse(formattedRecord);
	}

	async create(data: TBase, userId: string): Promise<T> {
		const validatedData = this.baseSchema.parse(data);
		const body = { ...validatedData, userId };
		let record = (await this.model.create(body as any)) as any;

		const options = this.getQueryOptions(userId, record.id);
		record = (await this.model.findOne(options)) as any;
		if (!record) throw new Error('Record not found');

		const formattedRecord = this.format(record);
		return this.schema.parse(formattedRecord);
	}

	async update(id: string, data: Partial<TBase>, userId: string): Promise<T> {
		const options = this.getQueryOptions(userId, id);

		await this.model.update(data, {
			where: { id, userId } as any,
		});

		const updatedRecord = await this.model.findOne(options);

		const formattedRecord = this.format(updatedRecord);

		return this.schema.parse(formattedRecord);
	}

	async delete(id: string, userId: string): Promise<boolean> {
		const result = await this.model.destroy({
			where: { id, userId } as any,
		});

		return result > 0;
	}

	protected getQueryOptions(userId: string, id?: string): any {
		return {
			where: this.getWhereIds(userId, id) as any,
			include: [],
			raw: true,
			nest: true,
		};
	}

	protected getWhereIds(userId: string, id?: string) {
		return {
			userId,
			...(id && { id }),
		};
	}

	protected abstract search(userId: string, term: string): Promise<T[]>;

	async paginate(userId: string, page: number = 1, limit: number = 10): Promise<PaginatedResult<T>> {
		const offset = (page - 1) * limit;

		const { rows, count } = await this.model.findAndCountAll({
			where: { userId } as any,
			limit,
			offset,
			include: [{ all: true }],
			distinct: true,
		});

		return {
			data: rows.map((row) => this.format(row)),
			pagination: {
				totalItems: count,
				currentPage: page,
				totalPages: Math.ceil(count / limit),
				itemsPerPage: limit,
			},
		};
	}
}
