const Product = require("../models/Product");

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
	try {
		const pageSize = 12;
		const page = Number(req.query.page) || 1;
		const keyword = req.query.keyword
			? {
					$or: [
						{ name: { $regex: req.query.keyword, $options: "i" } },
						{
							description: {
								$regex: req.query.keyword,
								$options: "i",
							},
						},
					],
			  }
			: {};

		// Filter by category
		if (req.query.category) {
			keyword.category = req.query.category;
		}

		// Filter by gender
		if (req.query.gender) {
			keyword.gender = req.query.gender;
		}

		// Filter by price range
		if (req.query.minPrice || req.query.maxPrice) {
			keyword.price = {};
			if (req.query.minPrice)
				keyword.price.$gte = Number(req.query.minPrice);
			if (req.query.maxPrice)
				keyword.price.$lte = Number(req.query.maxPrice);
		}

		// Filter by size
		if (req.query.size) {
			keyword.sizes = req.query.size;
		}

		// Filter by color
		if (req.query.color) {
			keyword.colors = req.query.color;
		}

		const count = await Product.countDocuments({ ...keyword });
		const products = await Product.find({ ...keyword })
			.populate("category", "name")
			.limit(pageSize)
			.skip(pageSize * (page - 1))
			.sort({ createdAt: -1 });

		res.json({
			products,
			page,
			pages: Math.ceil(count / pageSize),
			total: count,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id).populate(
			"category",
			"name"
		);

		if (product) {
			res.json(product);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
	try {
		const product = new Product(req.body);
		const createdProduct = await product.save();
		res.status(201).json(createdProduct);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (product) {
			Object.assign(product, req.body);
			const updatedProduct = await product.save();
			res.json(updatedProduct);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (product) {
			await product.remove();
			res.json({ message: "Product removed" });
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (product) {
			const alreadyReviewed = product.reviews.find(
				(r) => r.user.toString() === req.user._id.toString()
			);

			if (alreadyReviewed) {
				res.status(400).json({ message: "Product already reviewed" });
				return;
			}

			const review = {
				user: req.user._id,
				name: req.user.username,
				rating: Number(req.body.rating),
				comment: req.body.comment,
			};

			product.reviews.push(review);

			product.numReviews = product.reviews.length;

			product.rating =
				product.reviews.reduce((acc, item) => item.rating + acc, 0) /
				product.reviews.length;

			await product.save();
			res.status(201).json({ message: "Review added" });
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = async (req, res) => {
	try {
		const products = await Product.find({}).sort({ rating: -1 }).limit(3);
		res.json(products);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	getProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
	createProductReview,
	getTopProducts,
};
