import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger.js";

const prisma = new PrismaClient();

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
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
			prisma.product.count(where),
			prisma.product.findMany(where, skip, pageSize),
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
export const getProductById = async (req, res) => {
	try {
		const product = await prisma.product.findUnique({
			where: { id: parseInt(req.params.id) },
			include: {
				category: true,
			},
		});

		if (!product) {
			return res.status(404).json({ error: "Product not found" });
		}

		res.json(product);
	} catch (error) {
		logger.error("Error fetching product:", error);
		res.status(500).json({ error: "Failed to fetch product" });
	}
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
	try {
		const { name, description, price, categoryId, imageUrl } = req.body;

		const product = await prisma.product.create({
			data: {
				name,
				description,
				price: parseFloat(price),
				categoryId: parseInt(categoryId),
				imageUrl,
			},
			include: {
				category: true,
			},
		});

		res.status(201).json(product);
	} catch (error) {
		logger.error("Error creating product:", error);
		res.status(500).json({ error: "Failed to create product" });
	}
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
	try {
		const { name, description, price, categoryId, imageUrl } = req.body;

		const product = await prisma.product.update({
			where: { id: parseInt(req.params.id) },
			data: {
				name,
				description,
				price: parseFloat(price),
				categoryId: parseInt(categoryId),
				imageUrl,
			},
			include: {
				category: true,
			},
		});

		res.json(product);
	} catch (error) {
		logger.error("Error updating product:", error);
		res.status(500).json({ error: "Failed to update product" });
	}
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
	try {
		await prisma.product.delete({
			where: { id: parseInt(req.params.id) },
		});

		res.json({ message: "Product deleted successfully" });
	} catch (error) {
		logger.error("Error deleting product:", error);
		res.status(500).json({ error: "Failed to delete product" });
	}
};

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
export const getTopProducts = async (req, res) => {
	try {
		const products = await prisma.product.findMany({
			include: {
				category: true,
				reviews: true,
			},
			orderBy: {
				reviews: {
					_count: "desc",
				},
			},
			take: 5,
		});

		res.json(products);
	} catch (error) {
		logger.error("Error fetching top products:", error);
		res.status(500).json({ error: "Failed to fetch top products" });
	}
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req, res) => {
	try {
		const { rating, comment } = req.body;
		const productId = parseInt(req.params.id);

		const review = await prisma.review.create({
			data: {
				rating: parseInt(rating),
				comment,
				productId,
				userId: req.user.id,
			},
		});

		res.status(201).json(review);
	} catch (error) {
		logger.error("Error creating review:", error);
		res.status(500).json({ error: "Failed to create review" });
	}
};
