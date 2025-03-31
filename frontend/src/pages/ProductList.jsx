import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchProducts } from "../store/slices/productSlice";
import { FaSearch, FaFilter, FaSort } from "react-icons/fa";

const ProductList = () => {
	const dispatch = useDispatch();
	const [searchParams, setSearchParams] = useSearchParams();
	const { products, loading, error } = useSelector((state) => state.products);

	const [filters, setFilters] = useState({
		category: searchParams.get("category") || "",
		minPrice: searchParams.get("minPrice") || "",
		maxPrice: searchParams.get("maxPrice") || "",
		rating: searchParams.get("rating") || "",
	});

	const [sort, setSort] = useState(searchParams.get("sort") || "newest");

	useEffect(() => {
		dispatch(fetchProducts({ ...filters, sort }));
	}, [dispatch, filters, sort]);

	const handleFilterChange = (e) => {
		const { name, value } = e.target;
		setFilters((prev) => ({ ...prev, [name]: value }));
		setSearchParams((prev) => ({ ...prev, [name]: value }));
	};

	const handleSortChange = (e) => {
		const value = e.target.value;
		setSort(value);
		setSearchParams((prev) => ({ ...prev, sort: value }));
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex flex-col md:flex-row justify-between items-center mb-8">
				<h1 className="text-3xl font-bold mb-4 md:mb-0">
					All Products
				</h1>

				{/* Sort Options */}
				<div className="flex items-center space-x-2">
					<FaSort className="text-gray-500" />
					<select
						value={sort}
						onChange={handleSortChange}
						className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
					>
						<option value="newest">Newest</option>
						<option value="price-asc">Price: Low to High</option>
						<option value="price-desc">Price: High to Low</option>
						<option value="rating-desc">Highest Rated</option>
					</select>
				</div>
			</div>

			<div className="flex flex-col md:flex-row gap-8">
				{/* Filters Sidebar */}
				<div className="w-full md:w-64 bg-white p-6 rounded-lg shadow-md">
					<h2 className="text-xl font-semibold mb-4 flex items-center">
						<FaFilter className="mr-2" />
						Filters
					</h2>

					{/* Category Filter */}
					<div className="mb-6">
						<label className="block text-gray-700 mb-2">
							Category
						</label>
						<select
							name="category"
							value={filters.category}
							onChange={handleFilterChange}
							className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
						>
							<option value="">All Categories</option>
							<option value="men">Men's</option>
							<option value="women">Women's</option>
							<option value="accessories">Accessories</option>
						</select>
					</div>

					{/* Price Range Filter */}
					<div className="mb-6">
						<label className="block text-gray-700 mb-2">
							Price Range
						</label>
						<div className="flex space-x-2">
							<input
								type="number"
								name="minPrice"
								value={filters.minPrice}
								onChange={handleFilterChange}
								placeholder="Min"
								className="w-1/2 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
							/>
							<input
								type="number"
								name="maxPrice"
								value={filters.maxPrice}
								onChange={handleFilterChange}
								placeholder="Max"
								className="w-1/2 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
							/>
						</div>
					</div>

					{/* Rating Filter */}
					<div className="mb-6">
						<label className="block text-gray-700 mb-2">
							Minimum Rating
						</label>
						<select
							name="rating"
							value={filters.rating}
							onChange={handleFilterChange}
							className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
						>
							<option value="">Any Rating</option>
							<option value="4">4+ Stars</option>
							<option value="3">3+ Stars</option>
							<option value="2">2+ Stars</option>
						</select>
					</div>
				</div>

				{/* Products Grid */}
				<div className="flex-1">
					{loading ? (
						<div className="flex justify-center">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
						</div>
					) : error ? (
						<div className="text-red-500 text-center">{error}</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{products.map((product) => (
								<div
									key={product._id}
									className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
								>
									<img
										src={product.image}
										alt={product.name}
										className="w-full h-48 object-cover"
									/>
									<div className="p-4">
										<h3 className="text-lg font-semibold mb-2">
											{product.name}
										</h3>
										<p className="text-gray-600 mb-2">
											${product.price}
										</p>
										<div className="flex items-center">
											<div className="flex text-yellow-400">
												{[...Array(5)].map(
													(_, index) => (
														<span key={index}>
															{index <
															Math.floor(
																product.rating
															)
																? "★"
																: "☆"}
														</span>
													)
												)}
											</div>
											<span className="ml-2 text-gray-500">
												({product.numReviews} reviews)
											</span>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ProductList;
