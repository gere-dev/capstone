import z from 'zod';
import { sanitized, sanitizedPhone } from '../validation/sanitized.js';

export const supplierBaseSchema = z.object({
	name: sanitized(z.string().min(1).max(50)),
	contact: sanitizedPhone,
	address: sanitized(z.string()).optional().nullable(),
});

export const supplierSchema = supplierBaseSchema.extend({
	id: z.uuid(),
});
export type TSupplierBase = z.infer<typeof supplierBaseSchema>;
export type TSupplier = z.infer<typeof supplierSchema>;
