import { isAxiosError } from 'axios';
import type { ISupplierPaginated, TSupplier } from '../../schemas/supplier.schema';
import { supplierService } from '../../services/supplier.service';
import { createAsyncThunk } from '@reduxjs/toolkit';

const getAllSuppliers = createAsyncThunk<
	ISupplierPaginated,
	{ currentPage: number; limit: number },
	{ rejectValue: string }
>('supplier/getAllSuppliers', async ({ currentPage, limit }, { rejectWithValue }) => {
	try {
		return await supplierService.getAllSuppliers(currentPage, limit);
	} catch (error) {
		if (isAxiosError(error) && error.response) {
			return rejectWithValue(error.message);
		} else {
			return rejectWithValue('UnKnown error occured while fetching suppliers.');
		}
	}
});

const searchSupplier = createAsyncThunk<TSupplier[], string, { rejectValue: string }>(
	'supplier/search',
	async (term, { rejectWithValue }) => {
		try {
			return await supplierService.searchSupplier(term);
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				return rejectWithValue(error.message);
			} else {
				return rejectWithValue('UnKnown error occured while searching for supplier');
			}
		}
	},
);

const createSupplier = createAsyncThunk<TSupplier, Omit<TSupplier, 'id'>, { rejectValue: string }>(
	'supplier/create',
	async (supplier, { rejectWithValue }) => {
		try {
			return await supplierService.createSupplier(supplier);
		} catch (error) {
			console.log(error);
			if (isAxiosError(error) && error.response) {
				return rejectWithValue(error.response.data);
			} else {
				return rejectWithValue('UnKnown error occured while creating supplier');
			}
		}
	},
);

const updateSupplier = createAsyncThunk<
	{ id: string; supplier: TSupplier },
	{ id: string; supplier: TSupplier },
	{ rejectValue: string }
>('supplier/update', async ({ id, supplier }, { rejectWithValue }) => {
	try {
		return await supplierService.updateSupplier({ id, supplier });
	} catch (error) {
		if (isAxiosError(error) && error.response) {
			return rejectWithValue(error.message);
		} else {
			return rejectWithValue('UnKnown error occured while updating supplier');
		}
	}
});

const getSupplierById = createAsyncThunk<TSupplier, string, { rejectValue: string }>(
	'supplier/getById',
	async (id, { rejectWithValue }) => {
		try {
			return await supplierService.getSupplierById(id);
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				return rejectWithValue(error.message);
			} else {
				return rejectWithValue('UnKnown error occured while getting supplier by id');
			}
		}
	},
);

const deleteSupplier = createAsyncThunk<string, string, { rejectValue: string }>(
	'supplier/delete',
	async (id: string, { rejectWithValue }) => {
		try {
			await supplierService.deleteSupplier(id);
			return id;
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				return rejectWithValue(error.message);
			} else {
				return rejectWithValue('UnKnown error occured while deleting a supplier');
			}
		}
	},
);

export const supplierThunk = {
	getAllSuppliers,
	searchSupplier,
	createSupplier,
	updateSupplier,
	getSupplierById,
	deleteSupplier,
};
