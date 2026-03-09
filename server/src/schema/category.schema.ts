import z from 'zod';

export const categoryBaseSchema = z.object({
	name: z.string().min(1),
	description: z.string().nullable().optional(),
});

export const categorySchema = categoryBaseSchema.extend({
	id: z.uuid(),
});

export type TCategoryBase = z.infer<typeof categoryBaseSchema>;
export type TCategory = z.infer<typeof categorySchema>;
