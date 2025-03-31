import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import wishlistReducer from "./slices/wishlistSlice";
import productsReducer from "./slices/productsSlice";
import categoriesReducer from "./slices/categoriesSlice";

export const store = configureStore({
	reducer: {
		auth: authReducer,
		wishlist: wishlistReducer,
		products: productsReducer,
		categories: categoriesReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				// Ignore these paths in the state
				ignoredActions: [
					"auth/login/fulfilled",
					"auth/register/fulfilled",
				],
				ignoredPaths: ["auth.user"],
			},
		}),
});

export default store;
