import { useState, useEffect, ReactNode } from "react"; // Added ReactNode
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"; // Import TypedUseSelectorHook
import { Link, useNavigate, useLocation } from "react-router-dom"; // Use v6 hooks
import {
	FiBell,
	FiUsers,
	FiPackage,
	FiShoppingBag,
	FiSettings,
	FiLogOut,
} from "react-icons/fi";
import { logout } from "../../store/slices/authSlice";
import { fetchNotifications } from "../../store/slices/notificationSlice";
import { RootState, AppDispatch } from "../../store/store"; // Import store types
import NotificationsDropdown from "./NotificationsDropdown";
import logo from "../../assets/logo.svg";

// Removed unused imports: UserManagement, ProductManagement, AnalyticsReporting, InventoryManagement

// Define the props type
interface AdminLayoutProps {
  children: ReactNode;
}

// Create typed hooks
const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Define the component
const AdminLayout = ({ children }: AdminLayoutProps) => {
	const [showNotifications, setShowNotifications] = useState(false);
	const dispatch = useAppDispatch(); // Use typed dispatch
	const navigate = useNavigate(); // Use v6 hook
	const location = useLocation();
	// Use typed selector and access role from user metadata
	const user = useAppSelector((state) => state.auth.user);
	// Use typed selector and access role from user metadata safely (using any for now)
	const role = (user as any)?.user_metadata?.role as string | undefined;
	// Use typed selector for notifications, provide default
	const { unreadCount = 0 } = useAppSelector((state) => state.notifications) ?? {};

	useEffect(() => {
		// Only fetch notifications if dispatch is available
		if (dispatch) {
			dispatch(fetchNotifications());
			const interval = setInterval(() => {
				dispatch(fetchNotifications());
			}, 30000); // Fetch notifications every 30 seconds

			return () => clearInterval(interval);
		}
	}, [dispatch]);

	const handleLogout = () => {
		// No need to check dispatch now with typed hook
		dispatch(logout());
		navigate("/admin/login"); // Use v6 navigation
	}; // Removed extra brace

	const navigation = [
		{ name: "Dashboard", path: "/admin", icon: FiShoppingBag },
		{ name: "Products", path: "/admin/products", icon: FiPackage },
		{ name: "Orders", path: "/admin/orders", icon: FiShoppingBag },
		...(role === "admin"
			? [{ name: "Staff", path: "/admin/staff", icon: FiUsers }]
			: []),
		{ name: "Settings", path: "/admin/settings", icon: FiSettings },
	];

	return (
		<div className="min-h-screen bg-gray-100 dark:bg-gray-900">
			{/* Sidebar */}
			<div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg">
				<div className="flex flex-col h-full">
					{/* Logo */}
					<div className="flex items-center p-4 border-b dark:border-gray-700">
						<img
							src={logo}
							alt="Rifolks Drifts"
							className="w-8 h-8"
						/>
						<span className="ml-2 text-lg font-heading font-bold">
							Admin Panel
						</span>
					</div>

					{/* Navigation */}
					<nav className="flex-1 p-4 space-y-1">
						{navigation.map((item) => {
							const Icon = item.icon;
							const isActive = location.pathname === item.path;
							return (
								<Link
									key={item.name}
									to={item.path}
									className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
										isActive
											? "bg-accent text-white"
											: "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
									}`}
								>
									<Icon className="w-5 h-5 mr-3" />
									{item.name}
								</Link>
							);
						})}
					</nav>

					{/* User Info */}
					<div className="p-4 border-t dark:border-gray-700">
						<div className="flex items-center">
							<div className="flex-1">
								{/* Access name via user_metadata or email as fallback (using any) */}
								<p className="font-medium">{(user as any)?.user_metadata?.name || (user as any)?.email || 'User'}</p>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									{role || 'Role'}
								</p>
							</div>
							<button
								onClick={handleLogout}
								className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
							>
								<FiLogOut className="w-5 h-5" />
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="ml-64">
				{/* Header */}
				<header className="bg-white dark:bg-gray-800 shadow-sm">
					<div className="flex items-center justify-between px-6 py-4">
						<h1 className="text-2xl font-heading font-bold">
							{navigation.find(
								(item) => item.path === location.pathname
							)?.name || "Dashboard"}
						</h1>

						{/* Notifications */}
						<div className="relative">
							<button
								onClick={() =>
									setShowNotifications(!showNotifications)
								}
								className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 relative"
							>
								<FiBell className="w-6 h-6" />
								{unreadCount > 0 && (
									<span className="absolute -top-1 -right-1 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
										{unreadCount}
									</span>
								)}
							</button>
							{showNotifications && (
								<NotificationsDropdown
									onClose={() => setShowNotifications(false)}
								/>
							)}
						</div>
					</div>
				</header>

				{/* Page Content */}
				<main className="p-6">{children}</main> {/* Removed 'as React.ReactNode' */}
			</div>
		</div>
	);
};

export default AdminLayout;
