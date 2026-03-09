import { type Request, type Response } from 'express';
import { OrderRepository } from '../repositories/order.repository.js';
import { ZodError } from 'zod';
import { searchTermSchema } from '../schema/general.schema.js';
import { orderBaseSchema, orderSchema } from '../schema/order.schema.js';

const orderRepo = new OrderRepository();
const getAllOrders = async (req: Request, res: Response) => {
	try {
		const userId = req.user.id;
		const { currentPage, itemsPerPage } = req.query;
		const page = Number(currentPage || 1);
		const limit = Number(itemsPerPage || 10);
		const orders = await orderRepo.paginate(userId, page, limit);

		res.status(200).json(orders);
	} catch (error) {
		console.log('Error fetching orders:', error);
		res.status(500).send('Internal Server Error');
	}
};

const searchOrders = async (req: Request, res: Response) => {
	try {
		const { term } = searchTermSchema.parse(req.query);
		const userId = req.user.id;

		const products = await orderRepo.search(userId, term);

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
		console.log(' Error occurred while searching orders', error);
		res.status(500).json({ message: ' Interval Server Error' });
	}
};

const createOrder = async (req: Request, res: Response) => {
	try {
		const userId = req.user.id;

		if (!userId) return res.status(401).json({ message: 'user not found' });

		const validate = orderBaseSchema.parse(req.body);

		const order = await orderRepo.create(validate, userId);

		return res.status(201).json(order);
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
		console.error('Error creating order:', error);
		res.status(500).send('Internal Server Error');
	}
};

const updateOrder = async (req: Request, res: Response) => {
	try {
		const userId = req.user.id;
		const orderId = req.params.orderId as string;

		if (!userId || !orderId) {
			return res.status(401).send('Unauthorized');
		}

		const validateProduct = orderSchema.parse(req.body);

		const order = await orderRepo.update(orderId, validateProduct, userId);

		if (!order) {
			return res.status(404).send('Order not found');
		}

		return res.status(200).send(order);
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

		console.log('Error while updating order', error);
		res.status(500).json({ message: 'Error updating product' });
	}
};

const getOrderById = async (req: Request, res: Response) => {
	try {
		const orderId = req.params.orderId as string;
		const userId = req.user.id;

		if (!userId || !orderId) {
			return res.status(401).send('Unauthorized');
		}

		const order = await orderRepo.findById(orderId, userId);

		if (!order) {
			return res.status(404).send(' Product not found');
		}

		return res.status(200).json(order);
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

		console.log('Error while fetching order by id', error);
		res.status(500).json({ message: ' Interval Server Error' });
	}
};

export const orderController = { getAllOrders, searchOrders, createOrder, updateOrder, getOrderById };
