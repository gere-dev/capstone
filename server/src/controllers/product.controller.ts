import { ProductRepository } from '../repositories/product.repository.js';
import type { Request, Response } from 'express';
import { productBaseSchema, productParamSchema, productSchema } from '../schema/product.schema.js';
import z, { ZodError } from 'zod';

const productRepo = new ProductRepository();

const getAllProducts = async (req: Request, res: Response) => {
	try {
		const userId = req.user.id;
		const { currentPage, totalPages, itemsPerPage } = req.query;
		const page = Number(currentPage || 1);
		const limit = Number(itemsPerPage || 10);
		const products = await productRepo.paginate(userId, page, limit);
		res.status(200).json(products);
	} catch (error) {
		console.error('Error fetching products:', error);
		res.status(500).send('Internal Server Error');
	}
};

const createProduct = async (req: Request, res: Response) => {
	try {
		const userId = req.user.id;
		if (!userId) throw new Error('User not found.');

		const validProduct = productBaseSchema.parse(req.body);

		const product = await productRepo.create(validProduct, userId);

		return res.status(201).json(product);
	} catch (error) {
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
		console.error('Error creating product:', error);
		res.status(500).send('Internal Server Error');
	}
};

const updateProduct = async (req: Request, res: Response) => {
	try {
		const userId = req.user.id;
		const productId = req.params.productId as string;

		if (!userId || !productId) {
			return res.status(401).send('Unauthorized');
		}

		const validateProduct = productSchema.parse(req.body);
		const validateParam = productParamSchema.parse(req.params);

		const product = await productRepo.update(validateParam.productId, validateProduct, userId);

		if (!product) {
			return res.status(404).send('Product not found');
		}

		return res.status(200).send(product);
	} catch (error) {
		if (error instanceof z.ZodError) {
			const validationErrors = error.issues.map((error) => ({
				message: error.message,
				path: error.path,
			}));
			return res.status(400).json({
				success: false,
				errors: validationErrors,
			});
		}

		console.log('Error while updating', error);
		res.status(500).json({ message: 'Error updating product' });
	}
};

const deleteProduct = async (req: Request, res: Response) => {
	try {
		const userId = req.user.id;

		const { productId } = productParamSchema.parse(req.params);

		if (!userId || !productId) {
			return res.status(401).send('Unauthorized');
		}
		await productRepo.delete(productId, userId);

		return res.status(200).send({ message: 'Product deleted successfully' });
	} catch (error) {
		if (error instanceof z.ZodError) {
			const validationErrors = error.issues.map((error) => ({
				message: error.message,
				path: error.path,
			}));
			return res.status(400).json({
				success: false,
				errors: validationErrors,
			});
		}
		console.error('Error while deleting', error);
		return res.status(500).json({ message: 'Error deleting product' });
	}
};

const getProductById = async (req: Request, res: Response) => {
	try {
		const { productId } = productParamSchema.parse(req.params);
		const userId = req.user.id;

		if (!userId || !productId) {
			return res.status(401).send('Unauthorized');
		}

		const product = await productRepo.findById(productId, userId);

		if (!product) {
			return res.status(404).send(' Product not found');
		}

		return res.status(200).json(product);
	} catch (error) {
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

		console.log('Error while fetching product by id', error);
		res.status(500).json({ message: ' Interval Server Error' });
	}
};

const searchTermSchema = z.object({
	term: z.string().min(0).max(50),
});

const searchProduct = async (req: Request, res: Response) => {
	try {
		const { term } = searchTermSchema.parse(req.query);
		const userId = req.user.id;

		const products = await productRepo.search(userId, term);

		return res.status(200).json(products);
	} catch (error) {
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
		console.log('[Product Controller]: Error occurred while searching by term', error);
		res.status(500).json({ message: ' Interval Server Error' });
	}
};

export const productController = {
	getAllProducts,
	updateProduct,
	getProductById,
	createProduct,
	deleteProduct,
	searchProduct,
};
