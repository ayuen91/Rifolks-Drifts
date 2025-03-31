import { useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiInstagram, FiStar } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Home = () => {
	const [activeSlide, setActiveSlide] = useState(0);

	// Mock data for products and reviews
	const products = [
		{
			id: 1,
			name: "Classic White T-Shirt",
			price: 29.99,
			image: "/images/products/tshirt.jpg",
			category: "men",
		},
		// Add more products...
	];

	const reviews = [
		{
			id: 1,
			name: "Sarah Johnson",
			image: "/images/reviews/review1.jpg",
			rating: 5,
			text: "The quality of the clothing is exceptional. I love how comfortable and stylish everything is!",
		},
		// Add more reviews...
	];

	const instagramPosts = [
		{
			id: 1,
			image: "/images/instagram/post1.jpg",
			link: "https://instagram.com/post1",
		},
		// Add more posts...
	];

	return (
		<div className="space-y-16">
			{/* Hero Section */}
			<section className="relative h-[80vh] flex items-center justify-center">
				<div
					className="absolute inset-0 bg-cover bg-center"
					style={{
						backgroundImage: 'url("/images/hero-banner.jpg")',
					}}
				>
					<div className="absolute inset-0 bg-black bg-opacity-40" />
				</div>
				<div className="relative text-center text-white px-4">
					<h1 className="font-heading text-5xl md:text-6xl font-bold mb-6">
						Effortless Style for Men & Women
					</h1>
					<p className="text-xl mb-8">
						Discover the latest trends tailored for you
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link
							to="/men"
							className="bg-accent hover:bg-accent-dark text-white px-8 py-3 rounded-md transition-colors"
						>
							Shop Men
						</Link>
						<Link
							to="/women"
							className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-3 rounded-md transition-colors"
						>
							Shop Women
						</Link>
					</div>
				</div>
			</section>

			{/* Featured Categories */}
			<section className="container mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<Link
						to="/men"
						className="group relative h-[400px] overflow-hidden rounded-lg"
					>
						<img
							src="/images/categories/mens.jpg"
							alt="Men's Collection"
							className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
						/>
						<div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
							<h2 className="text-white text-2xl font-heading font-bold">
								Explore Men's Collection
							</h2>
						</div>
					</Link>
					<Link
						to="/women"
						className="group relative h-[400px] overflow-hidden rounded-lg"
					>
						<img
							src="/images/categories/womens.jpg"
							alt="Women's Collection"
							className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
						/>
						<div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
							<h2 className="text-white text-2xl font-heading font-bold">
								Explore Women's Collection
							</h2>
						</div>
					</Link>
				</div>
			</section>

			{/* Trending Now */}
			<section className="container mx-auto px-4">
				<h2 className="font-heading text-3xl font-bold mb-8">
					Trending Now
				</h2>
				<Swiper
					modules={[Navigation, Pagination, Autoplay]}
					spaceBetween={24}
					slidesPerView={1}
					navigation
					pagination={{ clickable: true }}
					autoplay={{ delay: 5000 }}
					breakpoints={{
						640: { slidesPerView: 2 },
						768: { slidesPerView: 3 },
						1024: { slidesPerView: 4 },
					}}
				>
					{products.map((product) => (
						<SwiperSlide key={product.id}>
							<div className="group relative">
								<img
									src={product.image}
									alt={product.name}
									className="w-full aspect-square object-cover rounded-lg"
								/>
								<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg" />
								<button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-gray-900 px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
									Quick Add
								</button>
								<div className="mt-4">
									<h3 className="font-medium">
										{product.name}
									</h3>
									<p className="text-gray-600">
										${product.price}
									</p>
								</div>
							</div>
						</SwiperSlide>
					))}
				</Swiper>
			</section>

			{/* Instagram Feed */}
			<section className="container mx-auto px-4">
				<h2 className="font-heading text-3xl font-bold mb-8 text-center">
					Shop the Look from Instagram
				</h2>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{instagramPosts.map((post) => (
						<a
							key={post.id}
							href={post.link}
							target="_blank"
							rel="noopener noreferrer"
							className="group relative aspect-square overflow-hidden rounded-lg"
						>
							<img
								src={post.image}
								alt="Instagram Post"
								className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
							/>
							<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
								<FiInstagram className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
							</div>
						</a>
					))}
				</div>
			</section>

			{/* Customer Reviews */}
			<section className="container mx-auto px-4">
				<h2 className="font-heading text-3xl font-bold mb-8 text-center">
					What Our Customers Say
				</h2>
				<Swiper
					modules={[Navigation, Pagination, Autoplay]}
					spaceBetween={24}
					slidesPerView={1}
					navigation
					pagination={{ clickable: true }}
					autoplay={{ delay: 5000 }}
					breakpoints={{
						640: { slidesPerView: 2 },
						768: { slidesPerView: 3 },
					}}
				>
					{reviews.map((review) => (
						<SwiperSlide key={review.id}>
							<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
								<div className="flex items-center mb-4">
									<img
										src={review.image}
										alt={review.name}
										className="w-12 h-12 rounded-full mr-4"
									/>
									<div>
										<h3 className="font-medium">
											{review.name}
										</h3>
										<div className="flex text-yellow-400">
											{[...Array(review.rating)].map(
												(_, i) => (
													<FiStar
														key={i}
														className="w-4 h-4 fill-current"
													/>
												)
											)}
										</div>
									</div>
								</div>
								<p className="text-gray-600 dark:text-gray-300">
									{review.text}
								</p>
							</div>
						</SwiperSlide>
					))}
				</Swiper>
			</section>

			{/* Newsletter */}
			<section className="bg-gray-800 dark:bg-gray-900 text-white py-16">
				<div className="container mx-auto px-4 text-center">
					<h2 className="font-heading text-3xl font-bold mb-4">
						Join & Get 10% Off Your First Order
					</h2>
					<p className="text-gray-400 mb-8">
						Subscribe to our newsletter for exclusive offers and
						updates
					</p>
					<form className="max-w-md mx-auto flex">
						<input
							type="email"
							placeholder="Enter your email"
							className="flex-1 px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-accent text-gray-900"
						/>
						<button
							type="submit"
							className="bg-accent hover:bg-accent-dark px-6 py-2 rounded-r-md transition-colors"
						>
							Subscribe
						</button>
					</form>
				</div>
			</section>
		</div>
	);
};

export default Home;
