import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { signIn, signUp, signOut, supabase } from "../../lib/supabase";

export const login = createAsyncThunk(
	"auth/login",
	async ({ email, password }, { rejectWithValue }) => {
		try {
			const { user, session } = await signIn(email, password);
			return { user, token: session.access_token };
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

export const register = createAsyncThunk(
	"auth/register",
	async ({ email, password, userData }, { rejectWithValue }) => {
		try {
			const { user, session } = await signUp(email, password, userData);
			return { user, token: session.access_token };
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

export const logout = createAsyncThunk(
	"auth/logout",
	async (_, { rejectWithValue }) => {
		try {
			await signOut();
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

export const checkAuth = createAsyncThunk(
	"auth/check",
	async (_, { rejectWithValue }) => {
		try {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			if (!session) throw new Error("No active session");
			return { user: session.user, token: session.access_token };
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

const initialState = {
	user: null,
	token: null,
	loading: false,
	error: null,
	isAuthenticated: false,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		clearError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// Login
			.addCase(login.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload.user;
				state.token = action.payload.token;
				state.isAuthenticated = true;
			})
			.addCase(login.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			// Register
			.addCase(register.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(register.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload.user;
				state.token = action.payload.token;
				state.isAuthenticated = true;
			})
			.addCase(register.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			// Logout
			.addCase(logout.fulfilled, (state) => {
				state.user = null;
				state.token = null;
				state.isAuthenticated = false;
			})
			// Check Auth
			.addCase(checkAuth.pending, (state) => {
				state.loading = true;
			})
			.addCase(checkAuth.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload.user;
				state.token = action.payload.token;
				state.isAuthenticated = true;
			})
			.addCase(checkAuth.rejected, (state) => {
				state.loading = false;
				state.user = null;
				state.token = null;
				state.isAuthenticated = false;
			});
	},
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
