import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger.js";

const prisma = new PrismaClient();

// Get inventory for all products
export const getInventory = async (req, res) => {
	try {
		const inventory = await prisma.inventory.findMany();
		res.json(inventory);
	} catch (error) {
		logger.error("Error fetching inventory:", error);
		res.status(500).json({ error: "Failed to fetch inventory" });
	}
};

// Update inventory for a specific product
export const updateInventory = async (req, res) => {
	try {
		const { productId } = req.params;
		const { stockLevel } = req.body;

		const updatedInventory = await prisma.inventory.update({
			where: { productId: parseInt(productId) },
			data: { stockLevel: parseInt(stockLevel) },
		});

		res.json({
			message: "Inventory updated successfully",
			inventory: updatedInventory,
		});
	} catch (error) {
		logger.error("Error updating inventory:", error);
		res.status(500).json({ error: "Failed to update inventory" });
	}
};
