export interface Product {
	id: number;
	name: string;
	sku: string;
	category: string;
	quantity: number;
	status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export const dummyProducts: Product[] = [
	{ id: 1, name: 'Wireless Headphones', sku: 'WH-001', category: 'Electronics', quantity: 45, status: 'In Stock' },
	{ id: 2, name: 'Desk Lamp', sku: 'DL-002', category: 'Home', quantity: 12, status: 'In Stock' },
	{ id: 3, name: 'Running Shoes', sku: 'RS-003', category: 'Sports', quantity: 3, status: 'Low Stock' },
	{ id: 4, name: 'Coffee Maker', sku: 'CM-004', category: 'Kitchen', quantity: 0, status: 'Out of Stock' },
	{ id: 5, name: 'Notebook', sku: 'NB-005', category: 'Stationery', quantity: 89, status: 'In Stock' },
	{ id: 6, name: 'Yoga Mat', sku: 'YM-006', category: 'Sports', quantity: 7, status: 'Low Stock' },
	{ id: 7, name: 'Bluetooth Speaker', sku: 'BS-007', category: 'Electronics', quantity: 22, status: 'In Stock' },
	{ id: 8, name: 'Water Bottle', sku: 'WB-008', category: 'Outdoor', quantity: 0, status: 'Out of Stock' },
];
