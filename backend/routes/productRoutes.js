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
// const prisma = new PrismaClient(); // Prisma client is likely already initialized in the controller or globally

// Get all products (uses controller with pagination/filtering)
router.get("/", getProducts);

// Get single product
router.get("/:id", getProductById);

// Create product (protected route)
router.post("/", auth, createProduct);

// Update product (protected route)
router.put("/:id", auth, updateProduct);

// Delete product (protected route)
router.delete("/:id", auth, deleteProduct);

// Get top products
router.get("/top", getTopProducts);

// Review routes
router.post("/:id/reviews", auth, createProductReview);
export default router;
