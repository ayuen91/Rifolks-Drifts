import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../lib/supabaseClient";

// Async thunks
export const fetchCODOrders = createAsyncThunk(
	"codOrders/fetchCODOrders",
	async (filters = {}) => {
		let query = supabase.from("cod_orders").select(`
      *,
      order:orders(*),
      delivery_attempts(*),
      returns(*),
      customer_feedback(*)
    `);

		// Apply filters
		if (filters.status) {
			query = query.eq("payment_status", filters.status);
		}
		if (filters.deliveryStatus) {
			query = query.eq("delivery_status", filters.deliveryStatus);
		}
		if (filters.dateRange) {
			query = query
				.gte("created_at", filters.dateRange.start)
				.lte("created_at", filters.dateRange.end);
		}

		const { data, error } = await query;
		if (error) throw error;
		return data;
	}
);

export const updateDeliveryStatus = createAsyncThunk(
	"codOrders/updateDeliveryStatus",
	async ({ orderId, status, notes }) => {
		const { data, error } = await supabase
			.from("delivery_attempts")
			.insert([
				{
					cod_order_id: orderId,
					status,
					notes,
					attempt_number: 1, // This should be calculated based on existing attempts
				},
			]);

		if (error) throw error;

		// Update COD order status
		const { error: updateError } = await supabase
			.from("cod_orders")
			.update({ delivery_status: status })
			.eq("id", orderId);

		if (updateError) throw updateError;

		return { orderId, status, notes };
	}
);

export const recordPayment = createAsyncThunk(
	"codOrders/recordPayment",
	async ({ orderId, amount, notes }) => {
		const { data, error } = await supabase
			.from("delivery_attempts")
			.insert([
				{
					cod_order_id: orderId,
					status: "payment_collected",
					notes,
					payment_amount: amount,
					payment_status: "completed",
				},
			]);

		if (error) throw error;

		// Update COD order payment status
		const { error: updateError } = await supabase
			.from("cod_orders")
			.update({ payment_status: "paid" })
			.eq("id", orderId);

		if (updateError) throw updateError;

		return { orderId, amount, notes };
	}
);

export const createReturn = createAsyncThunk(
	"codOrders/createReturn",
	async ({ orderId, reason, returnFee }) => {
		const { data, error } = await supabase.from("returns").insert([
			{
				cod_order_id: orderId,
				reason,
				return_fee: returnFee,
				status: "pending",
			},
		]);

		if (error) throw error;

		// Update COD order status
		const { error: updateError } = await supabase
			.from("cod_orders")
			.update({ delivery_status: "returned" })
			.eq("id", orderId);

		if (updateError) throw updateError;

		return { orderId, reason, returnFee };
	}
);

const initialState = {
	items: [],
	selectedOrder: null,
	filters: {
		status: null,
		deliveryStatus: null,
		dateRange: null,
	},
	loading: false,
	error: null,
	statistics: {
		totalOrders: 0,
		pendingPayment: 0,
		paymentCollected: 0,
		failedDelivery: 0,
		returns: 0,
	},
};

const codOrdersSlice = createSlice({
	name: "codOrders",
	initialState,
	reducers: {
		setFilters: (state, action) => {
			state.filters = { ...state.filters, ...action.payload };
		},
		clearFilters: (state) => {
			state.filters = initialState.filters;
		},
		selectOrder: (state, action) => {
			state.selectedOrder = action.payload;
		},
		clearSelectedOrder: (state) => {
			state.selectedOrder = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// Fetch COD Orders
			.addCase(fetchCODOrders.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchCODOrders.fulfilled, (state, action) => {
				state.loading = false;
				state.items = action.payload;
				// Update statistics
				state.statistics = {
					totalOrders: action.payload.length,
					pendingPayment: action.payload.filter(
						(order) => order.payment_status === "pending"
					).length,
					paymentCollected: action.payload.filter(
						(order) => order.payment_status === "paid"
					).length,
					failedDelivery: action.payload.filter(
						(order) => order.delivery_status === "failed"
					).length,
					returns: action.payload.filter(
						(order) => order.delivery_status === "returned"
					).length,
				};
			})
			.addCase(fetchCODOrders.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})
			// Update Delivery Status
			.addCase(updateDeliveryStatus.fulfilled, (state, action) => {
				const { orderId, status, notes } = action.payload;
				const order = state.items.find((item) => item.id === orderId);
				if (order) {
					order.delivery_status = status;
					order.delivery_attempts.push({
						status,
						notes,
						attempted_at: new Date().toISOString(),
					});
				}
			})
			// Record Payment
			.addCase(recordPayment.fulfilled, (state, action) => {
				const { orderId, amount, notes } = action.payload;
				const order = state.items.find((item) => item.id === orderId);
				if (order) {
					order.payment_status = "paid";
					order.delivery_attempts.push({
						status: "payment_collected",
						notes,
						payment_amount: amount,
						payment_status: "completed",
						attempted_at: new Date().toISOString(),
					});
				}
			})
			// Create Return
			.addCase(createReturn.fulfilled, (state, action) => {
				const { orderId, reason, returnFee } = action.payload;
				const order = state.items.find((item) => item.id === orderId);
				if (order) {
					order.delivery_status = "returned";
					order.returns.push({
						reason,
						return_fee: returnFee,
						status: "pending",
						created_at: new Date().toISOString(),
					});
				}
			});
	},
});

export const { setFilters, clearFilters, selectOrder, clearSelectedOrder } =
	codOrdersSlice.actions;

export default codOrdersSlice.reducer;
