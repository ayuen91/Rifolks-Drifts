import { useState, useEffect } from "react";
import { FiInstagram } from "react-icons/fi";

const InstagramFeed = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchInstagramPosts = async () => {
			try {
				// Replace with your Instagram API endpoint
				const response = await fetch("/api/instagram/posts");
				const data = await response.json();
				setPosts(data.slice(0, 6)); // Get latest 6 posts
			} catch (err) {
				setError("Failed to load Instagram posts");
				console.error("Instagram API Error:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchInstagramPosts();
	}, []);

	if (loading) {
		return (
			<div className="grid grid-cols-3 gap-4">
				{[...Array(6)].map((_, index) => (
					<div
						key={index}
						className="aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"
					/>
				))}
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center py-8">
				<p className="text-gray-600 dark:text-gray-400">{error}</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-heading font-bold">
					Follow Us on Instagram
				</h2>
				<a
					href="https://instagram.com/rifolks-drifts"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-2 text-accent hover:text-accent-dark transition-colors"
				>
					<FiInstagram className="w-5 h-5" />
					<span>@rifolks-drifts</span>
				</a>
			</div>
			<div className="grid grid-cols-3 gap-4">
				{posts.map((post) => (
					<a
						key={post.id}
						href={post.url}
						target="_blank"
						rel="noopener noreferrer"
						className="group relative aspect-square overflow-hidden rounded-lg"
					>
						<img
							src={post.image}
							alt={post.caption}
							className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
						/>
						<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
							<div className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-center p-4">
								<FiInstagram className="w-6 h-6 mx-auto mb-2" />
								<p className="text-sm line-clamp-2">
									{post.caption}
								</p>
							</div>
						</div>
					</a>
				))}
			</div>
		</div>
	);
};

export default InstagramFeed;
