import { useState } from 'react';
import { Button, InputField } from '../ui';
import {
	supplierBaseSchema,
	supplierSchema,
	supplierUnionSchema,
	type TSupplier,
	type TSupplierBase,
} from '../../schemas/supplier.schema';
import { clearSelectedSupplier, supplierThunk } from '../../features/supplier';
import { useAppDispatch } from '../../hooks';
import { closeModal } from '../../features/modal';
import { formatZodErrors, getGenericServerError, mapBackendZodErrors } from '../../utils';
import type z from 'zod';

interface Props {
	isEdit: boolean;
	supplierData: TSupplierBase | TSupplier;
}
export const SupplierForm = ({ isEdit, supplierData }: Props) => {
	const [supplier, setSupplier] = useState<TSupplierBase | TSupplier>(supplierData);

	const [errors, setErrors] = useState<Record<string, string>>({});
	const dispatch = useAppDispatch();

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setSupplier((prev) => ({ ...prev, [name]: value }));

		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: '',
				server: '',
			}));
		}
	};

	const clearFormAndCloseModal = () => {
		dispatch(closeModal());
		dispatch(clearSelectedSupplier());
		setSupplier({} as TSupplier);
	};
	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrors({});

		const result: z.ZodSafeParseResult<TSupplierBase | TSupplier> = supplierUnionSchema.safeParse(supplier);

		if (!result.success) {
			setErrors(formatZodErrors(result.error));
			return;
		}

		try {
			if ('id' in result.data && result.data.id) {
				const result = supplierSchema.safeParse(supplier);
				if (!result.success) {
					setErrors(formatZodErrors(result.error));
					return;
				}

				await dispatch(
					supplierThunk.updateSupplier({
						id: result.data.id,
						supplier: result.data,
					}),
				).unwrap();

				clearFormAndCloseModal();
			} else {
				await dispatch(supplierThunk.createSupplier(result.data)).unwrap();
			}

			dispatch(closeModal());
			dispatch(clearSelectedSupplier());
		} catch (error: any) {
			const backendErrors = mapBackendZodErrors(error);
			if (backendErrors) {
				setErrors(backendErrors);
			} else {
				setErrors({
					server: getGenericServerError({
						action: isEdit ? 'updating' : 'creating',
						item: 'supplier',
					}),
				});
			}
		}
	};

	return (
		<div className="w-[400px] rounded ">
			<h2 className="capitalize font-bold text-xl text-center mt-2">{isEdit ? 'update  ' : 'add  '} supplier</h2>
			<form onSubmit={handleSubmit} action="" className="flex flex-col gap-4 p-6">
				<InputField
					name="name"
					onChange={handleInputChange}
					label="Supplier Name*"
					placeholder="John Doe"
					required
					value={supplier.name}
					error={errors.name}
				/>
				<InputField
					name="contact"
					onChange={handleInputChange}
					label="Contact*"
					type="tel"
					placeholder="123-123-1234"
					required
					value={supplier.contact}
					error={errors.contact}
				/>
				<InputField
					onChange={handleInputChange}
					name="address"
					label="Address"
					placeholder="123 Main St, Anytown"
					value={supplier.address}
					error={errors.address}
				/>
				<div className="flex gap-4">
					<Button onClick={() => dispatch(closeModal())} variant="secondary">
						cancel
					</Button>
					<Button type="submit">{isEdit ? 'Update ' : 'Add'}</Button>
				</div>
			</form>
		</div>
	);
};
