import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { Toaster } from "react-hot-toast";

// Layout Components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/admin/AdminLayout";

// Page Components
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import OrderList from "./pages/OrderList";
import OrderDetails from "./pages/OrderDetails";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProductList from "./pages/admin/ProductList";
import AdminOrderList from "./pages/admin/OrderList";
import AdminUserList from "./pages/admin/UserList";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/Login";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminStaff from "./pages/admin/Staff";
import AdminSettings from "./pages/admin/Settings";

// Protected Route Component
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

function App() {
	return (
		<Provider store={store}>
			<Router>
				<div className="flex flex-col min-h-screen">
					<Header />
					<main className="flex-grow">
						<Routes>
							{/* Public Routes */}
							<Route
								path="/"
								element={
									<Layout>
										<Home />
									</Layout>
								}
							/>
							<Route
								path="/products"
								element={
									<Layout>
										<ProductList />
									</Layout>
								}
							/>
							<Route
								path="/products/:id"
								element={
									<Layout>
										<ProductDetails />
									</Layout>
								}
							/>
							<Route path="/login" element={<Login />} />
							<Route path="/register" element={<Register />} />

							{/* Protected Routes */}
							<Route
								path="/cart"
								element={
									<ProtectedRoute>
										<Layout>
											<Cart />
										</Layout>
									</ProtectedRoute>
								}
							/>
							<Route
								path="/wishlist"
								element={
									<ProtectedRoute>
										<Layout>
											<Wishlist />
										</Layout>
									</ProtectedRoute>
								}
							/>
							<Route
								path="/profile"
								element={
									<ProtectedRoute>
										<Layout>
											<Profile />
										</Layout>
									</ProtectedRoute>
								}
							/>
							<Route
								path="/orders"
								element={
									<ProtectedRoute>
										<Layout>
											<OrderList />
										</Layout>
									</ProtectedRoute>
								}
							/>
							<Route
								path="/orders/:id"
								element={
									<ProtectedRoute>
										<Layout>
											<OrderDetails />
										</Layout>
									</ProtectedRoute>
								}
							/>
							<Route
								path="/checkout"
								element={
									<ProtectedRoute>
										<Layout>
											<Checkout />
										</Layout>
									</ProtectedRoute>
								}
							/>

							{/* Admin Routes */}
							<Route
								path="/admin/login"
								element={<AdminLogin />}
							/>
							<Route
								path="/admin"
								element={
									<ProtectedRoute>
										<AdminLayout>
											<AdminDashboard />
										</AdminLayout>
									</ProtectedRoute>
								}
							/>
							<Route
								path="/admin/products"
								element={
									<ProtectedRoute>
										<AdminLayout>
											<AdminProducts />
										</AdminLayout>
									</ProtectedRoute>
								}
							/>
							<Route
								path="/admin/orders"
								element={
									<ProtectedRoute>
										<AdminLayout>
											<AdminOrders />
										</AdminLayout>
									</ProtectedRoute>
								}
							/>
							<Route
								path="/admin/staff"
								element={
									<ProtectedRoute requiredRole="admin">
										<AdminLayout>
											<AdminStaff />
										</AdminLayout>
									</ProtectedRoute>
								}
							/>
							<Route
								path="/admin/settings"
								element={
									<ProtectedRoute>
										<AdminLayout>
											<AdminSettings />
										</AdminLayout>
									</ProtectedRoute>
								}
							/>

							{/* 404 Route */}
							<Route path="*" element={<NotFound />} />
						</Routes>
					</main>
					<Footer />
					<Toaster position="top-right" />
				</div>
			</Router>
		</Provider>
	);
}

export default App;
