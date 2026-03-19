import z from 'zod';

export const supplierBaseSchema = z.object({
	name: z.string().min(1, 'Supplier name is required').max(100, 'Name must be 50 characters or less'),
	contact: z
		.string()
		.min(6, 'Contact must be at least 6 characters')
		.regex(/^[0-9+\-()/\s]+$/, 'Please enter a valid phone number format'),
	address: z.string().max(200, 'Address is too long').optional().or(z.literal('')),
});

export const supplierSchema = supplierBaseSchema.extend({
	id: z.uuid('Invalid id'),
});
export const supplierUnionSchema = z.union([supplierSchema, supplierBaseSchema]);
export type TSupplierBase = z.infer<typeof supplierBaseSchema>;
export type TSupplier = z.infer<typeof supplierSchema>;

export interface ISupplierPaginated {
	data: TSupplier[];
	pagination: {
		totalItems: number;
		currentPage: number;
		totalPages: number;
		itemsPerPage: 10 | 25 | 50;
	};
}
