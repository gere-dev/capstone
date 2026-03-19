import z from 'zod';
import { EOrder } from '../enums/order.enum';

export const orderBaseSchema = z.object({
	name: z.string().min(1, 'Customer name is required'),
	phone: z.string().min(6, 'Invalid phone number'),
	address: z.string().min(1, 'Address is required'),
	quantity: z.coerce.number().int().nonnegative(),
	productName: z.string().min(1),
	productId: z.uuid().optional().nullable(),
	availableQuantity: z.coerce.number().int().nonnegative().optional(),
	productPrice: z.coerce.number().positive(),
	sku: z.string().min(3, 'SKU must be at least 3 characters'),
	status: z.enum([EOrder.pending, EOrder.completed, EOrder.cancelled]).default(EOrder.pending),
	purchaseDate: z.coerce.date(),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
});

export const orderSchema = orderBaseSchema.extend({
	id: z.uuid(),
});

export const orderUnionSchema = z.union([orderSchema, orderBaseSchema]);

export type TOrderBase = z.infer<typeof orderBaseSchema>;
export type TOrder = z.infer<typeof orderSchema>;
export interface IOrderPaginated {
	data: TOrder[];
	pagination: {
		totalItems: number;
		currentPage: number;
		totalPages: number;
		itemsPerPage: 10 | 25 | 50;
	};
}
