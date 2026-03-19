import { AiFillEdit } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { Button, InputField } from '../../components/ui';
import type { IconType } from 'react-icons/lib';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Pagination } from '../../components/common';
import { useEffect, useMemo } from 'react';
import {
	categoryThunks,
	selectCategoryPagnation,
	selectPaginatedCategories,
	setCategoryCurrentPage,
	setCategoryPerPage,
} from '../../features/category';
import { openModal } from '../../features/modal';
import { EFormModalType } from '../../enums';
import { IoMdAdd } from 'react-icons/io';
import { debounce } from '../../utils';

const tableHeaders = ['name', 'created', 'updated', 'action'];
export const CategoriesPage: React.FC = () => {
	const dispatch = useAppDispatch();

	const paginatedCategories = useAppSelector(selectPaginatedCategories);
	const { currentPage, itemsPerPage, totalPages } = useAppSelector(selectCategoryPagnation);

	useEffect(() => {
		const fetchCategories = async () => {
			await dispatch(categoryThunks.getPaginatedCategories({ currentPage: currentPage, limit: itemsPerPage }));
		};
		fetchCategories();
	}, [dispatch, currentPage, itemsPerPage]);

	const debouncedSearch = useMemo(
		() =>
			debounce((term) => {
				dispatch(categoryThunks.searchCategory(term));
			}, 500),
		[dispatch],
	);

	useEffect(() => {
		return () => {
			debouncedSearch.cancel();
		};
	}, [debouncedSearch]);

	const handleChangePage = (pageNum: number) => {
		dispatch(setCategoryCurrentPage(pageNum));
	};

	const handleChangePerPage = (perPage: 10 | 25 | 50) => {
		dispatch(setCategoryPerPage(perPage));
		dispatch(setCategoryCurrentPage(1));
	};

	return (
		<>
			<div className="px-4 relative">
				{/* Search Bar */}
				<div className="flex max-w-2xl h-24 items-center justify-start">
					<span className="w-[400px]">
						<InputField
							type="text"
							placeholder="Search categories..."
							className="pl-3 border border-gray-200 rounded-lg outline-none w-sm bg-gray-100/50"
							onChange={(e) => {
								const term = e.target.value;
								debouncedSearch(term);
							}}
						/>
					</span>
					<Button
						onClick={() => {
							dispatch(openModal({ isEdit: false, modalType: EFormModalType.CATEGORY }));
						}}
						style={{
							width: '160px',
						}}
						className="capitalize h-12 flex items-center gap-2 justify-center"
						variant="primary"
					>
						<IoMdAdd />
						<span>add category</span>
					</Button>
				</div>

				{/* Table */}
				<div className="bg-white rounded-lg border border-gray-200 overflow-hidden relative">
					<div className="overflow-y-auto h-[calc(100vh-12.5rem)] relative">
						<table className="w-full table-fixed divide-y divide-gray-200">
							<TableHeaders headers={tableHeaders} />

							<tbody className="bg-white divide-y divide-gray-200">
								{paginatedCategories?.length > 0 ? (
									paginatedCategories?.map((category) => (
										<tr key={category.id} className="hover:bg-gray-50  border-b border-gray-200">
											<TableItemData item={category.name} />
											<TableItemData item={new Date(category.createdAt!).toLocaleDateString()} />
											<TableItemData item={new Date(category.updatedAt!).toLocaleDateString()} />

											<td className="p-4 whitespace-nowrap text-sm font-medium flex gap-3 w-1/4">
												<TableActionButton
													handleClick={() => {
														dispatch(categoryThunks.getCategoryById(category.id));
														dispatch(
															openModal({
																isEdit: true,
																modalType: EFormModalType.CATEGORY,
															}),
														);
													}}
													Icon={AiFillEdit}
												/>
												<TableActionButton
													handleClick={() => {
														dispatch(categoryThunks.deleteCategory(category.id));
													}}
													Icon={MdDelete}
												/>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={6} className="p-4 text-center text-sm text-gray-500">
											No categories found
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
			<tr className="bg-gray-50 sticky top-0 z-10  ">
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
		<td className="px-4 py-4 wrap-normal w-1/4 text-ellipsis  overflow-hidden">
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
