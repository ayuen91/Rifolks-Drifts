import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const signIn = async (email, password) => {
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});
	if (error) throw error;
	return data;
};

export const signUp = async (email, password, userData) => {
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			data: userData,
		},
	});
	if (error) throw error;
	return data;
};

export const signOut = async () => {
	const { error } = await supabase.auth.signOut();
	if (error) throw error;
};

// Database helper functions
export const getProducts = async (filters = {}) => {
	let query = supabase.from("products").select("*, categories(name)");

	if (filters.category) {
		query = query.eq("category_id", filters.category);
	}
	if (filters.search) {
		query = query.ilike("name", `%${filters.search}%`);
	}
	if (filters.minPrice) {
		query = query.gte("price", filters.minPrice);
	}
	if (filters.maxPrice) {
		query = query.lte("price", filters.maxPrice);
	}

	const { data, error } = await query;
	if (error) throw error;
	return data;
};

export const getProduct = async (id) => {
	const { data, error } = await supabase
		.from("products")
		.select("*, categories(name)")
		.eq("id", id)
		.single();
	if (error) throw error;
	return data;
};

export const getWishlist = async (userId) => {
	const { data, error } = await supabase
		.from("wishlists")
		.select("*, products(*)")
		.eq("user_id", userId);
	if (error) throw error;
	return data;
};

export const addToWishlist = async (userId, productId) => {
	const { data, error } = await supabase
		.from("wishlists")
		.insert([{ user_id: userId, product_id: productId }])
		.select("*, products(*)")
		.single();
	if (error) throw error;
	return data;
};

export const removeFromWishlist = async (userId, productId) => {
	const { error } = await supabase
		.from("wishlists")
		.delete()
		.match({ user_id: userId, product_id: productId });
	if (error) throw error;
};

export const createOrder = async (userId, orderData) => {
	const { data, error } = await supabase
		.from("orders")
		.insert([{ user_id: userId, ...orderData }])
		.select()
		.single();
	if (error) throw error;
	return data;
};

export const getOrders = async (userId) => {
	const { data, error } = await supabase
		.from("orders")
		.select("*, order_items(*, products(*))")
		.eq("user_id", userId)
		.order("created_at", { ascending: false });
	if (error) throw error;
	return data;
};

export const getOrder = async (orderId, userId) => {
	const { data, error } = await supabase
		.from("orders")
		.select("*, order_items(*, products(*))")
		.eq("id", orderId)
		.eq("user_id", userId)
		.single();
	if (error) throw error;
	return data;
};
