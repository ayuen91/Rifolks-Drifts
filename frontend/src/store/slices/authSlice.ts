import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// Import specific Supabase types needed
import { AuthError, Session, User } from "@supabase/supabase-js";
// Assuming supabase client is initialized elsewhere and imported
import { supabase } from "../../lib/supabase"; // Adjust path if needed

// --- Interfaces ---

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  userData?: Record<string, any>; // Optional extra data for user profile
}

interface UpdateProfileData {
  userData: Record<string, any>; // Data to update user profile with
}

interface AdminLoginCredentials extends LoginCredentials {}

// Define the shape of the authentication state
interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  orders: any[] | null; // Adjust 'any' based on your actual order structure
}

// --- Async Thunks ---

// Login Thunk
export const login = createAsyncThunk<
  { user: User; token: string }, // Fulfilled return type
  LoginCredentials,              // Argument type
  { rejectValue: string }        // Type for rejectWithValue payload
>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword(credentials);
      if (error) throw error;
      if (!data?.session?.access_token || !data?.user) {
        throw new Error("Login failed: Invalid session or user data.");
      }
      return { user: data.user, token: data.session.access_token };
    } catch (error: unknown) {
      const message = error instanceof AuthError ? error.message : "An unknown error occurred during login.";
      return rejectWithValue(message);
    }
  }
);

// Register Thunk
export const register = createAsyncThunk<
  { user: User; token: string },
  RegisterCredentials,
  { rejectValue: string }
>(
  "auth/register",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: { data: credentials.userData }, // Pass extra data if needed
      });
      if (error) throw error;
      if (!data?.session?.access_token || !data?.user) {
        throw new Error("Registration failed: Invalid session or user data.");
      }
      // Note: Supabase might require email confirmation depending on settings.
      // The user/session might be returned but not fully active yet.
      return { user: data.user, token: data.session.access_token };
    } catch (error: unknown) {
      const message = error instanceof AuthError ? error.message : "An unknown error occurred during registration.";
      return rejectWithValue(message);
    }
  }
);

// Logout Thunk
export const logout = createAsyncThunk<
  void,                   // Fulfilled return type
  void,                   // Argument type (none)
  { rejectValue: string } // Type for rejectWithValue payload
>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: unknown) {
      const message = error instanceof AuthError ? error.message : "An unknown error occurred during logout.";
      return rejectWithValue(message);
    }
  }
);

// Check Authentication Status Thunk
export const checkAuth = createAsyncThunk<
  { user: User; token: string },
  void,
  { rejectValue: string }
>(
  "auth/check",
  async (_, { rejectWithValue }) => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error; // Throw actual errors
      if (!session?.access_token || !session?.user) {
        // This case means no one is logged in, not necessarily an error.
        // We'll let the reducer handle this by clearing state,
        // so we don't reject here unless there was a real API error.
        // For typing, we need to satisfy the return type or reject.
        // Throwing a specific error allows the reducer to distinguish.
        throw new Error("No active session found.");
      }
      return { user: session.user, token: session.access_token };
    } catch (error: unknown) {
      if (error instanceof AuthError) {
        return rejectWithValue(error.message);
      }
      // If it's our "No active session" error, don't reject, let reducer handle.
      if (error instanceof Error && error.message === "No active session found.") {
         // We need to return something or reject. Rejecting allows the .rejected case.
         return rejectWithValue("No active session found."); // Or handle differently
      }
      return rejectWithValue("An unknown error occurred checking auth status.");
    }
  }
);

// Update User Profile Thunk
export const updateProfile = createAsyncThunk<
  User,                   // Fulfilled return type
  UpdateProfileData,      // Argument type
  { rejectValue: string } // Type for rejectWithValue payload
>(
  "auth/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: profileData.userData, // Pass the nested userData object
      });
      if (error) throw error;
      if (!data?.user) throw new Error("Update failed: No user data returned.");
      return data.user;
    } catch (error: unknown) {
      const message = error instanceof AuthError ? error.message : "An unknown error occurred updating profile.";
      return rejectWithValue(message);
    }
  }
);

