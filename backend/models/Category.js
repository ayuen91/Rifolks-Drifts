const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
		},
		slug: {
			type: String,
			unique: true,
			lowercase: true,
		},
		image: {
			type: String,
		},
		parent: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
			default: null,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		featured: {
			type: Boolean,
			default: false,
		},
		gender: {
			type: String,
			enum: ["men", "women", "unisex"],
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

// Create slug from name before saving
categorySchema.pre("save", function (next) {
	if (!this.isModified("name")) {
		return next();
	}
	this.slug = this.name
		.toLowerCase()
		.replace(/[^a-zA-Z0-9]/g, "-")
		.replace(/-+/g, "-");
	next();
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
