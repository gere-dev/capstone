import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { EFormModalType } from '../../enums';

interface ModalState {
	isOpen: boolean;
	isEdit: boolean;
	formModalType: EFormModalType;
}

const initialState: ModalState = {
	isOpen: false,
	isEdit: false,
	formModalType: EFormModalType.RESET,
};

export const modalSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		openModal: (state, action: PayloadAction<{ isEdit: boolean; modalType: EFormModalType }>) => {
			state.isEdit = action.payload.isEdit;
			state.formModalType = action.payload.modalType;
			state.isOpen = true;
			console.log(action.payload.modalType);
		},
		closeModal: (state) => {
			state.isOpen = false;
			state.isEdit = false;
			state.formModalType = EFormModalType.RESET;
		},
	},
});

export const { openModal, closeModal } = modalSlice.actions;
