const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

class User {
	static async findByEmail(email) {
		return prisma.user.findUnique({
			where: { email },
		});
	}

	static async findById(id) {
		return prisma.user.findUnique({
			where: { id },
		});
	}

	static async create(userData) {
		const hashedPassword = await bcrypt.hash(userData.password, 10);
		return prisma.user.create({
			data: {
				...userData,
				password: hashedPassword,
			},
		});
	}

	static async update(id, userData) {
		if (userData.password) {
			userData.password = await bcrypt.hash(userData.password, 10);
		}
		return prisma.user.update({
			where: { id },
			data: userData,
		});
	}

	static async delete(id) {
		return prisma.user.delete({
			where: { id },
		});
	}

	static async comparePassword(password, hashedPassword) {
		return bcrypt.compare(password, hashedPassword);
	}
}

module.exports = User;
