import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ModalState {
	isOpen: boolean;
	isEdit: boolean;
	modalType: 'product' | 'order';
}

const initialState: ModalState = {
	isOpen: false,
	isEdit: false,
	modalType: 'product',
};

export const modalSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		openModal: (state, action: PayloadAction<{ isEdit: boolean; modalType: 'product' | 'order' }>) => {
			state.isOpen = true;
			state.isEdit = action.payload.isEdit;
			state.modalType = action.payload.modalType;
		},
		closeModal: (state) => {
			state.isOpen = false;
			state.isEdit = false;
		},
	},
});

export const { openModal, closeModal } = modalSlice.actions;
