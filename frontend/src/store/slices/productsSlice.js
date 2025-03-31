import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProducts, getProduct } from "../../lib/supabase";

export const fetchProducts = createAsyncThunk(
	"products/fetch",
	async (filters = {}, { rejectWithValue }) => {
		try {
			const data = await getProducts(filters);
			return data;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

export const fetchProductDetails = createAsyncThunk(
	"products/fetchDetails",
	async (productId, { rejectWithValue }) => {
		try {
			const data = await getProduct(productId);
			return data;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

const initialState = {
	items: [],
	selectedProduct: null,
	filters: {
		category: null,
		search: "",
		minPrice: null,
		maxPrice: null,
	},
	loading: false,
	error: null,
	productDetailsLoading: false,
	productDetailsError: null,
};

const productsSlice = createSlice({
	name: "products",
	initialState,
	reducers: {
		setFilters: (state, action) => {
			state.filters = { ...state.filters, ...action.payload };
		},
		clearFilters: (state) => {
			state.filters = initialState.filters;
		},
		clearSelectedProduct: (state) => {
			state.selectedProduct = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// Fetch products
			.addCase(fetchProducts.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchProducts.fulfilled, (state, action) => {
				state.loading = false;
				state.items = action.payload;
			})
			.addCase(fetchProducts.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || "Failed to fetch products";
			})
			// Fetch product details
			.addCase(fetchProductDetails.pending, (state) => {
				state.productDetailsLoading = true;
				state.productDetailsError = null;
			})
			.addCase(fetchProductDetails.fulfilled, (state, action) => {
				state.productDetailsLoading = false;
				state.selectedProduct = action.payload;
			})
			.addCase(fetchProductDetails.rejected, (state, action) => {
				state.productDetailsLoading = false;
				state.productDetailsError =
					action.payload || "Failed to fetch product details";
			});
	},
});

export const { setFilters, clearFilters, clearSelectedProduct } =
	productsSlice.actions;
export default productsSlice.reducer;
