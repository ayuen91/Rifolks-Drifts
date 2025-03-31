const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
			min: 0,
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
			required: true,
		},
		images: [
			{
				type: String,
				required: true,
			},
		],
		stock: {
			type: Number,
			required: true,
			min: 0,
		},
		sizes: [
			{
				type: String,
				enum: ["XS", "S", "M", "L", "XL", "XXL"],
			},
		],
		colors: [
			{
				type: String,
			},
		],
		gender: {
			type: String,
			enum: ["men", "women", "unisex"],
			required: true,
		},
		rating: {
			type: Number,
			default: 0,
			min: 0,
			max: 5,
		},
		numReviews: {
			type: Number,
			default: 0,
		},
		reviews: [
			{
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				},
				name: String,
				rating: Number,
				comment: String,
			},
		],
		featured: {
			type: Boolean,
			default: false,
		},
		discount: {
			type: Number,
			default: 0,
			min: 0,
			max: 100,
		},
	},
	{
		timestamps: true,
	}
);

// Index for search functionality
productSchema.index({ name: "text", description: "text" });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
