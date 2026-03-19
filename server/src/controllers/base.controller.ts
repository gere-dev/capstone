import type { Request, Response } from 'express';
import { ZodError } from 'zod';
import type { IBaseRepository } from '../repositories/base.repository.js';

export abstract class BaseController<T, TBase, R extends IBaseRepository<T, TBase>> {
	constructor(protected readonly repo: R) {}

	public getAll = async (req: Request, res: Response): Promise<void> => {
		const userId = req.user?.id;
		try {
			const records = await this.repo.findAll(userId);
			res.status(200).json(records);
		} catch (error) {
			this.handleError(res, error, 'Fetch failed');
		}
	};

	public getPaginated = async (req: Request, res: Response): Promise<void> => {
		try {
			const userId = req.user?.id;
			const { currentPage, itemsPerPage } = req.query;
			const page = Number(currentPage || 1);
			const limit = Number(itemsPerPage || 10);

			const result = await this.repo.paginate(userId, page, limit);
			res.status(200).json(result);
		} catch (error) {
			this.handleError(res, error, 'Fetch paginated failed');
		}
	};

	public getById = async (req: Request, res: Response): Promise<void> => {
		try {
			const record = await this.repo.findById(req.params.id as string, req.user?.id);
			if (!record) {
				res.status(404).json({ message: 'Record not found' });
				return;
			}
			res.status(200).json(record);
		} catch (error) {
			this.handleError(res, error, 'Fetch failed');
		}
	};

	public create = async (req: Request, res: Response): Promise<void> => {
		try {
			const result = await this.repo.create(req.body, req.user?.id);
			res.status(201).json(result);
		} catch (error) {
			this.handleError(res, error, 'Creation failed');
		}
	};

	public update = async (req: Request, res: Response): Promise<void> => {
		try {
			const result = await this.repo.update(req.params.id as string, req.body, req.user?.id);
			res.status(200).json(result);
		} catch (error) {
			this.handleError(res, error, 'Update failed');
		}
	};

	public delete = async (req: Request, res: Response): Promise<void> => {
		try {
			const success = await this.repo.delete(req.params.id as string, req.user?.id);
			res.status(success ? 204 : 404).send();
		} catch (error) {
			this.handleError(res, error, 'Deletion failed');
		}
	};

	public search = async (req: Request, res: Response): Promise<void> => {
		try {
			const records = await this.repo.search(req.user?.id, req.query.term as string);
			res.status(200).json(records);
		} catch (error) {
			this.handleError(res, error, 'Search failed');
		}
	};

	protected handleError(res: Response, error: any, message: string) {
		if (error instanceof ZodError) {
			const validationErrors = error.issues.map((error) => ({
				message: error.message,
				path: error.path,
			}));
			return res.status(400).json({
				success: false,
				errors: validationErrors,
			});
		}
		if (error?.name === 'SequelizeUniqueConstraintError') {
			return res.status(400).json({
				success: false,
				errors: error?.errors.map((e: any) => ({
					path: [e.path],
					message: e.message,
				})),
			});
		} else {
			return res.status(500).json({ message: 'Internal Server Error' });
		}
	}
}
