import { useEffect, useState } from 'react';
import { closeModal } from '../../features/modal';
import { clearSelectedProduct } from '../../features/product/product.slice';
import { useAppDispatch } from '../../hooks';
import { Button, InputField } from '../ui';
import { orderBaseSchema, orderSchema, orderUnionSchema, type TOrder } from '../../schemas';
import { orderThunk } from '../../features/order/order.thunk';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { productThunk } from '../../features/product/product.thunk';
import { formatZodErrors, getGenericServerError, mapBackendZodErrors } from '../../utils';
import { EOrder } from '../../enums/order.enum';
import { clearSelectedOrder } from '../../features/order/order.slice';

const orderStatus: EOrder[] = [EOrder.pending, EOrder.completed, EOrder.cancelled];
interface Props {
	isEdit: boolean;
	orderData: TOrder;
}

export const OrderForm: React.FC<Props> = ({ isEdit, orderData }) => {
	const [order, setOrder] = useState<TOrder>(orderData);

	const [orderQuantity, setOrderQuantity] = useState<number>(orderData?.quantity);
	const [availableQuantity, setAvailableQuantity] = useState<number>(Number(order.availableQuantity));
	const [quantityChange, setQuantityChange] = useState<number>(0);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const dispatch = useAppDispatch();

	const handleChangeInput = (
		e: React.ChangeEvent<HTMLInputElement, HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setOrder((prev) => ({ ...prev, [name]: value }));

		if (errors[name] || errors.server) {
			setErrors((prev) => ({
				...prev,
				[name]: '',
				server: '',
			}));
		}
	};

	const clearFormAndCloseModal = () => {
		dispatch(clearSelectedOrder());
		setOrder({} as TOrder);
		dispatch(closeModal());
	};

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setErrors({});

		let cancelledOrderQuantity: number = 0;
		const result = orderUnionSchema.safeParse({
			...order,
			quantity: orderQuantity,
		});

		if (!result.success) {
			setErrors(formatZodErrors(result.error));
			console.log(result.error);
			return;
		}

		if (result.data.status === EOrder.cancelled) {
			cancelledOrderQuantity = result.data.quantity;
			result.data.quantity = 0;
		}

		try {
			if ('id' in result.data && result.data.id) {
				await dispatch(
					orderThunk.updateOrder({
						id: result.data.id,
						order: result.data,
					}),
				).unwrap();

				if (result.data.productId) {
					await dispatch(
						productThunk.updateQuantityProduct({
							productId: result.data.productId,
							productQuantity: quantityChange + cancelledOrderQuantity,
						}),
					).unwrap();
				}

				clearFormAndCloseModal();
			} else {
				await dispatch(orderThunk.createOrder(result.data)).unwrap();
				clearFormAndCloseModal();
			}
		} catch (error: any) {
			const backendErrors = mapBackendZodErrors(error);
			if (backendErrors) {
				setErrors(backendErrors);
			} else {
				setErrors({
					server: getGenericServerError({
						action: isEdit ? 'updating' : 'creating',
						item: 'order',
					}),
				});
			}
		}
	};

	const handleIncrease = () => {
		if (availableQuantity < 1) return;

		setOrderQuantity((prev) => prev + 1);
		setAvailableQuantity((prev) => prev - 1);
		setQuantityChange((prev) => prev - 1);
	};
	const handleDecrease = () => {
		if (orderQuantity <= 1) return;

		setOrderQuantity((prev) => prev - 1);
		setAvailableQuantity((prev) => prev + 1);
		setQuantityChange((prev) => prev + 1);
	};

	useEffect(() => {
		function initialQuantityOffset() {
			if (!isEdit) {
				const initialQuantityChange = Number(orderData.availableQuantity) < 1 ? 0 : -order.quantity;
				setQuantityChange(initialQuantityChange);

				const initialAvailalbeQuantity = Number(order.availableQuantity) - orderData?.quantity;
				setAvailableQuantity(initialAvailalbeQuantity);
			}
		}
		initialQuantityOffset();
	}, [isEdit]);

	return (
		<form onSubmit={handleSubmit} className="grid grid-cols-1  gap-4 min-w-md p-6 relative">
			<h2 className="capitalize font-bold text-xl text-center mb-1">{isEdit ? 'update ' : 'create '} order</h2>
			<InputField
				label="Product Name"
				placeholder="Name"
				disabled
				value={order?.productName}
				name="productName"
				error={errors.productName}
			/>

			<div className="flex gap-6 items-center ">
				<InputField
					label="Price per Item"
					type="text"
					placeholder="Price"
					disabled
					value={order.productPrice}
				/>

				<div className="flex flex-row items-end gap-2">
					<button
						onClick={handleDecrease}
						type="button"
						className="px-3 py-2 bg-gray-200/60 hover:bg-gray-200 rounded-md text-lg font-bold h-[40px]"
					>
						<AiOutlineLeft />
					</button>
					<InputField
						className="w-[70px] text-center"
						label="Quantity"
						name={'quantity'}
						value={orderQuantity}
						required
						disabled
						min={1}
						error={errors.quantity}
					/>
					<button
						disabled={availableQuantity < 1 || orderQuantity < 1}
						onClick={handleIncrease}
						type="button"
						className="px-3 py-2 bg-gray-200/60 hover:bg-gray-200 rounded-md text-lg font-bold h-[40px]"
					>
						<AiOutlineRight />
					</button>
				</div>
			</div>
			{isEdit && (
				<div className="flex flex-col gap-2">
					<label className="font-semibold text-sm" htmlFor="">
						Status*
					</label>
					<select
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none capitalize"
						name="status"
						id="status"
						onChange={handleChangeInput}
						value={order.status}
					>
						{orderStatus.map((status, index) => (
							<option key={status + index} value={status}>
								{status}
							</option>
						))}
					</select>
				</div>
			)}

			<InputField
				onChange={handleChangeInput}
				label="Customer Name*"
				type="text"
				placeholder={'Enter full name'}
				name="name"
				value={order.name}
				required
				error={errors.name}
			/>
			<InputField
				onChange={handleChangeInput}
				label="Customer Phone Number*"
				type="text"
				placeholder={'Enter Phone number'}
				name="phone"
				value={order.phone}
				error={errors.phone}
				required
			/>
			<InputField
				onChange={handleChangeInput}
				label="Customer Address*"
				type="text"
				placeholder={'Enter Address'}
				name="address"
				value={order.address}
				error={errors.address}
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
					<span>{isEdit ? 'Update' : ' Order'}</span>
				</Button>
			</div>
			{errors.server && <small className="absolute bottom-0 left-1/2 -translate-x-1/2">{errors.server}</small>}
		</form>
	);
};
