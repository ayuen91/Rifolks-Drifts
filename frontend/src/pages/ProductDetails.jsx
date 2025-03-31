import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	fetchProductById,
	createProductReview,
} from "../store/slices/productSlice";
import { addToCart } from "../store/slices/cartSlice";
import { FaStar, FaStarHalf, FaShoppingCart } from "react-icons/fa";
import toast from "react-hot-toast";

const ProductDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { product, loading, error } = useSelector((state) => state.products);
	const { user } = useSelector((state) => state.auth);

	const [qty, setQty] = useState(1);
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");

	useEffect(() => {
		dispatch(fetchProductById(id));
	}, [dispatch, id]);

	const handleAddToCart = () => {
		dispatch(addToCart({ ...product, qty }));
		toast.success("Product added to cart");
		navigate("/cart");
	};

	const handleSubmitReview = (e) => {
		e.preventDefault();
		dispatch(createProductReview({ productId: id, rating, comment }))
			.unwrap()
			.then(() => {
				toast.success("Review submitted successfully");
				setRating(0);
				setComment("");
			})
			.catch((error) => {
				toast.error(error.message);
			});
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-red-500 text-center">{error}</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{/* Product Image */}
				<div className="rounded-lg overflow-hidden">
					<img
						src={product.image}
						alt={product.name}
						className="w-full h-[500px] object-cover"
					/>
				</div>

				{/* Product Info */}
				<div>
					<h1 className="text-3xl font-bold mb-4">{product.name}</h1>
					<div className="flex items-center mb-4">
						<div className="flex text-yellow-400">
							{[...Array(5)].map((_, index) => (
								<span key={index}>
									{index < Math.floor(product.rating) ? (
										<FaStar />
									) : index === Math.floor(product.rating) &&
									  product.rating % 1 !== 0 ? (
										<FaStarHalf />
									) : (
										<FaStar className="text-gray-300" />
									)}
								</span>
							))}
						</div>
						<span className="ml-2 text-gray-500">
							({product.numReviews} reviews)
						</span>
					</div>
					<p className="text-2xl font-semibold text-primary mb-4">
						${product.price}
					</p>
					<p className="text-gray-600 mb-6">{product.description}</p>

					{/* Add to Cart */}
					<div className="flex items-center space-x-4 mb-8">
						<select
							value={qty}
							onChange={(e) => setQty(Number(e.target.value))}
							className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
						>
							{[...Array(product.countInStock)].map(
								(_, index) => (
									<option key={index + 1} value={index + 1}>
										{index + 1}
									</option>
								)
							)}
						</select>
						<button
							onClick={handleAddToCart}
							disabled={product.countInStock === 0}
							className={`flex items-center space-x-2 px-6 py-2 rounded-md ${
								product.countInStock === 0
									? "bg-gray-400 cursor-not-allowed"
									: "bg-primary hover:bg-primary-dark"
							} text-white transition-colors`}
						>
							<FaShoppingCart />
							<span>Add to Cart</span>
						</button>
					</div>

					{/* Product Details */}
					<div className="border-t border-gray-200 pt-6">
						<h2 className="text-xl font-semibold mb-4">
							Product Details
						</h2>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-gray-600">Category</p>
								<p className="font-medium">
									{product.category}
								</p>
							</div>
							<div>
								<p className="text-gray-600">Brand</p>
								<p className="font-medium">{product.brand}</p>
							</div>
							<div>
								<p className="text-gray-600">Stock</p>
								<p className="font-medium">
									{product.countInStock > 0
										? "In Stock"
										: "Out of Stock"}
								</p>
							</div>
							<div>
								<p className="text-gray-600">SKU</p>
								<p className="font-medium">{product._id}</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Reviews Section */}
			<div className="mt-12">
				<h2 className="text-2xl font-bold mb-6">Reviews</h2>

				{/* Review Form */}
				{user && (
					<form onSubmit={handleSubmitReview} className="mb-8">
						<div className="mb-4">
							<label className="block text-gray-700 mb-2">
								Rating
							</label>
							<select
								value={rating}
								onChange={(e) =>
									setRating(Number(e.target.value))
								}
								className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
							>
								<option value="">Select Rating</option>
								<option value="5">5 - Excellent</option>
								<option value="4">4 - Good</option>
								<option value="3">3 - Fair</option>
								<option value="2">2 - Poor</option>
								<option value="1">1 - Very Poor</option>
							</select>
						</div>
						<div className="mb-4">
							<label className="block text-gray-700 mb-2">
								Comment
							</label>
							<textarea
								value={comment}
								onChange={(e) => setComment(e.target.value)}
								rows="4"
								className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
								placeholder="Write your review here..."
							></textarea>
						</div>
						<button
							type="submit"
							className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors"
						>
							Submit Review
						</button>
					</form>
				)}

				{/* Reviews List */}
				<div className="space-y-6">
					{product.reviews?.map((review) => (
						<div
							key={review._id}
							className="border-b border-gray-200 pb-6 last:border-b-0"
						>
							<div className="flex items-center mb-2">
								<div className="flex text-yellow-400">
									{[...Array(5)].map((_, index) => (
										<span key={index}>
											{index < review.rating ? (
												<FaStar />
											) : (
												<FaStar className="text-gray-300" />
											)}
										</span>
									))}
								</div>
								<span className="ml-2 text-gray-500">
									{new Date(
										review.createdAt
									).toLocaleDateString()}
								</span>
							</div>
							<p className="text-gray-600">{review.comment}</p>
							<p className="text-sm text-gray-500 mt-2">
								by {review.name}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default ProductDetails;
