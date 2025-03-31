import { useState } from "react";
import { useDispatch } from "react-redux";
import { FiX, FiMinus, FiPlus, FiHeart } from "react-icons/fi";
import { addToCart } from "../../store/slices/cartSlice";
import { addToWishlist } from "../../store/slices/wishlistSlice";
import toast from "react-hot-toast";

const QuickView = ({ product, onClose }) => {
	const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");
	const [selectedColor, setSelectedColor] = useState(
		product.colors?.[0] || ""
	);
	const [quantity, setQuantity] = useState(1);
	const dispatch = useDispatch();

	const handleQuantityChange = (value) => {
		const newQuantity = quantity + value;
		if (newQuantity >= 1 && newQuantity <= product.stockCount) {
			setQuantity(newQuantity);
		}
	};

	const handleAddToCart = async () => {
		if (!selectedSize && product.sizes?.length > 0) {
			toast.error("Please select a size");
			return;
		}
		if (!selectedColor && product.colors?.length > 0) {
			toast.error("Please select a color");
			return;
		}

		try {
			await dispatch(
				addToCart({
					...product,
					quantity,
					selectedSize,
					selectedColor,
				})
			).unwrap();
			toast.success("Added to cart");
			onClose();
		} catch (error) {
			toast.error(error.message || "Failed to add to cart");
		}
	};

	const handleAddToWishlist = async () => {
		try {
			await dispatch(addToWishlist(product.id)).unwrap();
			toast.success("Added to wishlist");
		} catch (error) {
			toast.error(error.message || "Failed to add to wishlist");
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
			<div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
				<div className="relative">
					<button
						onClick={onClose}
						className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
					>
						<FiX className="w-6 h-6" />
					</button>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
						{/* Product Image */}
						<div className="aspect-square rounded-lg overflow-hidden">
							<img
								src={product.image}
								alt={product.name}
								className="w-full h-full object-cover"
							/>
						</div>

						{/* Product Details */}
						<div className="space-y-6">
							<div>
								<h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
									{product.name}
								</h2>
								<p className="mt-2 text-xl font-semibold text-accent">
									${product.price}
								</p>
							</div>

							<p className="text-gray-600 dark:text-gray-300">
								{product.description}
							</p>

							{/* Size Selection */}
							{product.sizes?.length > 0 && (
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										Size
									</label>
									<div className="flex flex-wrap gap-2">
										{product.sizes.map((size) => (
											<button
												key={size}
												onClick={() =>
													setSelectedSize(size)
												}
												className={`px-4 py-2 rounded-md border ${
													selectedSize === size
														? "border-accent text-accent"
														: "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
												}`}
											>
												{size}
											</button>
										))}
									</div>
								</div>
							)}

							{/* Color Selection */}
							{product.colors?.length > 0 && (
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										Color
									</label>
									<div className="flex flex-wrap gap-2">
										{product.colors.map((color) => (
											<button
												key={color}
												onClick={() =>
													setSelectedColor(color)
												}
												className={`w-8 h-8 rounded-full border-2 ${
													selectedColor === color
														? "border-accent"
														: "border-transparent"
												}`}
												style={{
													backgroundColor: color,
												}}
											/>
										))}
									</div>
								</div>
							)}

							{/* Quantity Selection */}
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Quantity
								</label>
								<div className="flex items-center space-x-4">
									<button
										onClick={() => handleQuantityChange(-1)}
										className="p-2 rounded-md border border-gray-300 dark:border-gray-600"
									>
										<FiMinus className="w-4 h-4" />
									</button>
									<span className="text-lg font-medium">
										{quantity}
									</span>
									<button
										onClick={() => handleQuantityChange(1)}
										className="p-2 rounded-md border border-gray-300 dark:border-gray-600"
									>
										<FiPlus className="w-4 h-4" />
									</button>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex gap-4">
								<button
									onClick={handleAddToCart}
									className="flex-1 bg-accent hover:bg-accent-dark text-white py-3 rounded-md transition-colors"
								>
									Add to Cart
								</button>
								<button
									onClick={handleAddToWishlist}
									className="p-3 border border-gray-300 dark:border-gray-600 rounded-md hover:border-accent hover:text-accent transition-colors"
								>
									<FiHeart className="w-6 h-6" />
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default QuickView;
