import { z } from 'zod';
import { sanitized, sanitizedPhone } from '../validation/sanitized.js';

export const orderBaseSchema = z.object({
	name: sanitized(z.string().min(1).max(50)),
	phone: sanitizedPhone.optional(),
	address: sanitized(z.string().min(1).max(100)),
	purchaseDate: z.coerce.date(),
	productName: sanitized(z.string().min(1).max(500)),
	productId: z.uuid(),
	quantity: z.coerce.number().int().nonnegative(),
	productPrice: z.coerce.number().int().nonnegative().optional(),
	sku: sanitized(z.string().min(3).max(50)),
	status: z.enum(['Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned']),
});

export const orderSchema = orderBaseSchema.extend({
	id: z.uuid(),
	availableQuantity: z.coerce.number().int().nonnegative().optional(),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
});

export type TOrderBase = z.infer<typeof orderBaseSchema>;
export type TOrder = z.infer<typeof orderSchema>;
