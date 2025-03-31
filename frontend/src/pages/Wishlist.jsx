import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FiShoppingCart, FiTrash2 } from "react-icons/fi";
import {
	fetchWishlist,
	removeFromWishlist,
} from "../store/slices/wishlistSlice";
import { addToCart } from "../store/slices/cartSlice";
import toast from "react-hot-toast";

const Wishlist = () => {
	const dispatch = useDispatch();
	const { items, loading } = useSelector((state) => state.wishlist);

	useEffect(() => {
		dispatch(fetchWishlist());
	}, [dispatch]);

	const handleRemoveFromWishlist = async (productId) => {
		try {
			await dispatch(removeFromWishlist(productId)).unwrap();
			toast.success("Removed from wishlist");
		} catch (error) {
			toast.error(error.message || "Failed to remove from wishlist");
		}
	};

	const handleAddToCart = async (product) => {
		try {
			await dispatch(addToCart({ ...product, quantity: 1 })).unwrap();
			await dispatch(removeFromWishlist(product.id)).unwrap();
			toast.success("Added to cart");
		} catch (error) {
			toast.error(error.message || "Failed to add to cart");
		}
	};

	if (loading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="animate-pulse space-y-4">
					{[...Array(4)].map((_, index) => (
						<div
							key={index}
							className="bg-gray-200 dark:bg-gray-700 h-32 rounded-lg"
						/>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-2xl font-heading font-bold mb-8">
				My Wishlist
			</h1>

			{items.length === 0 ? (
				<div className="text-center py-12">
					<p className="text-gray-600 dark:text-gray-400 mb-4">
						Your wishlist is empty
					</p>
					<Link
						to="/products"
						className="inline-block bg-accent hover:bg-accent-dark text-white px-6 py-2 rounded-md transition-colors"
					>
						Continue Shopping
					</Link>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{items.map((product) => (
						<div
							key={product.id}
							className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group"
						>
							<Link
								to={`/products/${product.id}`}
								className="block relative aspect-square"
							>
								<img
									src={product.image}
									alt={product.name}
									className="w-full h-full object-cover transition-transform group-hover:scale-105"
								/>
							</Link>
							<div className="p-4">
								<Link
									to={`/products/${product.id}`}
									className="text-lg font-medium hover:text-accent transition-colors"
								>
									{product.name}
								</Link>
								<div className="mt-2 flex items-center justify-between">
									<span className="text-accent font-semibold">
										${product.price}
									</span>
									<div className="flex items-center gap-2">
										<button
											onClick={() =>
												handleAddToCart(product)
											}
											className="p-2 text-gray-600 hover:text-accent dark:text-gray-400 dark:hover:text-accent transition-colors"
											title="Add to cart"
										>
											<FiShoppingCart className="w-5 h-5" />
										</button>
										<button
											onClick={() =>
												handleRemoveFromWishlist(
													product.id
												)
											}
											className="p-2 text-gray-600 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-500 transition-colors"
											title="Remove from wishlist"
										>
											<FiTrash2 className="w-5 h-5" />
										</button>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default Wishlist;
