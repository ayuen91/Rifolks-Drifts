import { useState } from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart, FiHeart, FiEye } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/slices/cartSlice";
import { addToWishlist } from "../store/slices/wishlistSlice";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
	const [isHovered, setIsHovered] = useState(false);
	const [showQuickView, setShowQuickView] = useState(false);
	const dispatch = useDispatch();

	const handleAddToCart = () => {
		dispatch(addToCart({ ...product, qty: 1 }));
		toast.success("Added to cart!");
	};

	const handleAddToWishlist = () => {
		dispatch(addToWishlist(product));
		toast.success("Added to wishlist!");
	};

	return (
		<div
			className="group relative"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* Product Image */}
			<div className="relative aspect-square overflow-hidden rounded-lg">
				<img
					src={
						isHovered && product.backImage
							? product.backImage
							: product.image
					}
					alt={product.name}
					className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
				/>

				{/* Quick Actions */}
				<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center gap-2">
					<button
						onClick={handleAddToWishlist}
						className="bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
					>
						<FiHeart className="w-5 h-5" />
					</button>
					<button
						onClick={() => setShowQuickView(true)}
						className="bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
					>
						<FiEye className="w-5 h-5" />
					</button>
					<button
						onClick={handleAddToCart}
						className="bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
					>
						<FiShoppingCart className="w-5 h-5" />
					</button>
				</div>
			</div>

			{/* Product Info */}
			<div className="mt-4">
				<Link
					to={`/products/${product._id}`}
					className="font-medium hover:text-accent transition-colors"
				>
					{product.name}
				</Link>
				<div className="flex items-center justify-between mt-1">
					<div className="flex items-center gap-2">
						<span className="text-accent font-semibold">
							${product.price}
						</span>
						{product.oldPrice && (
							<span className="text-gray-400 line-through text-sm">
								${product.oldPrice}
							</span>
						)}
					</div>
					{product.rating && (
						<div className="flex items-center gap-1">
							<span className="text-yellow-400">★</span>
							<span className="text-sm text-gray-600 dark:text-gray-400">
								({product.numReviews})
							</span>
						</div>
					)}
				</div>
			</div>

			{/* Quick View Modal */}
			{showQuickView && (
				<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
					<div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							<div className="flex justify-between items-start mb-4">
								<h3 className="text-xl font-heading font-bold">
									{product.name}
								</h3>
								<button
									onClick={() => setShowQuickView(false)}
									className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
								>
									✕
								</button>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="aspect-square">
									<img
										src={product.image}
										alt={product.name}
										className="w-full h-full object-cover rounded-lg"
									/>
								</div>
								<div>
									<p className="text-2xl font-bold text-accent mb-2">
										${product.price}
									</p>
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										{product.description}
									</p>
									<div className="space-y-4">
										<div>
											<label className="block text-sm font-medium mb-1">
												Size
											</label>
											<select className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent">
												{product.sizes?.map((size) => (
													<option
														key={size}
														value={size}
													>
														{size}
													</option>
												))}
											</select>
										</div>
										<div>
											<label className="block text-sm font-medium mb-1">
												Color
											</label>
											<div className="flex gap-2">
												{product.colors?.map(
													(color) => (
														<button
															key={color}
															className="w-8 h-8 rounded-full border-2 border-transparent hover:border-accent"
															style={{
																backgroundColor:
																	color,
															}}
														/>
													)
												)}
											</div>
										</div>
										<button
											onClick={handleAddToCart}
											className="w-full bg-accent hover:bg-accent-dark text-white py-2 rounded-md transition-colors"
										>
											Add to Cart
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProductCard;
