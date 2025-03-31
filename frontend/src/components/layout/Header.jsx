import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { FaShoppingCart, FaUser, FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { user } = useSelector((state) => state.auth);
	const { cartItems } = useSelector((state) => state.cart);
	const dispatch = useDispatch();

	const cartItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

	const logoutHandler = () => {
		dispatch(logout());
	};

	return (
		<header className="bg-white shadow-md">
			<nav className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between">
					{/* Logo */}
					<Link to="/" className="text-2xl font-bold text-primary">
						RiFolks Drifts
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-8">
						<Link
							to="/products"
							className="text-gray-600 hover:text-primary"
						>
							Products
						</Link>
						<Link
							to="/cart"
							className="text-gray-600 hover:text-primary relative"
						>
							<FaShoppingCart className="text-xl" />
							{cartItemsCount > 0 && (
								<span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
									{cartItemsCount}
								</span>
							)}
						</Link>
						{user ? (
							<div className="relative group">
								<button className="flex items-center text-gray-600 hover:text-primary">
									<FaUser className="text-xl mr-2" />
									{user.name}
								</button>
								<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 hidden group-hover:block">
									<Link
										to="/profile"
										className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
									>
										Profile
									</Link>
									<Link
										to="/orders"
										className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
									>
										Orders
									</Link>
									{user.isAdmin && (
										<Link
											to="/admin"
											className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
										>
											Admin Dashboard
										</Link>
									)}
									<button
										onClick={logoutHandler}
										className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
									>
										Logout
									</button>
								</div>
							</div>
						) : (
							<Link
								to="/login"
								className="text-gray-600 hover:text-primary"
							>
								Login
							</Link>
						)}
					</div>

					{/* Mobile Menu Button */}
					<button
						className="md:hidden text-gray-600 hover:text-primary"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					>
						{isMenuOpen ? (
							<FaTimes size={24} />
						) : (
							<FaBars size={24} />
						)}
					</button>
				</div>

				{/* Mobile Navigation */}
				{isMenuOpen && (
					<div className="md:hidden mt-4 space-y-4">
						<Link
							to="/products"
							className="block text-gray-600 hover:text-primary"
							onClick={() => setIsMenuOpen(false)}
						>
							Products
						</Link>
						<Link
							to="/cart"
							className="block text-gray-600 hover:text-primary relative"
							onClick={() => setIsMenuOpen(false)}
						>
							<span className="flex items-center">
								Cart
								{cartItemsCount > 0 && (
									<span className="ml-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
										{cartItemsCount}
									</span>
								)}
							</span>
						</Link>
						{user ? (
							<>
								<Link
									to="/profile"
									className="block text-gray-600 hover:text-primary"
									onClick={() => setIsMenuOpen(false)}
								>
									Profile
								</Link>
								<Link
									to="/orders"
									className="block text-gray-600 hover:text-primary"
									onClick={() => setIsMenuOpen(false)}
								>
									Orders
								</Link>
								{user.isAdmin && (
									<Link
										to="/admin"
										className="block text-gray-600 hover:text-primary"
										onClick={() => setIsMenuOpen(false)}
									>
										Admin Dashboard
									</Link>
								)}
								<button
									onClick={() => {
										logoutHandler();
										setIsMenuOpen(false);
									}}
									className="block w-full text-left text-gray-600 hover:text-primary"
								>
									Logout
								</button>
							</>
						) : (
							<Link
								to="/login"
								className="block text-gray-600 hover:text-primary"
								onClick={() => setIsMenuOpen(false)}
							>
								Login
							</Link>
						)}
					</div>
				)}
			</nav>
		</header>
	);
};

export default Header;
