import { createSlice } from '@reduxjs/toolkit';
import type { TSupplier } from '../../schemas/supplier.schema';
import { supplierThunk } from './supplier.thunk';
const initialSupplier = {
	id: '',
	name: '',
	address: '',
	contact: '',
};
interface SupplierState {
	suppliers: TSupplier[];
	selectedSupplier: TSupplier;
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	error: string | null;
	pagination: {
		currentPage: number;
		itemsPerPage: 10 | 25 | 50;
		totalPages: number;
		totalItems: number;
	};
}

const initialState: SupplierState = {
	suppliers: [],
	selectedSupplier: initialSupplier,
	status: 'idle',
	error: null,
	pagination: {
		currentPage: 1,
		itemsPerPage: 10,
		totalPages: 1,
		totalItems: 0,
	},
};

export const supplierSlice = createSlice({
	name: 'supplier',
	initialState,
	reducers: {
		setSupplierCurrentPage: (state, action) => {
			state.pagination.currentPage = action.payload;
		},
		setSupplierPerPage: (state, action) => {
			state.pagination.itemsPerPage = action.payload;
		},

		clearSelectedSupplier: (state) => {
			state.selectedSupplier = initialSupplier;
		},
	},
	extraReducers: (builder) => {
		builder
			// get all suppliers
			.addCase(supplierThunk.getAllSuppliers.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(supplierThunk.getAllSuppliers.fulfilled, (state, action) => {
				state.status = 'succeeded';
				const { data, pagination } = action.payload;
				state.suppliers = data;
				state.pagination = pagination;
			})
			.addCase(supplierThunk.getAllSuppliers.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as string;
			})

			// search suppliers by  name, contact, and address
			.addCase(supplierThunk.searchSupplier.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(supplierThunk.searchSupplier.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.suppliers = action.payload;
			})

			.addCase(supplierThunk.searchSupplier.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as string;
			})

			// create supplier
			.addCase(supplierThunk.createSupplier.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(supplierThunk.createSupplier.fulfilled, (state, action) => {
				state.status = 'succeeded';
				const supplier = action.payload;
				state.suppliers.push(supplier);
			})
			.addCase(supplierThunk.createSupplier.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as string;
			})
			// update supplier
			.addCase(supplierThunk.updateSupplier.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(supplierThunk.updateSupplier.fulfilled, (state, action) => {
				state.status = 'succeeded';
				const { id, supplier } = action.payload;

				const supplierIndex = state.suppliers.findIndex((supplier) => supplier.id === id);
				if (supplierIndex !== -1) {
					state.suppliers[supplierIndex] = supplier;
				}
			})
			.addCase(supplierThunk.updateSupplier.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as string;
			})

			// get supplier by id
			.addCase(supplierThunk.getSupplierById.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(supplierThunk.getSupplierById.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.selectedSupplier = action.payload;
			})
			.addCase(supplierThunk.getSupplierById.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as string;
			})

			// delete supplier
			.addCase(supplierThunk.deleteSupplier.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(supplierThunk.deleteSupplier.fulfilled, (state, action) => {
				state.status = 'succeeded';
				const id = action.payload;
				const supplierIndex = state.suppliers.findIndex((supplier) => supplier.id === id);
				if (supplierIndex !== -1) {
					state.suppliers.splice(supplierIndex, 1);
				}
			})
			.addCase(supplierThunk.deleteSupplier.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as string;
			});
	},
});

export const { setSupplierCurrentPage, setSupplierPerPage, clearSelectedSupplier } = supplierSlice.actions;
