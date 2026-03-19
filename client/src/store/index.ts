import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { authSlice } from '../features/auth';
import { productSlice } from '../features/product/product.slice';
import { categorySlice } from '../features/category/category.slice';
import { modalSlice } from '../features/modal/modal.slice';
import { OrderSlice } from '../features/order/order.slice';
import { supplierSlice } from '../features/supplier/supplier.slice';

const persistConfig = {
	key: 'root',
	storage,
};

const rootReducer = combineReducers({
	auth: authSlice.reducer,
	products: productSlice.reducer,
	categories: categorySlice.reducer,
	modal: modalSlice.reducer,
	order: OrderSlice.reducer,
	suppliers: supplierSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
