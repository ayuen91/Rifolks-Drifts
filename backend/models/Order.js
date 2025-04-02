const prisma = require("../utils/prisma");

class Order {
	static async create(orderData) {
		return prisma.order.create({
			data: orderData,
			include: {
				items: {
					include: {
						product: true,
					},
				},
			},
		});
	}

	static async findById(id) {
		return prisma.order.findUnique({
			where: { id },
			include: {
				items: {
					include: {
						product: true,
					},
				},
			},
		});
	}

	static async findByUserId(userId) {
		return prisma.order.findMany({
			where: { userId },
			include: {
				items: {
					include: {
						product: true,
					},
				},
			},
		});
	}

	static async updateStatus(id, status) {
		return prisma.order.update({
			where: { id },
			data: { status },
		});
	}

	static async updatePaymentStatus(id, isPaid) {
		return prisma.order.update({
			where: { id },
			data: {
				isPaid,
				paidAt: isPaid ? new Date() : null,
			},
		});
	}

	static async updateDeliveryStatus(id, isDelivered) {
		return prisma.order.update({
			where: { id },
			data: {
				isDelivered,
				deliveredAt: isDelivered ? new Date() : null,
			},
		});
	}
}

module.exports = Order;
