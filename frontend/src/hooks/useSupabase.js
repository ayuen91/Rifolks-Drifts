import { useState, useEffect } from "react";
import { createBrowserClient } from "@/utils/supabase";

export function useSupabase(table, options = {}) {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const supabase = createBrowserClient();

	useEffect(() => {
		async function fetchData() {
			try {
				let query = supabase.from(table).select("*");

				// Apply filters if provided
				if (options.filters) {
					Object.entries(options.filters).forEach(([key, value]) => {
						query = query.eq(key, value);
					});
				}

				// Apply ordering if provided
				if (options.orderBy) {
					query = query.order(options.orderBy, {
						ascending: options.ascending ?? false,
					});
				}

				// Apply pagination if provided
				if (options.page && options.pageSize) {
					const start = (options.page - 1) * options.pageSize;
					const end = start + options.pageSize - 1;
					query = query.range(start, end);
				}

				const { data, error } = await query;

				if (error) throw error;
				setData(data || []);
			} catch (err) {
				setError(err);
				console.error(`Error fetching ${table}:`, err);
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, [table, JSON.stringify(options)]);

	return { data, loading, error };
}
