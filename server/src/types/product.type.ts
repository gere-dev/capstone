export interface IProduct {
	id: string;
	name: string;
	userId: string;
	description?: string;
	sku: string;
	price: number;
	quantity: number;
	categoryId: string;
	category: string;
	status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}
