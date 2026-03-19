import type { TCategory } from '../schemas';

export interface ICategory {
	id: string;
	name: string;
	description?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface ICategoryPaginated {
	data: TCategory[];
	pagination: {
		totalItems: number;
		currentPage: number;
		totalPages: number;
		itemsPerPage: 10 | 25 | 50;
	};
}
