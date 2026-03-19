import type { ISupplierPaginated, TSupplier } from '../schemas/supplier.schema';
import { privateInstance } from './config.service';

const getAllSuppliers = async (currentPage: number, itemsPerPage: number): Promise<ISupplierPaginated> => {
	const suppliers = await privateInstance.get('/supplier', {
		params: {
			currentPage,
			itemsPerPage,
		},
	});

	return suppliers.data;
};

const searchSupplier = async (term: string): Promise<TSupplier[]> => {
	const { data } = await privateInstance.get('/supplier/search', { params: { term } });

	return data;
};

const createSupplier = async (supplier: Omit<TSupplier, 'id'>): Promise<TSupplier> => {
	const { data } = await privateInstance.post('/supplier', supplier);
	return data;
};

const updateSupplier = async ({
	id,
	supplier,
}: {
	id: string;
	supplier: TSupplier;
}): Promise<{ id: string; supplier: TSupplier }> => {
	const { data } = await privateInstance.put(`/supplier/${id}`, supplier);

	return { id, supplier: data };
};

const getSupplierById = async (id: string): Promise<TSupplier> => {
	const { data } = await privateInstance.get(`/supplier/${id}`);
	return data;
};

const deleteSupplier = async (id: string): Promise<void> => {
	await privateInstance.delete(`/supplier/${id}`);
};

export const supplierService = {
	getAllSuppliers,
	searchSupplier,
	createSupplier,
	updateSupplier,
	getSupplierById,
	deleteSupplier,
};
