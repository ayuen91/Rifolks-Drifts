import React, { useState, useEffect } from "react";
import { supabase } from "./lib/supabase"; // Corrected import path

interface Todo {
	id: number;
	title: string;
	completed: boolean;
	created_at: string;
}

export default function App() {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const getTodos = async () => {
			try {
				const { data, error } = await supabase
					.from("todos")
					.select("*")
					.order("created_at", { ascending: false });

				if (error) {
					setError(error.message);
					return;
				}

				setTodos(data || []);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to fetch todos"
				);
			} finally {
				setLoading(false);
			}
		};

		getTodos();
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
					<p className="mt-4 text-gray-600">Loading todos...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center text-red-600">
					<p>Error: {error}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-2xl mx-auto px-4">
				<h1 className="text-3xl font-bold text-center mb-8">
					Todo List
				</h1>
				<div className="bg-white rounded-lg shadow-md p-6">
					{todos.length === 0 ? (
						<p className="text-center text-gray-500">
							No todos found
						</p>
					) : (
						<ul className="space-y-4">
							{todos.map((todo) => (
								<li
									key={todo.id}
									className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
								>
									<div className="flex items-center space-x-3">
										<span
											className={`w-3 h-3 rounded-full ${
												todo.completed
													? "bg-green-500"
													: "bg-yellow-500"
											}`}
										/>
										<span
											className={
												todo.completed
													? "line-through text-gray-500"
													: ""
											}
										>
											{todo.title}
										</span>
									</div>
									<span className="text-sm text-gray-500">
										{new Date(
											todo.created_at
										).toLocaleDateString()}
									</span>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
}
