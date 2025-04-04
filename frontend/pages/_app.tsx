import { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import { supabase } from "../lib/supabase"; // Corrected import path
import "../app/styles/globals.css";

interface Todo {
	id: number;
	title: string;
	completed: boolean;
	created_at: string;
	user_id: string;
}

function MyApp({ Component, pageProps }: AppProps) {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function getTodos() {
			try {
				const { data, error } = await supabase
					.from("todos")
					.select("*")
					.order("created_at", { ascending: false });

				if (error) throw error;
				setTodos(data || []);
			} catch (err) {
				console.error("Error fetching todos:", err);
				setError(
					err instanceof Error ? err.message : "Failed to fetch todos"
				);
			} finally {
				setLoading(false);
			}
		}

		getTodos();
	}, []);

	return (
		<>
			<Component {...pageProps} />
			{loading ? (
				<div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg">
					<p className="text-sm text-gray-600">Loading todos...</p>
				</div>
			) : error ? (
				<div className="fixed bottom-4 right-4 bg-red-50 p-4 rounded-lg shadow-lg">
					<p className="text-sm text-red-600">{error}</p>
				</div>
			) : (
				<div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg">
					<h2 className="text-lg font-semibold mb-2">Recent Todos</h2>
					<ul className="space-y-1">
						{todos.slice(0, 3).map((todo) => (
							<li
								key={todo.id}
								className="text-sm flex items-center gap-2"
							>
								<span
									className={`w-2 h-2 rounded-full ${
										todo.completed
											? "bg-green-500"
											: "bg-yellow-500"
									}`}
								/>
								{todo.title}
							</li>
						))}
					</ul>
				</div>
			)}
		</>
	);
}

export default MyApp;
