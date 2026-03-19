import z from 'zod';
import { EProductStatus } from '../enums';

export const productBaseSchema = z.object({
	name: z.string().min(2, 'Please enter a valid product name. Product name be at least 2 characters'),
	price: z.coerce.number().positive('Please enter a valid price'),
	description: z.string().nullable().optional(),
	quantity: z.number().int().nonnegative('Please enter a valid number'),
	categoryId: z.uuid(),
	sku: z.string().min(3, 'SKU should be at least 3 characters'),
});

export const productSchema = productBaseSchema.extend({
	id: z.uuid(),
	category: z.string('Please selected a cateogry'),
	status: z.enum([EProductStatus.IN_STOCK, EProductStatus.LOW_STOCK, EProductStatus.OUT_OF_STOCK]),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
});

export const productUnionSchema = z.union([productSchema, productBaseSchema]);

export type TProductBase = z.infer<typeof productBaseSchema>;
export type TProduct = z.infer<typeof productSchema>;
