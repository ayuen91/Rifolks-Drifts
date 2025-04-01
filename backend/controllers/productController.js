const Product = require("../models/Product");
const { logger } = require("../utils/logger");

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
	try {
		const pageSize = 12;
		const page = Number(req.query.page) || 1;
		const skip = pageSize * (page - 1);

		// Build where clause for filtering
		const where = {};

		// Filter by keyword
		if (req.query.keyword) {
			where.OR = [
				{ name: { contains: req.query.keyword, mode: "insensitive" } },
				{
					description: {
						contains: req.query.keyword,
						mode: "insensitive",
					},
				},
			];
		}

		// Filter by category
		if (req.query.category) {
			where.category = req.query.category;
		}

		// Filter by gender
		if (req.query.gender) {
			where.gender = req.query.gender;
		}

		// Filter by price range
		if (req.query.minPrice || req.query.maxPrice) {
			where.price = {};
			if (req.query.minPrice)
				where.price.gte = Number(req.query.minPrice);
			if (req.query.maxPrice)
				where.price.lte = Number(req.query.maxPrice);
		}

		// Filter by size
		if (req.query.size) {
			where.sizes = { has: req.query.size };
		}

		// Filter by color
		if (req.query.color) {
			where.colors = { has: req.query.color };
		}

		// Get total count and products
		const [count, products] = await Promise.all([
			Product.count(where),
			Product.findAll(where, skip, pageSize),
		]);

		res.json({
			products,
			page,
			pages: Math.ceil(count / pageSize),
			total: count,
		});
	} catch (error) {
		logger.error("Error fetching products:", error);
		res.status(500).json({ error: "Failed to fetch products" });
	}
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			res.json(product);
		} else {
			res.status(404).json({ error: "Product not found" });
		}
	} catch (error) {
		logger.error("Error fetching product:", error);
		res.status(500).json({ error: "Failed to fetch product" });
	}
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
	try {
		const product = await Product.create(req.body);
		res.status(201).json(product);
	} catch (error) {
		logger.error("Error creating product:", error);
		res.status(500).json({ error: "Failed to create product" });
	}
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
	try {
		const product = await Product.update(req.params.id, req.body);
		if (!product) {
			return res.status(404).json({ error: "Product not found" });
		}
		res.json(product);
	} catch (error) {
		logger.error("Error updating product:", error);
		res.status(500).json({ error: "Failed to update product" });
	}
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
	try {
		const product = await Product.delete(req.params.id);
		if (!product) {
			return res.status(404).json({ error: "Product not found" });
		}
		res.json({ message: "Product deleted successfully" });
	} catch (error) {
		logger.error("Error deleting product:", error);
		res.status(500).json({ error: "Failed to delete product" });
	}
};

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = async (req, res) => {
	try {
		const products = await Product.findTopRated();
		res.json(products);
	} catch (error) {
		logger.error("Error fetching top products:", error);
		res.status(500).json({ error: "Failed to fetch top products" });
	}
};

module.exports = {
	getProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
	getTopProducts,
};
