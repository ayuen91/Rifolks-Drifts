import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
	shippingAddress: JSON.parse(localStorage.getItem("shippingAddress")) || {},
	itemsPrice: 0,
	shippingPrice: 0,
	taxPrice: 0,
	totalPrice: 0,
};

const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		addToCart: (state, action) => {
			const item = action.payload;
			const existItem = state.cartItems.find(
				(x) => x.product === item.product
			);

			if (existItem) {
				state.cartItems = state.cartItems.map((x) =>
					x.product === existItem.product ? item : x
				);
			} else {
				state.cartItems = [...state.cartItems, item];
			}

			localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
		},
		removeFromCart: (state, action) => {
			state.cartItems = state.cartItems.filter(
				(x) => x.product !== action.payload
			);
			localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
		},
		saveShippingAddress: (state, action) => {
			state.shippingAddress = action.payload;
			localStorage.setItem(
				"shippingAddress",
				JSON.stringify(action.payload)
			);
		},
		calculatePrices: (state) => {
			state.itemsPrice = state.cartItems.reduce(
				(acc, item) => acc + item.price * item.quantity,
				0
			);
			state.shippingPrice = state.itemsPrice > 100 ? 0 : 10;
			state.taxPrice = Number((0.15 * state.itemsPrice).toFixed(2));
			state.totalPrice = Number(
				(
					state.itemsPrice +
					state.shippingPrice +
					state.taxPrice
				).toFixed(2)
			);
		},
		clearCart: (state) => {
			state.cartItems = [];
			state.shippingAddress = {};
			state.itemsPrice = 0;
			state.shippingPrice = 0;
			state.taxPrice = 0;
			state.totalPrice = 0;
			localStorage.removeItem("cartItems");
			localStorage.removeItem("shippingAddress");
		},
	},
});

export const {
	addToCart,
	removeFromCart,
	saveShippingAddress,
	calculatePrices,
	clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
