import z from 'zod';

export const categoryBaseSchema = z.object({
	name: z.string().min(2, 'Category name must be at least 2 characters'),
	description: z.string().nullable().optional(),
});

export const categorySchema = categoryBaseSchema.extend({
	id: z.uuid(),
	createdAt: z.coerce.date().optional(),
	updatedAt: z.coerce.date().optional(),
});

export const categoryUnionSchema = z.union([categorySchema, categoryBaseSchema]);

export type TCategoryBase = z.infer<typeof categoryBaseSchema>;
export type TCategory = z.infer<typeof categorySchema>;
