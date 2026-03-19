import { EFormModalType } from '../enums';
import { selectModal } from '../features/modal';
import { selectSelectedOrder } from '../features/order/order.selector';
import { selectSelectedProduct } from '../features/product/product.selector';
import type { TOrder } from '../schemas';
import { useAppSelector } from './redux.hooks';
import {} from '../enums/index';
import { EOrder } from '../enums/order.enum';

export const useOrderFormData = () => {
	const { isEdit, formModalType } = useAppSelector(selectModal);
	const product = useAppSelector(selectSelectedProduct);
	const order = useAppSelector(selectSelectedOrder);

	if (formModalType !== EFormModalType.ORDER) return null;

	if (isEdit) {
		return order;
	}

	return {
		id: '',
		name: '',
		address: '',
		phone: '',
		productName: product?.name,
		productId: product?.id,
		productPrice: product?.price,
		quantity: 1,
		availableQuantity: product.quantity,
		purchaseDate: new Date(),
		sku: product?.sku,
		status: EOrder.pending,
	};
};
