import { Button } from '../../components/ui';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectStockReport } from '../../features/product/product.selector';
import { productThunk } from '../../features/product/product.thunk';
import { useEffect } from 'react';
import { clearStockReport } from '../../features/product/product.slice';

const tableHeaders = ['name', 'sku', 'address', 'category', 'status'];
export const ReportPage: React.FC = () => {
	const dispatch = useAppDispatch();

	const stockReport = useAppSelector(selectStockReport);

	useEffect(() => {
		return () => dispatch(clearStockReport());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<div className="container mx-auto px-4 py-8 relative">
				<h1 className="text-2xl font-bold mb-6 text-gray-800 ">Generate Report</h1>

				<div className="mb-3 flex gap-4 justify-between items-end ">
					<div className="flex gap-4">
						<Button
							style={{
								width: '200px',
								height: '100px',
							}}
							className="capitalize"
							variant="primary"
							onClick={() => {
								dispatch(productThunk.getStockLevel('low'));
							}}
						>
							Low in Stock
						</Button>
						<Button
							style={{
								width: '200px',
								height: '100px',
							}}
							className="capitalize"
							variant="primary"
							onClick={() => {
								dispatch(productThunk.getStockLevel('out'));
							}}
						>
							Out of Stock
						</Button>
					</div>
					{stockReport.generatedAt && (
						<div className="pt-2 ">
							<h2>
								<span className="font-bold">Title:</span> {stockReport.title}
							</h2>
							<h2>
								<span className="font-bold "> Date:</span>{' '}
								{new Date(stockReport.generatedAt).toLocaleString()}
							</h2>
						</div>
					)}
				</div>

				{/* Table */}
				<div className="bg-white rounded-lg border border-gray-200 overflow-hidden relative">
					<div className="overflow-y-auto h-[calc(100vh-19rem)] relative">
						<table className="min-w-full divide-y divide-gray-200 ">
							<TableHeaders headers={tableHeaders} />

							<tbody className="bg-white divide-y divide-gray-200">
								{stockReport.products?.map((product) => (
									<tr key={product.id} className="hover:bg-gray-50  border-b border-gray-200">
										<TableItemData item={product.name} />
										<TableItemData item={product.sku} />
										<TableItemData item={product.quantity} />
										<TableItemData item={product.status} />
										<TableItemData item={product.category} />
									</tr>
								))}
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
