import { useEffect, useState } from 'react';
import { type IProduct } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { categoryThunks } from '../../features/category/category.thunk';
import { selectAllCategories } from '../../features/category';
import { closeModal } from '../../features/modal';
import { clearSelectedProduct } from '../../features/product/product.slice';
import { productThunk } from '../../features/product/product.thunk';

type Product = Omit<IProduct, 'id'> | IProduct;

interface Props {
	isEdit: boolean;
	productData: Product;
}

export const ProductForm = ({ isEdit, productData }: Props) => {
	const [product, setProduct] = useState<Product>(productData);

	const { categories, status } = useAppSelector(selectAllCategories);

	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(categoryThunks.getAllCategories());
	}, [dispatch]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;

		setProduct((prev) => {
			const data = { ...prev };
			if (name === 'category') {
				data.category = value;
				data.categoryId = categories.find((c) => c.name === value)?.id as string;
			} else if (name === 'price' || name === 'quantity') {
				data[name] = Number(value);
			} else {
				(data as Record<string, string | number>)[name] = value;
			}

			return data;
		});
	};

	// handles the rproduct update
	const handleUpdate = async () => {
		const body = product as IProduct;
		dispatch(productThunk.updateProduct({ id: body.id, product: body }));
	};

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (isEdit) {
			handleUpdate();
		} else {
			const body = product as IProduct;
			dispatch(productThunk.createProduct(body));
		}

		dispatch(closeModal());
		dispatch(clearSelectedProduct());
	};

	return (
		<form onSubmit={handleSubmit} className="bg-white  p-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Product Name */}
				<div className="md:col-span-2">
					<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
						Product Name *
					</label>
					<input
						type="text"
						id="name"
						name="name"
						value={product?.name}
						onChange={handleChange}
						required
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Enter product name"
					/>
				</div>

				{/* Price */}
				<div>
					<label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
						Price *
					</label>
					<input
						type="number"
						id="price"
						name="price"
						value={product?.price}
						onChange={handleChange}
						required
						min="0"
						step="0.01"
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="0.00"
					/>
				</div>

				{/* SKU */}
				<div>
					<label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
						SKU *
					</label>
					<input
						type="text"
						id="sku"
						name="sku"
						value={product?.sku}
						onChange={handleChange}
						required
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Enter SKU"
					/>
				</div>

				{/* Quantity */}
				<div>
					<label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
						Quantity *
					</label>
					<input
						type="number"
						id="quantity"
						name="quantity"
						value={product?.quantity}
						onChange={handleChange}
						required
						min="0"
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="0"
					/>
				</div>

				{/* Category */}
				<div>
					<label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
						Category *
					</label>
					<select
						id="category"
						name="category"
						value={product?.category}
						onChange={handleChange}
						required
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="">Select a category</option>
						{status === 'loading' ? (
							<option value="">Loading categories...</option>
						) : (
							categories?.map((category) => (
								<option key={category.id} value={category.name}>
									{category.name}
								</option>
							))
						)}
					</select>
				</div>

				{/* Description */}
				<div className="md:col-span-2">
					<label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
						Description
					</label>
					<textarea
						id="description"
						name="description"
						value={product.description}
						onChange={handleChange}
						rows={4}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Enter product description"
					/>
				</div>
			</div>

			<div className="mt-6 flex justify-end space-x-3">
				<button
					type="button"
					className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
					onClick={() => {
						dispatch(closeModal());
						dispatch(clearSelectedProduct());
					}}
				>
					Cancel
				</button>
				<button
					type="submit"
					className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
				>
					{isEdit ? 'Update Product' : 'Create Product'}
				</button>
			</div>
		</form>
	);
};
