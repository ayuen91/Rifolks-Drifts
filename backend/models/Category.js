const prisma = require("../utils/prisma");

class Category {
	static async findAll() {
		return prisma.category.findMany({
			orderBy: {
				name: "asc",
			},
		});
	}

	static async findById(id) {
		return prisma.category.findUnique({
			where: { id: parseInt(id) },
		});
	}

	static async create(categoryData) {
		return prisma.category.create({
			data: categoryData,
		});
	}

	static async update(id, categoryData) {
		return prisma.category.update({
			where: { id: parseInt(id) },
			data: categoryData,
		});
	}

	static async delete(id) {
		return prisma.category.delete({
			where: { id: parseInt(id) },
		});
	}
}

module.exports = Category;
