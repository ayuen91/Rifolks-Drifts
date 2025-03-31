import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchNotifications = createAsyncThunk(
	"notifications/fetchAll",
	async (_, { rejectWithValue }) => {
		try {
			const { data } = await axios.get("/api/admin/notifications");
			return data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

export const markNotificationAsRead = createAsyncThunk(
	"notifications/markAsRead",
	async (notificationId, { rejectWithValue }) => {
		try {
			const { data } = await axios.patch(
				`/api/admin/notifications/${notificationId}/read`
			);
			return data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

const initialState = {
	notifications: [],
	unreadCount: 0,
	loading: false,
	error: null,
	lastFetched: null,
};

const notificationSlice = createSlice({
	name: "notifications",
	initialState,
	reducers: {
		addNotification: (state, action) => {
			state.notifications.unshift(action.payload);
			if (!action.payload.read) {
				state.unreadCount += 1;
			}
		},
		clearNotifications: (state) => {
			state.notifications = [];
			state.unreadCount = 0;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchNotifications.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchNotifications.fulfilled, (state, action) => {
				state.loading = false;
				state.notifications = action.payload.notifications;
				state.unreadCount = action.payload.notifications.filter(
					(n) => !n.read
				).length;
				state.lastFetched = Date.now();
			})
			.addCase(fetchNotifications.rejected, (state, action) => {
				state.loading = false;
				state.error =
					action.payload?.message || "Failed to fetch notifications";
			})
			.addCase(markNotificationAsRead.fulfilled, (state, action) => {
				const notification = state.notifications.find(
					(n) => n.id === action.payload.id
				);
				if (notification && !notification.read) {
					notification.read = true;
					state.unreadCount -= 1;
				}
			});
	},
});

export const { addNotification, clearNotifications } =
	notificationSlice.actions;
export default notificationSlice.reducer;
