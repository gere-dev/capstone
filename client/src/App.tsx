import './App.css';
import { Route, Routes } from 'react-router';
import { InventoryPage, LoginPage, OrdersPage, RegisterPage, SuppliersPage } from './pages';
import { ProtectedRoute, PublicRoute, ModalContainer } from './components/common';

function App() {
	return (
		<>
			<Routes>
				{/* Public Routes */}
				<Route element={<PublicRoute />}>
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
				</Route>

				{/* Protected routes */}
				<Route element={<ProtectedRoute />}>
					<Route path="/" element={<InventoryPage />} />
					<Route path="/suppliers" element={<SuppliersPage />} />
					<Route path="/orders" element={<OrdersPage />} />
				</Route>
			</Routes>

			{/* Modal */}
			<ModalContainer />
		</>
	);
}

export default App;
