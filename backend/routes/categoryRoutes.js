import express from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// Get all categories
router.get("/", async (req, res) => {
	try {
		const categories = await prisma.category.findMany();
		res.json(categories);
	} catch (error) {
		console.error("Error fetching categories:", error);
		res.status(500).json({ error: "Failed to fetch categories" });
	}
});

// Get single category
router.get("/:id", async (req, res) => {
	try {
		const category = await prisma.category.findUnique({
			where: { id: parseInt(req.params.id) },
			include: {
				products: true,
			},
		});

		if (!category) {
			return res.status(404).json({ error: "Category not found" });
		}

		res.json(category);
	} catch (error) {
		console.error("Error fetching category:", error);
		res.status(500).json({ error: "Failed to fetch category" });
	}
});

// Create category (protected route)
router.post("/", auth, async (req, res) => {
	try {
		const { name, description } = req.body;

		const category = await prisma.category.create({
			data: {
				name,
				description,
			},
		});

		res.status(201).json(category);
	} catch (error) {
		console.error("Error creating category:", error);
		res.status(500).json({ error: "Failed to create category" });
	}
});

// Update category (protected route)
router.put("/:id", auth, async (req, res) => {
	try {
		const { name, description } = req.body;

		const category = await prisma.category.update({
			where: { id: parseInt(req.params.id) },
			data: {
				name,
				description,
			},
		});

		res.json(category);
	} catch (error) {
		console.error("Error updating category:", error);
		res.status(500).json({ error: "Failed to update category" });
	}
});

// Delete category (protected route)
router.delete("/:id", auth, async (req, res) => {
	try {
		await prisma.category.delete({
			where: { id: parseInt(req.params.id) },
		});

		res.json({ message: "Category deleted successfully" });
	} catch (error) {
		console.error("Error deleting category:", error);
		res.status(500).json({ error: "Failed to delete category" });
	}
});

export default router;
