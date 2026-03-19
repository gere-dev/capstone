import { clearSelectedProduct } from '../features/product/product.slice';
import { useAppDispatch } from './redux.hooks';
import { clearSelectedOrder } from '../features/order/order.slice';
import { clearSelectedSupplier } from '../features/supplier';
import { clearSelectedCategory } from '../features/category';
import { EFormModalType } from '../enums';

export const useClearModalFormData = () => {
	const dispatch = useAppDispatch();

	const clearData = (type: EFormModalType) => {
		console.log(type, 'type modal in hook');
		switch (type) {
			case EFormModalType.CATEGORY:
				dispatch(clearSelectedCategory());
				console.log('category data cleared');
				break;
			case EFormModalType.PRODUCT:
				dispatch(clearSelectedProduct());
				console.log('product data cleared');
				break;
			case EFormModalType.ORDER:
				dispatch(clearSelectedOrder());
				console.log('order data cleared');
				break;
			case EFormModalType.SUPPLIER:
				dispatch(clearSelectedSupplier());
				console.log('supplier data cleared');
				break;
		}
	};
	return clearData;
};
