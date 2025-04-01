import React from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { createBrowserClient } from "@/utils/supabase";

export default function Todos() {
	const {
		data: todos,
		loading,
		error,
	} = useSupabase("todos", {
		orderBy: "created_at",
		ascending: false,
	});

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error loading todos: {error.message}</div>;
	}

	return (
		<div className="max-w-4xl mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Todos</h1>
			<ul className="space-y-2">
				{todos.map((todo) => (
					<li
						key={todo.id}
						className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
					>
						<div className="flex items-center justify-between">
							<span
								className={
									todo.completed
										? "line-through text-gray-500"
										: ""
								}
							>
								{todo.title}
							</span>
							<span className="text-sm text-gray-500">
								{new Date(todo.created_at).toLocaleDateString()}
							</span>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
