import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../lib/supabase";

export const fetchCategories = createAsyncThunk(
	"categories/fetch",
	async (_, { rejectWithValue }) => {
		try {
			const { data, error } = await supabase
				.from("categories")
				.select("*")
				.order("name");

			if (error) throw error;
			return data;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

export const fetchCategoryBySlug = createAsyncThunk(
	"categories/fetchBySlug",
	async (slug, { rejectWithValue }) => {
		try {
			const { data, error } = await supabase
				.from("categories")
				.select("*")
				.eq("slug", slug)
				.single();

			if (error) throw error;
			return data;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

const initialState = {
	items: [],
	selectedCategory: null,
	loading: false,
	error: null,
	categoryDetailsLoading: false,
	categoryDetailsError: null,
};

const categoriesSlice = createSlice({
	name: "categories",
	initialState,
	reducers: {
		clearSelectedCategory: (state) => {
			state.selectedCategory = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// Fetch categories
			.addCase(fetchCategories.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchCategories.fulfilled, (state, action) => {
				state.loading = false;
				state.items = action.payload;
			})
			.addCase(fetchCategories.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || "Failed to fetch categories";
			})
			// Fetch category by slug
			.addCase(fetchCategoryBySlug.pending, (state) => {
				state.categoryDetailsLoading = true;
				state.categoryDetailsError = null;
			})
			.addCase(fetchCategoryBySlug.fulfilled, (state, action) => {
				state.categoryDetailsLoading = false;
				state.selectedCategory = action.payload;
			})
			.addCase(fetchCategoryBySlug.rejected, (state, action) => {
				state.categoryDetailsLoading = false;
				state.categoryDetailsError =
					action.payload || "Failed to fetch category details";
			});
	},
});

export const { clearSelectedCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
