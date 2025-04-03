import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
	items: [],
	loading: false,
	error: null,
};

export const getInventory = createAsyncThunk(
	"inventory/getInventory",
	async () => {
		try {
			const response = await axios.get("/api/inventory");
			return response.data;
		} catch (error) {
			throw error;
		}
	}
);

export const updateInventory = createAsyncThunk(
	"inventory/updateInventory",
	async ({ productId, stockLevel }) => {
		try {
			const response = await axios.put(`/api/inventory/${productId}`, {
				stockLevel,
			});
			return response.data;
		} catch (error) {
			throw error;
		}
	}
);

const inventorySlice = createSlice({
	name: "inventory",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getInventory.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(getInventory.fulfilled, (state, action) => {
				state.loading = false;
				state.items = action.payload;
			})
			.addCase(getInventory.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})
			.addCase(updateInventory.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateInventory.fulfilled, (state, action) => {
				state.loading = false;
				// Update the inventory item in the state
				state.items = state.items.map((item) =>
					item.productId === action.payload.inventory.productId
						? action.payload.inventory
						: item
				);
			})
			.addCase(updateInventory.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			});
	},
});

export default inventorySlice.reducer;