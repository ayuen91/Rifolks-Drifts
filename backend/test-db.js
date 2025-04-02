import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function testConnection() {
	try {
		await prisma.$connect();
		console.log("Database connection successful!");
		await prisma.$disconnect();
	} catch (error) {
		console.error("Database connection failed:", error);
		process.exit(1);
	}
}

testConnection();
