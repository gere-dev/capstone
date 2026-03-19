import z from 'zod';
import { sanitized } from '../validation/sanitized.js';
import { EProductStatus } from '../enums/product.enum.js';

export const productBaseSchema = z.object({
	name: sanitized(z.string().min(2).max(50)),
	price: z.coerce.number().positive(),
	description: sanitized(z.string()).nullable().optional(),
	quantity: z.number().int().nonnegative(),
	categoryId: z.uuid(),
	sku: sanitized(z.string().min(3)),
});

export const productSchema = productBaseSchema.extend({
	id: z.uuid(),
	category: sanitized(z.string()),
	status: z.enum([EProductStatus.IN_STOCK, EProductStatus.LOW_STOCK, EProductStatus.OUT_OF_STOCK]),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
});

export const productParamSchema = z.object({
	productId: z.uuid(),
});

export type TProductBase = z.infer<typeof productBaseSchema>;
export type TProduct = z.infer<typeof productSchema>;
