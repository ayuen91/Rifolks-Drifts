import express from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// Request COD (protected route)
router.post("/request", auth, async (req, res) => {
	try {
		const { orderId, address, phone } = req.body;

		const order = await prisma.order.findUnique({
			where: { id: parseInt(orderId) },
		});

		if (!order) {
			return res.status(404).json({ error: "Order not found" });
		}

		const codRequest = await prisma.codRequest.create({
			data: {
				orderId: parseInt(orderId),
				userId: req.user.id,
				address,
				phone,
				status: "PENDING",
			},
		});

		res.status(201).json(codRequest);
	} catch (error) {
		console.error("Error creating COD request:", error);
		res.status(500).json({ error: "Failed to create COD request" });
	}
});

// Get COD requests for user (protected route)
router.get("/", auth, async (req, res) => {
	try {
		const codRequests = await prisma.codRequest.findMany({
			where: {
				userId: req.user.id,
			},
			include: {
				order: true,
			},
		});

		res.json(codRequests);
	} catch (error) {
		console.error("Error fetching COD requests:", error);
		res.status(500).json({ error: "Failed to fetch COD requests" });
	}
});

// Update COD request status (admin only)
router.put("/:id", auth, async (req, res) => {
	try {
		if (req.user.role !== "admin") {
			return res.status(403).json({ error: "Not authorized as admin" });
		}

		const { status } = req.body;

		const codRequest = await prisma.codRequest.update({
			where: { id: parseInt(req.params.id) },
			data: {
				status,
			},
			include: {
				order: true,
			},
		});

		res.json(codRequest);
	} catch (error) {
		console.error("Error updating COD request:", error);
		res.status(500).json({ error: "Failed to update COD request" });
	}
});

export default router;
