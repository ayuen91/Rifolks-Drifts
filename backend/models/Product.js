const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class Product {
	static async findAll(where = {}, skip = 0, take = 12) {
		return prisma.product.findMany({
			where,
			skip,
			take,
			orderBy: {
				createdAt: "desc",
			},
		});
	}

	static async findById(id) {
		return prisma.product.findUnique({
			where: { id: parseInt(id) },
		});
	}

	static async create(productData) {
		return prisma.product.create({
			data: productData,
		});
	}

	static async update(id, productData) {
		return prisma.product.update({
			where: { id: parseInt(id) },
			data: productData,
		});
	}

	static async delete(id) {
		return prisma.product.delete({
			where: { id: parseInt(id) },
		});
	}

	static async count(where = {}) {
		return prisma.product.count({ where });
	}

	static async findTopRated() {
		return prisma.product.findMany({
			orderBy: {
				rating: "desc",
			},
			take: 5,
		});
	}
}

module.exports = Product;
