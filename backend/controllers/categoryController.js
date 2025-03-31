const Category = require("../models/Category");

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
	try {
		const categories = await Category.find({ isActive: true })
			.populate("parent", "name")
			.sort({ name: 1 });
		res.json(categories);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = async (req, res) => {
	try {
		const category = await Category.findById(req.params.id).populate(
			"parent",
			"name"
		);

		if (category) {
			res.json(category);
		} else {
			res.status(404).json({ message: "Category not found" });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
	try {
		const category = new Category(req.body);
		const createdCategory = await category.save();
		res.status(201).json(createdCategory);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
	try {
		const category = await Category.findById(req.params.id);

		if (category) {
			Object.assign(category, req.body);
			const updatedCategory = await category.save();
			res.json(updatedCategory);
		} else {
			res.status(404).json({ message: "Category not found" });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
	try {
		const category = await Category.findById(req.params.id);

		if (category) {
			await category.remove();
			res.json({ message: "Category removed" });
		} else {
			res.status(404).json({ message: "Category not found" });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Get categories by gender
// @route   GET /api/categories/gender/:gender
// @access  Public
const getCategoriesByGender = async (req, res) => {
	try {
		const categories = await Category.find({
			gender: req.params.gender,
			isActive: true,
		})
			.populate("parent", "name")
			.sort({ name: 1 });
		res.json(categories);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	getCategories,
	getCategoryById,
	createCategory,
	updateCategory,
	deleteCategory,
	getCategoriesByGender,
};
