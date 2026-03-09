import { CategoryRespository } from '../repositories/category.repository.js';
import { type Request, type Response } from 'express';
const categoryRepo = new CategoryRespository();
const getAllCateogries = async (req: Request, res: Response) => {
	try {
		const userId = req.user.id;

		const cateogries = await categoryRepo.findAll(userId);
		console.log(cateogries);

		res.status(200).json(cateogries);
	} catch (error) {
		console.error('[Category Controller] Error fetching categories:', error);
		res.status(500).json({ message: 'Internal Server Error' });
		throw error;
	}
};

export const categoryController = { getAllCateogries };
