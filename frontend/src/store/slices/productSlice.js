import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const fetchProducts = createAsyncThunk(
	"products/fetchProducts",
	async (
		{
			keyword = "",
			pageNumber = "",
			category = "",
			gender = "",
			minPrice = "",
			maxPrice = "",
			size = "",
			color = "",
		},
		{ rejectWithValue }
	) => {
		try {
			const { data } = await axios.get(`${API_URL}/products`, {
				params: {
					keyword,
					page: pageNumber,
					category,
					gender,
					minPrice,
					maxPrice,
					size,
					color,
				},
			});
			return data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || error.message
			);
		}
	}
);

export const fetchProductById = createAsyncThunk(
	"products/fetchProductById",
	async (id, { rejectWithValue }) => {
		try {
			const { data } = await axios.get(`${API_URL}/products/${id}`);
			return data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || error.message
			);
		}
	}
);

export const createProductReview = createAsyncThunk(
	"products/createReview",
	async ({ productId, rating, comment }, { getState, rejectWithValue }) => {
		try {
			const { data } = await axios.post(
				`${API_URL}/products/${productId}/reviews`,
				{ rating, comment },
				{
					headers: {
						Authorization: `Bearer ${
							getState().auth.userInfo.token
						}`,
					},
				}
			);
			return data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || error.message
			);
		}
	}
);

export const fetchTopProducts = createAsyncThunk(
	"products/fetchTopProducts",
	async (_, { rejectWithValue }) => {
		try {
			const { data } = await axios.get(`${API_URL}/products/top`);
			return data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || error.message
			);
		}
	}
);

const initialState = {
	products: [],
	product: null,
	topProducts: [],
	loading: false,
	error: null,
	page: 1,
	pages: 1,
	total: 0,
};

const productSlice = createSlice({
	name: "products",
	initialState,
	reducers: {
		clearProduct: (state) => {
			state.product = null;
			state.error = null;
		},
		clearError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// Fetch Products
			.addCase(fetchProducts.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchProducts.fulfilled, (state, action) => {
				state.loading = false;
				state.products = action.payload.products;
				state.page = action.payload.page;
				state.pages = action.payload.pages;
				state.total = action.payload.total;
			})
			.addCase(fetchProducts.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			// Fetch Product By ID
			.addCase(fetchProductById.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchProductById.fulfilled, (state, action) => {
				state.loading = false;
				state.product = action.payload;
			})
			.addCase(fetchProductById.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			// Create Review
			.addCase(createProductReview.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createProductReview.fulfilled, (state, action) => {
				state.loading = false;
				state.product.reviews = [
					...state.product.reviews,
					action.payload,
				];
			})
			.addCase(createProductReview.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			// Fetch Top Products
			.addCase(fetchTopProducts.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchTopProducts.fulfilled, (state, action) => {
				state.loading = false;
				state.topProducts = action.payload;
			})
			.addCase(fetchTopProducts.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export const { clearProduct, clearError } = productSlice.actions;
export default productSlice.reducer;
