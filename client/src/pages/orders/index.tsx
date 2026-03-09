import { InputField } from '../../components/ui';
import type { IconType } from 'react-icons/lib';
import { AiFillEdit } from 'react-icons/ai';
import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { orderThunk } from '../../features/order/order.thunk';
import { selectOrders } from '../../features/order/order.selector';
import { debounce } from '../../utils';
import { openModal } from '../../features/modal';

const tableHeaders = ['name', 'product ', 'sku', 'address', 'status', 'actions'];

export const OrdersPage: React.FC = () => {
	const dispatch = useAppDispatch();

	const {
		orders,
		pagination: { currentPage, itemsPerPage },
	} = useAppSelector(selectOrders);

	useEffect(() => {
		dispatch(orderThunk.getAllOrders({ currentPage: currentPage, limit: itemsPerPage }));
	}, []);

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

	return (
		<>
			<div className="container mx-auto px-4 py-8 relative">
				<h1 className="text-2xl font-bold mb-6 text-gray-800 ">Orders</h1>

				{/* Search Bar */}
				<div className="mb-6 flex gap-4 w-full ">
					<InputField
						type="text"
						placeholder="Search Orders..."
						className="w-full flex-1"
						onChange={(e) => {
							const term = e.target.value;
							debouncedSearch(term);
						}}
					/>
				</div>

				{/* Table */}
				<div className="bg-white rounded-lg shadow overflow-hidden relative">
					<div className="overflow-y-auto h-[calc(100vh-19.5rem)] relative">
						<table className="min-w-full divide-y divide-gray-200 ">
							<TableHeaders headers={tableHeaders} />

							<tbody className="bg-white divide-y divide-gray-200">
								{orders?.length > 0 ? (
									orders?.map((order) => (
										<tr key={order.id} className="hover:bg-gray-50  border-b border-gray-200">
											<TableItemData item={order.name} />
											<TableItemData item={order.productName} />
											<TableItemData item={order.sku} />
											<TableItemData item={order.address} />
											<TableItemData item={order.status} />

											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-3 w-10">
												<TableActionButton
													handleClick={() => {
														dispatch(orderThunk.getOrderById(order.id));
														dispatch(openModal({ isEdit: true, modalType: 'order' }));
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
