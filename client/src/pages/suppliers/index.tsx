import { AiFillEdit } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { Button, InputField } from '../../components/ui';
import type { IconType } from 'react-icons/lib';
import { selectSuppliers } from '../../features/supplier/supplier.selectors';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useEffect, useMemo } from 'react';
import { setSupplierCurrentPage, setSupplierPerPage, supplierThunk } from '../../features/supplier';
import { debounce } from '../../utils';
import { Pagination } from '../../components/common';
import { openModal } from '../../features/modal';
import { EFormModalType } from '../../enums';
import { IoMdAdd } from 'react-icons/io';

const tableHeaders = ['name', 'contact', 'address', 'actions'];
export const SuppliersPage: React.FC = () => {
	const {
		suppliers,
		pagination: { currentPage, itemsPerPage, totalPages },
	} = useAppSelector(selectSuppliers);

	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(supplierThunk.getAllSuppliers({ currentPage: currentPage, limit: itemsPerPage }));
	}, [dispatch, currentPage, itemsPerPage]);

	const debouncedSearch = useMemo(
		() =>
			debounce((term) => {
				dispatch(supplierThunk.searchSupplier(term));
			}, 500),
		[dispatch],
	);

	useEffect(() => {
		return () => {
			debouncedSearch.cancel();
		};
	}, [debouncedSearch]);

	const handleChangePage = (pageNum: number) => {
		dispatch(setSupplierCurrentPage(pageNum));
	};

	const handleChangePerPage = (perPage: number) => {
		dispatch(setSupplierPerPage(perPage));
		dispatch(setSupplierCurrentPage(1));
	};

	return (
		<>
			<div className="px-4 relative">
				{/* Search Bar */}
				<div className="flex max-w-2xl h-24 items-center justify-start">
					<span className="w-[400px]">
						<InputField
							type="text"
							placeholder="Search suppliers..."
							className="pl-3 border border-gray-200 rounded-lg outline-none w-sm bg-gray-100/50"
							onChange={(e) => {
								const term = e.target.value;
								debouncedSearch(term);
							}}
						/>
					</span>

					<Button
						onClick={() => {
							dispatch(openModal({ isEdit: false, modalType: EFormModalType.SUPPLIER }));
						}}
						style={{
							width: '160px',
						}}
						className="capitalize h-12 flex items-center gap-2 justify-center"
						variant="primary"
					>
						<IoMdAdd />
						<span>add supplier</span>
					</Button>
				</div>

				{/* Table */}
				<div className="bg-white rounded-lg  border border-gray-200  relative">
					<div className="overflow-y-auto h-[calc(100vh-12.5rem)] relative">
						<table className="w-full table-fixed divide-y divide-gray-200">
							<TableHeaders headers={tableHeaders} />

							<tbody className="bg-white divide-y divide-gray-200">
								{suppliers?.length > 0 ? (
									suppliers?.map((supplier) => (
										<tr key={supplier.id} className="hover:bg-gray-50 border-b border-gray-200">
											<TableItemData item={supplier.name} />
											<TableItemData item={supplier.contact} />
											<TableItemData item={supplier?.address} />
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium w-1/4">
												<div className="flex gap-3">
													<TableActionButton
														handleClick={async () => {
															await dispatch(supplierThunk.getSupplierById(supplier.id));
															dispatch(
																openModal({
																	isEdit: true,
																	modalType: EFormModalType.SUPPLIER,
																}),
															);
														}}
														Icon={AiFillEdit}
													/>
													<TableActionButton
														handleClick={() =>
															dispatch(supplierThunk.deleteSupplier(supplier.id))
														}
														Icon={MdDelete}
													/>
												</div>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
											No suppliers found
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
				{/* Pagination */}
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
			<tr className="bg-gray-50 sticky top-0 z-10">
				{headers.map((title, index) => (
					<th
						key={title + index}
						className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4"
					>
						{title}
					</th>
				))}
			</tr>
		</thead>
	);
};

const TableItemData = ({ item }: { item: string | number | undefined }) => {
	return (
		<td className="px-4 py-4 w-1/4 text-ellipsis overflow-hidden">
			<p className="text-sm font-medium text-gray-900 truncate">{item}</p>
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
			className="text-gray-500 shrink-0"
		>
			<Icon size={20} />
		</button>
	);
};
