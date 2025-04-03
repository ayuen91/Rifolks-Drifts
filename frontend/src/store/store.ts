import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import wishlistReducer from "./slices/wishlistSlice";
import productsReducer from "./slices/productsSlice";
import categoriesReducer from "./slices/categoriesSlice";
import inventoryReducer from "./slices/inventorySlice";
import notificationReducer from "./slices/notificationSlice"; // Import notification reducer

export const store = configureStore({
	reducer: {
		auth: authReducer,
		wishlist: wishlistReducer,
		products: productsReducer,
		categories: categoriesReducer,
		inventory: inventoryReducer,
		notifications: notificationReducer, // Add notification reducer
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

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {auth: AuthState, wishlist: WishlistState, products: ProductsState, categories: CategoriesState, inventory: InventoryState}
export type AppDispatch = typeof store.dispatch;

export default store;
