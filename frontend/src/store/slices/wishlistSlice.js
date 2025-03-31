import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
	getWishlist,
	addToWishlist,
	removeFromWishlist,
} from "../../lib/supabase";

export const fetchWishlist = createAsyncThunk(
	"wishlist/fetch",
	async (_, { getState, rejectWithValue }) => {
		try {
			const userId = getState().auth.user.id;
			const data = await getWishlist(userId);
			return data.map((item) => item.products);
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

export const addToWishlistAsync = createAsyncThunk(
	"wishlist/add",
	async (productId, { getState, rejectWithValue }) => {
		try {
			const userId = getState().auth.user.id;
			const data = await addToWishlist(userId, productId);
			return data.products;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

export const removeFromWishlistAsync = createAsyncThunk(
	"wishlist/remove",
	async (productId, { getState, rejectWithValue }) => {
		try {
			const userId = getState().auth.user.id;
			await removeFromWishlist(userId, productId);
			return productId;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

const initialState = {
	items: [],
	loading: false,
	error: null,
};

const wishlistSlice = createSlice({
	name: "wishlist",
	initialState,
	reducers: {
		clearWishlist: (state) => {
			state.items = [];
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchWishlist.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchWishlist.fulfilled, (state, action) => {
				state.loading = false;
				state.items = action.payload;
			})
			.addCase(fetchWishlist.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || "Failed to fetch wishlist";
			})
			.addCase(addToWishlistAsync.fulfilled, (state, action) => {
				state.items.push(action.payload);
			})
			.addCase(removeFromWishlistAsync.fulfilled, (state, action) => {
				state.items = state.items.filter(
					(item) => item.id !== action.payload
				);
			});
	},
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
