import express from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// Get all orders (protected route)
router.get("/", auth, async (req, res) => {
	try {
		const orders = await prisma.order.findMany({
			where: {
				userId: req.user.id,
			},
			include: {
				orderItems: {
					include: {
						product: true,
					},
				},
			},
		});
		res.json(orders);
	} catch (error) {
		console.error("Error fetching orders:", error);
		res.status(500).json({ error: "Failed to fetch orders" });
	}
});

// Get single order (protected route)
router.get("/:id", auth, async (req, res) => {
	try {
		const order = await prisma.order.findUnique({
			where: {
				id: parseInt(req.params.id),
				userId: req.user.id,
			},
			include: {
				orderItems: {
					include: {
						product: true,
					},
				},
			},
		});

		if (!order) {
			return res.status(404).json({ error: "Order not found" });
		}

		res.json(order);
	} catch (error) {
		console.error("Error fetching order:", error);
		res.status(500).json({ error: "Failed to fetch order" });
	}
});

// Create order (protected route)
router.post("/", auth, async (req, res) => {
	try {
		const { orderItems, shippingAddress, paymentMethod, totalPrice } =
			req.body;

		const order = await prisma.order.create({
			data: {
				userId: req.user.id,
				shippingAddress,
				paymentMethod,
				totalPrice: parseFloat(totalPrice),
				orderItems: {
					create: orderItems.map((item) => ({
						productId: item.productId,
						quantity: item.quantity,
						price: parseFloat(item.price),
					})),
				},
			},
			include: {
				orderItems: {
					include: {
						product: true,
					},
				},
			},
		});

		res.status(201).json(order);
	} catch (error) {
		console.error("Error creating order:", error);
		res.status(500).json({ error: "Failed to create order" });
	}
});

// Update order to paid (protected route)
router.put("/:id/pay", auth, async (req, res) => {
	try {
		const order = await prisma.order.update({
			where: {
				id: parseInt(req.params.id),
				userId: req.user.id,
			},
			data: {
				isPaid: true,
				paidAt: new Date(),
				paymentResult: req.body,
			},
		});

		res.json(order);
	} catch (error) {
		console.error("Error updating order payment:", error);
		res.status(500).json({ error: "Failed to update order payment" });
	}
});

// Update order to delivered (protected route)
router.put("/:id/deliver", auth, async (req, res) => {
	try {
		const order = await prisma.order.update({
			where: {
				id: parseInt(req.params.id),
				userId: req.user.id,
			},
			data: {
				isDelivered: true,
				deliveredAt: new Date(),
			},
		});

		res.json(order);
	} catch (error) {
		console.error("Error updating order delivery:", error);
		res.status(500).json({ error: "Failed to update order delivery" });
	}
});

export default router;
