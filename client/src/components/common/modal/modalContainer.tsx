import { useAppDispatch, useAppSelector } from '../../../hooks';
import { Modal } from './modal';
import { ProductForm } from '../productForm';
import { selectSelectedProduct } from '../../../features/product/product.selector';
import { clearSelectedProduct } from '../../../features/product/product.slice';
import { useSelector } from 'react-redux';
import { selectModal } from '../../../features/modal';
import { OrderForm } from '../orderForm';
import type { TOrder } from '../../../schemas';
import { selectSelectedOrder } from '../../../features/order/order.selector';

export const ModalContainer = () => {
	const { isEdit, modalType } = useSelector(selectModal);

	const product = useAppSelector(selectSelectedProduct);
	const order = useAppSelector(selectSelectedOrder);

	const dispatch = useAppDispatch();

	let orderData = {} as TOrder;

	if (modalType === 'order') {
		if (isEdit) {
			orderData = order;
		} else {
			orderData = {
				id: '',
				name: '',
				address: '',
				phone: '',
				productName: product?.name,
				productId: product?.id,
				productPrice: product?.price,
				quantity: product.quantity > 0 ? 1 : 0,
				availableQuantity: product.quantity,
				purchaseDate: new Date(),
				sku: product?.sku,
				status: 'Processing',
			};
		}
	}

	const clearData = () => {
		if (modalType === 'product') {
			dispatch(clearSelectedProduct());
		}
	};

	return (
		<Modal clearData={clearData}>
			{modalType === 'product' && (
				<ProductForm key={`${product.id}-${JSON.stringify(product)}`} isEdit={isEdit} productData={product} />
			)}
			{modalType === 'order' && (
				<OrderForm
					key={`${orderData.purchaseDate}-${JSON.stringify(orderData)}`}
					orderData={orderData}
					isEdit={isEdit}
				/>
			)}
		</Modal>
	);
};
