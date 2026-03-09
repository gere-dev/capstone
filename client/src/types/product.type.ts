export interface IProduct {
	id: string;
	name: string;
	userId: string;
	price: number;
	sku: string;
	category: string;
	categoryId: string;
	description?: string;
	quantity: number;
	status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface IProductPaginated {
	data: IProduct[];
	pagination: {
		totalItems: number;
		currentPage: number;
		totalPages: number;
		itemsPerPage: 10 | 25 | 50;
	};
}
