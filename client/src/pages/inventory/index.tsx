import React, { useEffect, useMemo, useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { AiFillEdit } from 'react-icons/ai';
import { type IconType } from 'react-icons/lib';
import { Button } from '../../components/ui';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectAllProducts, selectPagination } from '../../features/product/product.selector';
import { productThunk } from '../../features/product/product.thunk';
import { openModal } from '../../features/modal';
import { debounce } from '../../utils';
import { Pagination } from '../../components/common';
import { setProductCurrentPage, setProductsPerPage } from '../../features/product/product.slice';
import { IoBagHandleSharp } from 'react-icons/io5';

const tableHeaders = ['name', 'sku', 'category', 'quantity', 'status', 'action'];

export const InventoryPage: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState('');

	const { currentPage, itemsPerPage, totalPages } = useAppSelector(selectPagination);
	const products = useAppSelector(selectAllProducts);

	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(productThunk.getAllProduct({ currentPage: currentPage, limit: itemsPerPage }));
	}, [dispatch, currentPage, itemsPerPage]);

	const handleDelete = (id: string) => {
		dispatch(productThunk.deleteProduct(id));
	};

	const handleUpdate = (id: string) => {
		dispatch(openModal({ isEdit: true, modalType: 'product' }));
		dispatch(productThunk.getProductById(id));
	};

	const handleChangePage = (pageNum: number) => {
		dispatch(setProductCurrentPage(pageNum));
	};

	const handleChangePerPage = (perPage: number) => {
		dispatch(setProductsPerPage(perPage));
		dispatch(setProductCurrentPage(1));
	};

	const debouncedSearch = useMemo(
		() =>
			debounce((term) => {
				dispatch(productThunk.searchProduct(term));
			}, 500),
		[dispatch],
	);

	useEffect(() => {
		return () => {
			debouncedSearch.cancel();
		};
	}, [debouncedSearch]);

	return (
		<>
			<div className="container mx-auto px-4 py-8 relative">
				<h1 className="text-2xl font-bold mb-6 text-gray-800 ">Inventory</h1>

				{/* Search Bar */}
				<div className="mb-6 flex gap-4  ">
					<input
						type="text"
						placeholder="Search products..."
						className="p-3 border border-gray-300 rounded-lg focus:outline-none flex-8"
						value={searchTerm}
						onChange={(e) => {
							const term = e.target.value;
							debouncedSearch(term);
							setSearchTerm(term);
						}}
					/>
					<Button
						className="capitalize flex-1"
						variant="primary"
						onClick={() => dispatch(openModal({ isEdit: false, modalType: 'product' }))}
					>
						add Product
					</Button>
				</div>

				{/* Table */}
				<div className="bg-white rounded-lg shadow overflow-hidden relative">
					<div className="overflow-y-auto h-[calc(100vh-19.5rem)] relative">
						<table className="min-w-full divide-y divide-gray-200 ">
							<TableHeaders headers={tableHeaders} />

							<tbody className="bg-white divide-y divide-gray-200">
								{products?.length > 0 ? (
									products?.map((product) => (
										<tr key={product.id} className="hover:bg-gray-50  border-b border-gray-200">
											<TableItemData item={product.name} />
											<TableItemData item={product.sku} />
											<TableItemData item={product.category} />
											<TableItemData item={product.quantity} />
											<td className="px-6 py-4 w-1/6">
												<span
													className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full  
                      ${
							product.status === 'In Stock'
								? 'bg-green-100 text-green-800'
								: product.status === 'Low Stock'
									? 'bg-yellow-100 text-yellow-800'
									: 'bg-red-100 text-red-800'
						}`}
												>
													{product.status}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-3 w-1/6">
												<TableActionButton
													handleClick={() => handleUpdate(product.id)}
													Icon={AiFillEdit}
												/>
												<TableActionButton
													handleClick={() => handleDelete(product.id)}
													Icon={MdDelete}
												/>
												<TableActionButton
													handleClick={() => {
														dispatch(productThunk.getProductById(product.id));
														dispatch(openModal({ modalType: 'order', isEdit: false }));
													}}
													Icon={IoBagHandleSharp}
												/>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
											No products found
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>

					{/* Pagination */}
				</div>
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					itemsPerPage={itemsPerPage}
					onPageChange={handleChangePage}
					onPerPageChange={handleChangePerPage}
				/>
			</div>
		</>
	);
};

const TableHeaders = ({ headers }: { headers: string[] }) => {
	return (
		<thead>
			<tr className="bg-gray-50 sticky top-0 z-10 w-1/6 ">
				{headers.map((title, index) => (
					<th
						key={title + index}
						className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
					>
						{title}
					</th>
				))}
			</tr>
		</thead>
	);
};

const TableItemData = ({ item }: { item: string | number }) => {
	return (
		<td className="px-4 py-4 wrap-normal w-1/6 text-ellipsis">
			<p className="text-sm font-medium text-gray-900 text-ellipsis">{item}</p>
		</td>
	);
};

const TableActionButton = ({ handleClick, Icon }: { handleClick: () => void; Icon: IconType }) => {
	return (
		<button
			onClick={(e) => {
				e.stopPropagation();
				handleClick();
			}}
			className="text-gray-500"
		>
			<Icon size={20} />
		</button>
	);
};
