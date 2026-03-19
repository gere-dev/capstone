import { memo, useState, type FC } from 'react';
import type { ICategory } from '../../types';
import { Button, InputField, TextareaField } from '../ui';
import { useAppDispatch } from '../../hooks';
import { closeModal } from '../../features/modal';
import { categoryThunks, clearSelectedCategory } from '../../features/category';
import {
	categoryBaseSchema,
	categorySchema,
	categoryUnionSchema,
	type TCategory,
	type TCategoryBase,
} from '../../schemas';
import { formatZodErrors, getGenericServerError, mapBackendZodErrors } from '../../utils';
import type z from 'zod';

interface Props {
	isEdit: boolean;
	initialData: TCategory;
}
export const CategoryForm: FC<Props> = memo(({ isEdit, initialData }: Props) => {
	const [categoryForm, setCategoryForm] = useState<TCategory>(initialData);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const dispach = useAppDispatch();

	const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setCategoryForm((prev) => ({
			...prev,

			[name]: value,
		}));

		if (errors[name] || errors.server) {
			setErrors((prev) => ({
				...prev,
				[name]: '',
				server: '',
			}));
		}
	};

	const clearDataAndCloseModal = () => {
		dispach(clearSelectedCategory());
		setCategoryForm({} as TCategory);
		dispach(closeModal());
	};

	const handleSubmitForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		const result: z.ZodSafeParseResult<TCategory | TCategoryBase> = categoryUnionSchema.safeParse(categoryForm);

		if (!result.success) {
			setErrors(formatZodErrors(result.error));
			return;
		}

		try {
			if ('id' in result.data && result.data.id) {
				const body = result.data as TCategory;
				await dispach(categoryThunks.updateCategory({ id: body.id, category: body })).unwrap();

				clearDataAndCloseModal();
			} else {
				const body = result.data;
				await dispach(categoryThunks.createCategory(body)).unwrap();

				clearDataAndCloseModal();
			}
		} catch (error: any) {
			const backendErrors = mapBackendZodErrors(error);
			if (backendErrors) {
				setErrors(backendErrors);
			} else {
				setErrors({
					server: getGenericServerError({
						action: isEdit ? 'updating' : 'creating',
						item: 'category',
					}),
				});
			}
		}
	};

	return (
		<div>
			<h2 className="capitalize font-bold text-xl text-center mt-4">{isEdit ? 'update ' : 'add '} category</h2>
			<form onSubmit={handleSubmitForm} className="flex flex-col gap-6 p-4 w-xs sm:w-sm" action="">
				<InputField
					onChange={handleFormChange}
					type="text"
					name="name"
					label="Category Name*"
					placeholder="Enter category name"
					value={categoryForm.name}
					required
					error={errors.name}
				/>

				<TextareaField
					className="h-[135px]"
					onChange={handleFormChange}
					name="description"
					label="Description"
					value={categoryForm.description as string}
					placeholder="Ente category description"
					error={errors.description}
				/>
				<div className="flex gap-4">
					<Button
						type="button"
						onClick={() => clearDataAndCloseModal()}
						variant="secondary"
						className="flex-1"
					>
						Cancel
					</Button>
					<Button type="submit" className="flex-1">
						{isEdit ? 'Update ' : 'Add '}
					</Button>
				</div>
			</form>
		</div>
	);
});
