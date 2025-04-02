import express from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "../middleware/auth.js";
import {
	getProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
	createProductReview,
	getTopProducts,
} from "../controllers/productController.js";

const router = express.Router();
const prisma = new PrismaClient();

// Get all products
router.get("/", async (req, res) => {
	try {
		const products = await prisma.product.findMany({
			include: {
				category: true,
			},
		});
		res.json(products);
	} catch (error) {
		console.error("Error fetching products:", error);
		res.status(500).json({ error: "Failed to fetch products" });
	}
});

// Get single product
router.get("/:id", async (req, res) => {
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
		console.error("Error fetching product:", error);
		res.status(500).json({ error: "Failed to fetch product" });
	}
});

// Create product (protected route)
router.post("/", auth, async (req, res) => {
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
		console.error("Error creating product:", error);
		res.status(500).json({ error: "Failed to create product" });
	}
});

// Update product (protected route)
router.put("/:id", auth, async (req, res) => {
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
		console.error("Error updating product:", error);
		res.status(500).json({ error: "Failed to update product" });
	}
});

// Delete product (protected route)
router.delete("/:id", auth, async (req, res) => {
	try {
		await prisma.product.delete({
			where: { id: parseInt(req.params.id) },
		});

		res.json({ message: "Product deleted successfully" });
	} catch (error) {
		console.error("Error deleting product:", error);
		res.status(500).json({ error: "Failed to delete product" });
	}
});

// Review routes
router.post("/:id/reviews", auth, createProductReview);

export default router;
