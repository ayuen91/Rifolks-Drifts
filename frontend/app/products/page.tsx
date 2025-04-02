"use client";

import { useState } from "react";

const products = [
	{
		id: 1,
		name: "Basic Drift Package",
		href: "#",
		price: "$48",
		description:
			"Perfect for beginners, includes basic drift gear and accessories.",
		imageSrc: "https://placehold.co/300x200",
		imageAlt: "Basic drift package with essential gear.",
	},
	{
		id: 2,
		name: "Pro Drift Kit",
		href: "#",
		price: "$89",
		description: "Advanced drift equipment for experienced drivers.",
		imageSrc: "https://placehold.co/300x200",
		imageAlt: "Professional drift kit with advanced features.",
	},
	{
		id: 3,
		name: "Premium Drift Bundle",
		href: "#",
		price: "$129",
		description: "Complete drift package with premium components.",
		imageSrc: "https://placehold.co/300x200",
		imageAlt: "Premium drift bundle with all accessories.",
	},
	// Add more products as needed
];

export default function ProductsPage() {
	const [sortBy, setSortBy] = useState("featured");

	return (
		<div className="bg-white">
			<div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-bold tracking-tight text-gray-900">
						Our Products
					</h2>
					<select
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value)}
						className="rounded-md border-gray-300 py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-primary sm:text-sm"
					>
						<option value="featured">Featured</option>
						<option value="price-low">Price: Low to High</option>
						<option value="price-high">Price: High to Low</option>
						<option value="newest">Newest</option>
					</select>
				</div>

				<div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
					{products.map((product) => (
						<div key={product.id} className="group relative">
							<div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none lg:h-80">
								<img
									src={product.imageSrc}
									alt={product.imageAlt}
									className="h-full w-full object-cover object-center lg:h-full lg:w-full"
								/>
							</div>
							<div className="mt-4 flex justify-between">
								<div>
									<h3 className="text-sm text-gray-700">
										<a href={product.href}>
											<span
												aria-hidden="true"
												className="absolute inset-0"
											/>
											{product.name}
										</a>
									</h3>
									<p className="mt-1 text-sm text-gray-500">
										{product.description}
									</p>
								</div>
								<p className="text-sm font-medium text-gray-900">
									{product.price}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