// Get User Orders Thunk
export const getMyOrders = createAsyncThunk<
  any[],                  // Fulfilled return type (adjust 'any' as needed)
  void,                   // Argument type (none)
  { rejectValue: string } // Type for rejectWithValue payload
>(
  "auth/getMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      // Optional: Check if user is authenticated first
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
          return rejectWithValue("User not authenticated to fetch orders.");
      }

      const { data, error } = await supabase
        .from("orders") // Ensure 'orders' table exists and RLS is set up
        .select("*")
        .eq('user_id', session.user.id) // Filter orders by the logged-in user's ID
        .order("created_at", { ascending: false });

      if (error) throw error; // Handle potential DB errors
      return data ?? []; // Return empty array if data is null/undefined
    } catch (error: unknown) {
      // Consider specific error types if Supabase client throws them for DB errors
      const message = error instanceof Error ? error.message : "An unknown error occurred fetching orders.";
      return rejectWithValue(message);
    }
  }
);

// Admin Login Thunk
export const loginAdmin = createAsyncThunk<
  { user: User; token: string },
  AdminLoginCredentials,
  { rejectValue: string }
>(
  "auth/loginAdmin",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword(credentials);
      if (error) throw error;
      if (!data?.session?.access_token || !data?.user) {
        throw new Error("Admin login failed: Invalid session or user data.");
      }
      // Check for admin role in user metadata (adjust 'is_admin' as needed)
      if (!data.user.user_metadata?.is_admin) {
        await supabase.auth.signOut(); // Sign out non-admin users immediately
        throw new Error("Unauthorized access: User is not an admin.");
      }
      return { user: data.user, token: data.session.access_token };
    } catch (error: unknown) {
      const message = error instanceof AuthError ? error.message : (error instanceof Error ? error.message : "An unknown error occurred during admin login.");
      return rejectWithValue(message);
    }
  }
);

// --- Initial State ---

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  orders: null, // Initialize orders
};

// --- Slice Definition ---

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Simple reducer to clear any existing error message
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login Reducers
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload ?? "Login failed";
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })

      // Register Reducers
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.loading = false;
        // Depending on email confirmation settings, user might not be fully authenticated yet
        state.user = action.payload.user;
        state.token = action.payload.token;
        // Set isAuthenticated based on your app's logic post-registration
        state.isAuthenticated = !!action.payload.user.email_confirmed_at; // Example
        state.error = null;
      })
      .addCase(register.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload ?? "Registration failed";
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })

      // Logout Reducers
      .addCase(logout.pending, (state) => {
        state.loading = true; // Indicate logout is in progress
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        state.loading = false;
        state.orders = null; // Clear orders on logout
      })
      .addCase(logout.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        // Decide if you want to show logout errors
        state.error = action.payload ?? "Logout failed";
        // Ensure user is logged out even if API call failed
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.orders = null;
      })

      // Check Auth Reducers
      .addCase(checkAuth.pending, (state) => {
        state.loading = !state.isAuthenticated; // Only show loading if not already logged in
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        // Only set error if it wasn't the "No active session" case
        if (action.payload && action.payload !== "No active session found.") {
          state.error = action.payload;
        } else {
          state.error = null; // Clear error if just not logged in
        }
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.orders = null; // Clear orders if not authenticated
      })

      // Update Profile Reducers
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload; // Update user data
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload ?? "Profile update failed";
      })

      // Get My Orders Reducers
      .addCase(getMyOrders.pending, (state) => {
        state.loading = true; // Could use a specific loading flag like state.ordersLoading
        state.error = null;
      })
      .addCase(getMyOrders.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(getMyOrders.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch orders";
        state.orders = null; // Clear orders on failure
      })

      // Login Admin Reducers
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true; // Mark as authenticated
        state.error = null;
      })
      .addCase(loginAdmin.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload ?? "Admin login failed";
        state.user = null;
        state.token = null;
        state.isAuthenticated = false; // Ensure not authenticated on failure
      });
  },
});

// --- Exports ---

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
