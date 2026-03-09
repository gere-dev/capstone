export interface PaginatedResult<T> {
	data: T[];
	meta: {
		totalItems: number;
		currentPage: number;
		totalPages: number;
		itemsPerPage: number;
	};
}
