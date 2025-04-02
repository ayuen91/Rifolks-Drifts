import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = async (req, res, next) => {
	try {
		const token = req.header("Authorization")?.replace("Bearer ", "");

		if (!token) {
			return res
				.status(401)
				.json({ error: "No authentication token, access denied" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await prisma.user.findUnique({
			where: { id: decoded.userId },
		});

		if (!user) {
			return res.status(401).json({ error: "User not found" });
		}

		req.user = user;
		next();
	} catch (error) {
		console.error("Auth middleware error:", error);
		res.status(401).json({ error: "Token is invalid" });
	}
};

export const admin = async (req, res, next) => {
	try {
		if (req.user && req.user.role === "admin") {
			next();
		} else {
			res.status(403).json({ error: "Access denied. Admin only." });
		}
	} catch (error) {
		console.error("Admin middleware error:", error);
		res.status(500).json({ error: "Server error" });
	}
};
