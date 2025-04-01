import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { createNativeClient } from "@/utils/supabase";

export default function TodoList() {
	const [todos, setTodos] = useState([]);
	const supabase = createNativeClient();

	useEffect(() => {
		const getTodos = async () => {
			try {
				const { data: todos, error } = await supabase
					.from("todos")
					.select();

				if (error) {
					console.error("Error fetching todos:", error.message);
					return;
				}

				if (todos && todos.length > 0) {
					setTodos(todos);
				}
			} catch (error) {
				console.error("Error fetching todos:", error.message);
			}
		};

		getTodos();
	}, []);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Todo List</Text>
			<FlatList
				data={todos}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => (
					<View style={styles.todoItem}>
						<Text style={styles.todoText}>{item.title}</Text>
					</View>
				)}
				ListEmptyComponent={() => (
					<Text style={styles.emptyText}>No todos found</Text>
				)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#fff",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
		textAlign: "center",
	},
	todoItem: {
		padding: 15,
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
	},
	todoText: {
		fontSize: 16,
	},
	emptyText: {
		textAlign: "center",
		color: "#666",
		marginTop: 20,
	},
});
