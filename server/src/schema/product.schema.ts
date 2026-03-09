import z from 'zod';

export const productBaseSchema = z.object({
	name: z.string().min(1),
	price: z.coerce.number().positive(),
	description: z.string().nullable().optional(),
	quantity: z.number().int().nonnegative(),
	categoryId: z.uuid(),
	sku: z.string().min(3),
});

export const productSchema = productBaseSchema.extend({
	id: z.uuid(),
	category: z.string(),
	status: z.enum(['In Stock', 'Low Stock', 'Out of Stock']),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
});

export const productParamSchema = z.object({
	productId: z.uuid(),
});

export type TProductBase = z.infer<typeof productBaseSchema>;
export type TProduct = z.infer<typeof productSchema>;
