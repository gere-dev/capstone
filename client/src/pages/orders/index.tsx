import { InputField } from '../../components/ui';
import type { IconType } from 'react-icons/lib';
import { AiFillEdit } from 'react-icons/ai';
import { memo, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { orderThunk } from '../../features/order/order.thunk';
import { selectOrders } from '../../features/order/order.selector';
import { debounce } from '../../utils';
import { openModal } from '../../features/modal';
import { setOrderCurrentPage, setOrdersPerPage } from '../../features/order/order.slice';
import { Pagination } from '../../components/common';
import { EFormModalType } from '../../enums';

const tableHeaders = ['sku', 'customer name', 'product ', 'total price', 'quantity', 'status', 'actions'];

export const OrdersPage: React.FC = memo(() => {
	const {
		orders,
		pagination: { currentPage, itemsPerPage, totalPages },
	} = useAppSelector(selectOrders);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(orderThunk.getAllOrders({ currentPage: currentPage, limit: itemsPerPage }));
	}, [dispatch, currentPage, itemsPerPage]);

	const debouncedSearch = useMemo(
		() =>
			debounce((term) => {
				dispatch(orderThunk.searchOrder(term));
			}, 500),
		[dispatch],
	);

	useEffect(() => {
		return () => {
			debouncedSearch.cancel();
		};
	}, [debouncedSearch]);

	const handleChangePage = (pageNum: number) => {
		dispatch(setOrderCurrentPage(pageNum));
	};

	const handleChangePerPage = (perPage: number) => {
		dispatch(setOrdersPerPage(perPage));
		dispatch(setOrderCurrentPage(1));
	};

	return (
		<>
			<div className=" px-4 relative">
				{/* Search Bar */}
				<div className="flex max-w-2xl h-24 items-center justify-start">
					<span className="w-[400px]">
						<InputField
							type="text"
							placeholder="Search orders..."
							className="pl-3 border border-gray-200 rounded-lg focus:outline-none flex-8 w-sm bg-gray-100/50"
							onChange={(e) => {
								const term = e.target.value;
								debouncedSearch(term);
							}}
						/>
					</span>
				</div>

				{/* Table */}
				<div className="bg-white rounded-lg border border-gray-200 overflow-hidden relative">
					<div className="overflow-y-auto h-[calc(100vh-12.5rem)] relative">
						<table className="w-full table-fixed  divide-y divide-gray-200 ">
							<TableHeaders headers={tableHeaders} />

							<tbody className="bg-white divide-y divide-gray-200">
								{orders?.length > 0 ? (
									orders?.map((order) => (
										<tr key={order.id} className="hover:bg-gray-50  border-b border-gray-200">
											<TableItemData item={order.sku} />
											<TableItemData item={order.name} />
											<TableItemData item={order.productName} />
											<TableItemData
												item={'$' + Number(order.productPrice * order.quantity).toFixed(2)}
											/>
											<TableItemData item={order.quantity} />
											<TableItemData item={order.status} />

											<td className="p-4 whitespace-nowrap text-sm font-medium w-1/7">
												<TableActionButton
													handleClick={() => {
														dispatch(orderThunk.getOrderById(order.id));
														dispatch(
															openModal({
																isEdit: true,
																modalType: EFormModalType.ORDER,
															}),
														);
													}}
													Icon={AiFillEdit}
												/>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
											No orders found
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
});

const TableHeaders = ({ headers }: { headers: string[] }) => {
	return (
		<thead>
			<tr className="bg-gray-100 sticky top-0 z-10 w-1/7 ">
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
		<td className="px-4 py-4  w-1/7 text-ellipsis  overflow-hidden">
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
