import { createSlice } from '@reduxjs/toolkit';
import type { IUser } from '../../types';
import { authThunk } from './auth.thunk';

type AuthState = {
	user: IUser;
	isAuthenticated: boolean;
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	error: string | null;
};

const initialState: AuthState = {
	user: {} as IUser,
	isAuthenticated: false,
	error: null,
	status: 'idle',
};

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			// register
			.addCase(authThunk.register.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(authThunk.register.fulfilled, (state, action) => {
				state.user = action.payload;
				state.isAuthenticated = true;
				state.status = 'succeeded';
			})
			.addCase(authThunk.register.rejected, (state, action) => {
				state.isAuthenticated = false;
				state.status = 'failed';
				if (action.error.message) {
					state.error = action.payload as string;
				} else {
					state.error = 'Register failed';
				}
			})

			// login
			.addCase(authThunk.login.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(authThunk.login.fulfilled, (state, action) => {
				state.user = action.payload;
				state.isAuthenticated = true;
				state.status = 'succeeded';
			})
			.addCase(authThunk.login.rejected, (state, action) => {
				state.status = 'failed';
				state.isAuthenticated = false;
				if (action.error.message) {
					state.error = action.payload as string;
				} else {
					state.error = 'Login failed';
				}
			})

			// logout
			.addCase(authThunk.logout.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(authThunk.logout.fulfilled, (state) => {
				state.status = 'succeeded';
				state.isAuthenticated = false;
				state.user = {} as IUser;
			})
			.addCase(authThunk.logout.rejected, (state, action) => {
				state.status = 'failed';
				state.isAuthenticated = false;
				state.user = {} as IUser;

				if (action.error.message) {
					state.error = action.payload as string;
				} else {
					state.error = 'Logout failed';
				}
			});
	},
});
