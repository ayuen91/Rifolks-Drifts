import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const createOrder = createAsyncThunk(
	"orders/createOrder",
	async (orderData, { getState, rejectWithValue }) => {
		try {
			const { data } = await axios.post(`${API_URL}/orders`, orderData, {
				headers: {
					Authorization: `Bearer ${getState().auth.userInfo.token}`,
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

export const getOrderById = createAsyncThunk(
	"orders/getOrderById",
	async (id, { getState, rejectWithValue }) => {
		try {
			const { data } = await axios.get(`${API_URL}/orders/${id}`, {
				headers: {
					Authorization: `Bearer ${getState().auth.userInfo.token}`,
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

export const updateOrderToPaid = createAsyncThunk(
	"orders/updateOrderToPaid",
	async (id, { getState, rejectWithValue }) => {
		try {
			const { data } = await axios.put(
				`${API_URL}/orders/${id}/pay`,
				{},
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

export const getMyOrders = createAsyncThunk(
	"orders/getMyOrders",
	async (_, { getState, rejectWithValue }) => {
		try {
			const { data } = await axios.get(`${API_URL}/orders/myorders`, {
				headers: {
					Authorization: `Bearer ${getState().auth.userInfo.token}`,
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

export const getOrders = createAsyncThunk(
	"orders/getOrders",
	async (_, { getState, rejectWithValue }) => {
		try {
			const { data } = await axios.get(`${API_URL}/orders`, {
				headers: {
					Authorization: `Bearer ${getState().auth.userInfo.token}`,
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

export const updateOrderStatus = createAsyncThunk(
	"orders/updateOrderStatus",
	async ({ id, status }, { getState, rejectWithValue }) => {
		try {
			const { data } = await axios.put(
				`${API_URL}/orders/${id}/status`,
				{ status },
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

const initialState = {
	orders: [],
	order: null,
	loading: false,
	error: null,
	success: false,
};

const orderSlice = createSlice({
	name: "orders",
	initialState,
	reducers: {
		resetOrder: (state) => {
			state.order = null;
			state.error = null;
			state.success = false;
		},
		clearError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// Create Order
			.addCase(createOrder.pending, (state) => {
				state.loading = true;
				state.error = null;
				state.success = false;
			})
			.addCase(createOrder.fulfilled, (state, action) => {
				state.loading = false;
				state.success = true;
				state.order = action.payload;
			})
			.addCase(createOrder.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			// Get Order By ID
			.addCase(getOrderById.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(getOrderById.fulfilled, (state, action) => {
				state.loading = false;
				state.order = action.payload;
			})
			.addCase(getOrderById.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			// Update Order To Paid
			.addCase(updateOrderToPaid.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateOrderToPaid.fulfilled, (state, action) => {
				state.loading = false;
				state.order = action.payload;
			})
			.addCase(updateOrderToPaid.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			// Get My Orders
			.addCase(getMyOrders.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(getMyOrders.fulfilled, (state, action) => {
				state.loading = false;
				state.orders = action.payload;
			})
			.addCase(getMyOrders.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			// Get Orders (Admin)
			.addCase(getOrders.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(getOrders.fulfilled, (state, action) => {
				state.loading = false;
				state.orders = action.payload;
			})
			.addCase(getOrders.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			// Update Order Status
			.addCase(updateOrderStatus.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateOrderStatus.fulfilled, (state, action) => {
				state.loading = false;
				state.order = action.payload;
			})
			.addCase(updateOrderStatus.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export const { resetOrder, clearError } = orderSlice.actions;
export default orderSlice.reducer;
