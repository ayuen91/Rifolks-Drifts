import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchStaffMembers = createAsyncThunk(
	"staff/fetchAll",
	async (_, { rejectWithValue }) => {
		try {
			const { data } = await axios.get("/api/admin/staff");
			return data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

export const addStaffMember = createAsyncThunk(
	"staff/add",
	async (staffData, { rejectWithValue }) => {
		try {
			const { data } = await axios.post("/api/admin/staff", staffData);
			return data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

export const updateStaffMember = createAsyncThunk(
	"staff/update",
	async ({ id, updates }, { rejectWithValue }) => {
		try {
			const { data } = await axios.patch(
				`/api/admin/staff/${id}`,
				updates
			);
			return data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

export const fetchStaffActivity = createAsyncThunk(
	"staff/fetchActivity",
	async (staffId, { rejectWithValue }) => {
		try {
			const { data } = await axios.get(
				`/api/admin/staff/${staffId}/activity`
			);
			return data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

const initialState = {
	staffMembers: [],
	staffActivity: {},
	onlineStaff: new Set(),
	loading: false,
	error: null,
};

const staffSlice = createSlice({
	name: "staff",
	initialState,
	reducers: {
		updateStaffOnlineStatus: (state, action) => {
			const { staffId, isOnline } = action.payload;
			if (isOnline) {
				state.onlineStaff.add(staffId);
			} else {
				state.onlineStaff.delete(staffId);
			}
		},
		clearStaffActivity: (state, action) => {
			const staffId = action.payload;
			delete state.staffActivity[staffId];
		},
	},
	extraReducers: (builder) => {
		builder
			// Fetch all staff
			.addCase(fetchStaffMembers.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchStaffMembers.fulfilled, (state, action) => {
				state.loading = false;
				state.staffMembers = action.payload;
			})
			.addCase(fetchStaffMembers.rejected, (state, action) => {
				state.loading = false;
				state.error =
					action.payload?.message || "Failed to fetch staff members";
			})
			// Add staff member
			.addCase(addStaffMember.fulfilled, (state, action) => {
				state.staffMembers.push(action.payload);
			})
			// Update staff member
			.addCase(updateStaffMember.fulfilled, (state, action) => {
				const index = state.staffMembers.findIndex(
					(staff) => staff.id === action.payload.id
				);
				if (index !== -1) {
					state.staffMembers[index] = action.payload;
				}
			})
			// Fetch staff activity
			.addCase(fetchStaffActivity.fulfilled, (state, action) => {
				state.staffActivity[action.meta.arg] = action.payload;
			});
	},
});

export const { updateStaffOnlineStatus, clearStaffActivity } =
	staffSlice.actions;
export default staffSlice.reducer;
