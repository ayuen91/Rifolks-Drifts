import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
	FiSearch,
	FiHeart,
	FiShoppingCart,
	FiSun,
	FiMoon,
} from "react-icons/fi";
import logo from "../../assets/logo.svg";
import Loading from "../Loading";

const Layout = ({ children }) => {
	const [darkMode, setDarkMode] = useState(false);
	const [showSearch, setShowSearch] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const location = useLocation();
	const cartItems = useSelector((state) => state.cart.items);

	useEffect(() => {
		// Check for dark mode preference
		if (
			localStorage.getItem("darkMode") === "true" ||
			(!localStorage.getItem("darkMode") &&
				window.matchMedia("(prefers-color-scheme: dark)").matches)
		) {
			setDarkMode(true);
			document.documentElement.classList.add("dark");
		}
	}, []);

	useEffect(() => {
		// Simulate loading time when route changes
		setIsLoading(true);
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 1500); // Adjust timing as needed

		return () => clearTimeout(timer);
	}, [location]);

	const toggleDarkMode = () => {
		setDarkMode(!darkMode);
		document.documentElement.classList.toggle("dark");
		localStorage.setItem("darkMode", !darkMode);
	};

	if (isLoading) {
		return <Loading />;
	}

	return (
		<div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300">
			{/* Header */}
			<header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm">
				<div className="container mx-auto px-4">
					<div className="flex items-center justify-between h-16">
						{/* Logo */}
						<Link to="/" className="flex items-center space-x-2">
							<img
								src={logo}
								alt="Rifolks Drifts"
								className="w-10 h-10"
							/>
							<span className="text-xl font-heading font-bold">
								Rifolks Drifts
							</span>
						</Link>

						{/* Navigation */}
						<nav className="hidden md:flex items-center space-x-8">
							<Link
								to="/men"
								className="hover:text-accent transition-colors"
							>
								Men
							</Link>
							<Link
								to="/women"
								className="hover:text-accent transition-colors"
							>
								Women
							</Link>
							<Link
								to="/accessories"
								className="hover:text-accent transition-colors"
							>
								Accessories
							</Link>
							<Link
								to="/new-arrivals"
								className="hover:text-accent transition-colors"
							>
								New Arrivals
							</Link>
							<Link
								to="/sale"
								className="text-accent hover:text-accent-dark transition-colors"
							>
								Sale
							</Link>
						</nav>

						{/* Icons */}
						<div className="flex items-center space-x-4">
							{/* Search */}
							<div className="relative">
								<button
									onClick={() => setShowSearch(!showSearch)}
									className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
								>
									<FiSearch className="w-5 h-5" />
								</button>
								{showSearch && (
									<div className="absolute left-0 right-0 top-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-800 p-4">
										<div className="container mx-auto">
											<input
												type="text"
												placeholder="Search products..."
												className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent dark:bg-gray-700 dark:border-gray-600"
											/>
										</div>
									</div>
								)}
							</div>

							{/* Wishlist */}
							<Link
								to="/wishlist"
								className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
							>
								<FiHeart className="w-5 h-5" />
							</Link>

							{/* Cart */}
							<Link
								to="/cart"
								className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors relative"
							>
								<FiShoppingCart className="w-5 h-5" />
								{cartItems.length > 0 && (
									<span className="absolute -top-1 -right-1 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
										{cartItems.length}
									</span>
								)}
							</Link>

							{/* Dark Mode Toggle */}
							<button
								onClick={toggleDarkMode}
								className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
							>
								{darkMode ? (
									<FiSun className="w-5 h-5" />
								) : (
									<FiMoon className="w-5 h-5" />
								)}
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main>{children}</main>

			{/* Footer */}
			<footer className="bg-gray-800 dark:bg-gray-900 text-white mt-16">
				<div className="container mx-auto px-4 py-12">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						{/* Company Info */}
						<div>
							<h3 className="font-heading text-lg font-bold mb-4">
								Rifolks-Drifts
							</h3>
							<p className="text-gray-400">
								Effortless style for men & women. Discover the
								latest trends tailored for you.
							</p>
						</div>

						{/* Quick Links */}
						<div>
							<h3 className="font-heading text-lg font-bold mb-4">
								Quick Links
							</h3>
							<ul className="space-y-2">
								<li>
									<Link
										to="/about"
										className="text-gray-400 hover:text-white transition-colors"
									>
										About Us
									</Link>
								</li>
								<li>
									<Link
										to="/contact"
										className="text-gray-400 hover:text-white transition-colors"
									>
										Contact
									</Link>
								</li>
								<li>
									<Link
										to="/faq"
										className="text-gray-400 hover:text-white transition-colors"
									>
										FAQ
									</Link>
								</li>
								<li>
									<Link
										to="/shipping"
										className="text-gray-400 hover:text-white transition-colors"
									>
										Shipping
									</Link>
								</li>
							</ul>
						</div>

						{/* Customer Service */}
						<div>
							<h3 className="font-heading text-lg font-bold mb-4">
								Customer Service
							</h3>
							<ul className="space-y-2">
								<li>
									<Link
										to="/orders"
										className="text-gray-400 hover:text-white transition-colors"
									>
										Track Order
									</Link>
								</li>
								<li>
									<Link
										to="/returns"
										className="text-gray-400 hover:text-white transition-colors"
									>
										Returns
									</Link>
								</li>
								<li>
									<Link
										to="/size-guide"
										className="text-gray-400 hover:text-white transition-colors"
									>
										Size Guide
									</Link>
								</li>
								<li>
									<Link
										to="/gift-cards"
										className="text-gray-400 hover:text-white transition-colors"
									>
										Gift Cards
									</Link>
								</li>
							</ul>
						</div>

						{/* Newsletter */}
						<div>
							<h3 className="font-heading text-lg font-bold mb-4">
								Newsletter
							</h3>
							<p className="text-gray-400 mb-4">
								Subscribe to get 10% off your first order and
								receive updates about new products.
							</p>
							<form className="flex">
								<input
									type="email"
									placeholder="Enter your email"
									className="flex-1 px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-accent dark:bg-gray-700 dark:border-gray-600"
								/>
								<button
									type="submit"
									className="bg-accent hover:bg-accent-dark px-4 py-2 rounded-r-md transition-colors"
								>
									Subscribe
								</button>
							</form>
						</div>
					</div>

					{/* Bottom Bar */}
					<div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
						<p>
							&copy; {new Date().getFullYear()} Rifolks-Drifts.
							All rights reserved.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Layout;
