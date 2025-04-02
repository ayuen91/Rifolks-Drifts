import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { auth } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// Get user profile (protected route)
router.get("/profile", auth, async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: req.user.id },
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				createdAt: true,
			},
		});

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		res.json(user);
	} catch (error) {
		console.error("Error fetching user profile:", error);
		res.status(500).json({ error: "Failed to fetch user profile" });
	}
});

// Update user profile (protected route)
router.put("/profile", auth, async (req, res) => {
	try {
		const { name, email, password } = req.body;

		const updateData = {
			name,
			email,
		};

		if (password) {
			updateData.password = await bcrypt.hash(password, 10);
		}

		const user = await prisma.user.update({
			where: { id: req.user.id },
			data: updateData,
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				createdAt: true,
			},
		});

		res.json(user);
	} catch (error) {
		console.error("Error updating user profile:", error);
		res.status(500).json({ error: "Failed to update user profile" });
	}
});

// Get all users (admin only)
router.get("/", auth, async (req, res) => {
	try {
		if (req.user.role !== "admin") {
			return res.status(403).json({ error: "Not authorized as admin" });
		}

		const users = await prisma.user.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				createdAt: true,
			},
		});

		res.json(users);
	} catch (error) {
		console.error("Error fetching users:", error);
		res.status(500).json({ error: "Failed to fetch users" });
	}
});

// Delete user (admin only)
router.delete("/:id", auth, async (req, res) => {
	try {
		if (req.user.role !== "admin") {
			return res.status(403).json({ error: "Not authorized as admin" });
		}

		const user = await prisma.user.delete({
			where: { id: parseInt(req.params.id) },
		});

		res.json({ message: "User deleted successfully" });
	} catch (error) {
		console.error("Error deleting user:", error);
		res.status(500).json({ error: "Failed to delete user" });
	}
});

// Update user (admin only)
router.put("/:id", auth, async (req, res) => {
	try {
		if (req.user.role !== "admin") {
			return res.status(403).json({ error: "Not authorized as admin" });
		}

		const { name, email, role } = req.body;

		const user = await prisma.user.update({
			where: { id: parseInt(req.params.id) },
			data: {
				name,
				email,
				role,
			},
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				createdAt: true,
			},
		});

		res.json(user);
	} catch (error) {
		console.error("Error updating user:", error);
		res.status(500).json({ error: "Failed to update user" });
	}
});

export default router;
