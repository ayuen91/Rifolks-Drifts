"use client";

import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

interface Todo {
	id: number;
	title: string;
	completed: boolean;
	created_at: string;
}

export default function Home() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-4">
			<div className="max-w-4xl text-center">
				<h1 className="text-4xl md:text-6xl font-bold text-dark mb-6">
					Welcome to Rifolks Drifts
				</h1>
				<p className="text-lg md:text-xl text-gray-600 mb-8">
					Your premier destination for drifting gear and accessories
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<a
						href="/products"
						className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
					>
						Shop Now
					</a>
					<a
						href="/about"
						className="bg-dark text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
					>
						Learn More
					</a>
				</div>
			</div>
		</div>
	);
}
