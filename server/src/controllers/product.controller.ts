import type { Request, Response } from 'express';
import { type TProduct, type TProductBase } from '../schema/product.schema.js';
import { BaseController } from './base.controller.js';
import { productRepo, type IProductRepository } from '../repositories/product.repository.js';

export class ProductController extends BaseController<TProduct, TProductBase, IProductRepository> {
	constructor() {
		super(productRepo);
	}

	public getStockReport = async (req: Request, res: Response) => {
		try {
			const userId = req.user.id;

			if (!userId) {
				return res.status(401).json({ message: 'Unauthorized' });
			}
			const typeReport = req.query.typeReport as 'low' | 'out';
			const respose = await this.repo.getStockReport(userId, typeReport);
			res.status(200).json(respose);
		} catch (error) {
			res.status(500).json({ message: 'Interval Server Error' });
		}
	};

	public updateProductQuantity = async (req: Request, res: Response) => {
		const userId = req.user.id;
		const productId = req.params.id as string;
		const quantityChange = req.body.quantityChange;

		if (!userId || !productId) {
			return res.status(401).json({ message: 'Unauthorized' });
		}

		try {
			const response = await this.repo.updateProductQuantity(userId, productId, quantityChange);
			return res.status(200).send(response);
		} catch (error) {
			return res.status(500).json({ message: 'Interval Server Error' });
		}
	};
}
export const productController = new ProductController();
