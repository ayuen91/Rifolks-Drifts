const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		orderItems: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
				name: String,
				image: String,
				price: Number,
				quantity: {
					type: Number,
					required: true,
					min: 1,
				},
				size: String,
				color: String,
			},
		],
		shippingAddress: {
			street: String,
			city: String,
			state: String,
			postalCode: String,
			country: String,
		},
		paymentMethod: {
			type: String,
			required: true,
		},
		paymentResult: {
			id: String,
			status: String,
			update_time: String,
			email_address: String,
		},
		itemsPrice: {
			type: Number,
			required: true,
			default: 0.0,
		},
		taxPrice: {
			type: Number,
			required: true,
			default: 0.0,
		},
		shippingPrice: {
			type: Number,
			required: true,
			default: 0.0,
		},
		totalPrice: {
			type: Number,
			required: true,
			default: 0.0,
		},
		isPaid: {
			type: Boolean,
			required: true,
			default: false,
		},
		paidAt: Date,
		isDelivered: {
			type: Boolean,
			required: true,
			default: false,
		},
		deliveredAt: Date,
		status: {
			type: String,
			enum: [
				"pending",
				"processing",
				"shipped",
				"delivered",
				"cancelled",
			],
			default: "pending",
		},
	},
	{
		timestamps: true,
	}
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
