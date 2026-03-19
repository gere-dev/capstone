import type { RootState } from '../../store';

export const selectSuppliers = (state: RootState) => state.suppliers;
export const selectseletectedSupplier = (state: RootState) => state.suppliers.selectedSupplier;
