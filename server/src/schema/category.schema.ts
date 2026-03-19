import z from 'zod';
import { sanitized } from '../validation/sanitized.js';

export const categoryBaseSchema = z.object({
	name: sanitized(z.string().min(2)),
	description: sanitized(z.string()).nullable().optional(),
});

export const categorySchema = categoryBaseSchema.extend({
	id: z.uuid(),
	createdAt: z.coerce.date().optional(),
	updatedAt: z.coerce.date().optional(),
});

export type TCategoryBase = z.infer<typeof categoryBaseSchema>;
export type TCategory = z.infer<typeof categorySchema>;
