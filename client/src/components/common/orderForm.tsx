import { useState } from 'react';
import { closeModal } from '../../features/modal';
import { clearSelectedProduct } from '../../features/product/product.slice';
import { useAppDispatch } from '../../hooks';
import { Button, InputField } from '../ui';
import type { TOrder } from '../../schemas';
import { orderThunk } from '../../features/order/order.thunk';

interface Props {
	isEdit: boolean;
	orderData: TOrder;
}

export const OrderForm: React.FC<Props> = ({ isEdit, orderData }) => {
	const [order, setOrder] = useState<TOrder>({
		id: orderData.id,
		address: orderData.address,
		name: orderData.name,
		phone: orderData.phone,
		productName: orderData?.productName,
		productId: orderData.productId,
		productPrice: orderData?.productPrice,
		quantity: orderData.quantity,
		availableQuantity: orderData.availableQuantity,
		purchaseDate: orderData.purchaseDate,
		sku: orderData.sku,
		status: 'Processing',
	});

	const dispatch = useAppDispatch();

	const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
		const { name, value } = e.target;
		setOrder((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (isEdit) {
			dispatch(orderThunk.updateOrder({ id: order.id, order }));
		} else {
			dispatch(orderThunk.createOrder(order));
		}
		dispatch(closeModal());
		setOrder({} as TOrder);
	};

	return (
		<form onSubmit={handleSubmit} className="grid grid-cols-1  gap-4 min-w-md p-6">
			<InputField
				label="Product Name"
				placeholder="Name"
				disabled
				value={order?.productName}
				name="productName"
			/>

			<div className="flex gap-6">
				<InputField label="Price" type="text" placeholder="Price" disabled value={order.productPrice} />
				<InputField
					label="Quantity"
					type="number"
					placeholder={'Quantity'}
					min={1}
					max={order?.availableQuantity}
					value={order.quantity}
					name="quantity"
					onChange={handleChangeInput}
				/>
			</div>

			<InputField
				onChange={handleChangeInput}
				label="Customer Name*"
				type="text"
				placeholder={'Enter full name'}
				name="name"
				value={order.name}
				required
			/>
			<InputField
				onChange={handleChangeInput}
				label="Customer Phone Number"
				type="text"
				placeholder={'Enter Phone number'}
				name="phone"
				value={order.phone}
			/>
			<InputField
				onChange={handleChangeInput}
				label="Customer Address*"
				type="text"
				placeholder={'Enter Address'}
				name="address"
				value={order.address}
				required
			/>

			<div className="flex gap-6">
				<Button
					onClick={() => {
						dispatch(closeModal());
						dispatch(clearSelectedProduct());
					}}
					variant="secondary"
				>
					<span>Cancel</span>
				</Button>
				<Button type="submit">
					<span>{isEdit ? 'Update Order' : ' Order'}</span>
				</Button>
			</div>
		</form>
	);
};
