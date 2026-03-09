import z from 'zod';

export const orderchema = z.object({
	id: z.uuid(),
	name: z.string().min(1),
	phone: z.string().optional(),
	address: z.string().min(1),
	purchaseDate: z.date(),
	productName: z.string().min(1),
	productId: z.uuid(),
	quantity: z.coerce.number().int().nonnegative(),
	availableQuantity: z.coerce.number().int().nonnegative().optional(),
	productPrice: z.coerce.number().positive(),
	sku: z.string().min(3),
	status: z.enum(['Processing', 'Shipped', 'Delivered']),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
});

export type TOrder = z.infer<typeof orderchema>;
export interface IOrderPaginated {
	data: TOrder[];
	pagination: {
		totalItems: number;
		currentPage: number;
		totalPages: number;
		itemsPerPage: 10 | 25 | 50;
	};
}
