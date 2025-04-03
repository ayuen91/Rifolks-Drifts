import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import { logger } from "./utils/logger.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3001;

// Initialize Prisma client
const prisma = new PrismaClient();

// Initialize Supabase client
const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_ANON_KEY
);

// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(
	cors({
		origin: process.env.ALLOWED_ORIGINS.split(","),
		credentials: true,
	})
);

// Rate limiting
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import codRoutes from "./routes/codRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import userRoutes from "./routes/userRoutes.js";


app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cod", codRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
	res.status(200).json({ status: "ok" });
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: "Something went wrong!" });
});

// Start server
const startServer = async () => {
	try {
		// Test database connection
		await prisma.$connect();
		console.log("Database connected successfully");

		app.listen(port, () => {
			console.log(`Server is running on port ${port}`);
		});
	} catch (error) {
		console.error("Failed to start server:", error);
		process.exit(1);
	}
};

startServer();

// Handle graceful shutdown
process.on("SIGTERM", async () => {
	console.log("SIGTERM received. Closing HTTP server...");
	await prisma.$disconnect();
	process.exit(0);
});

process.on("SIGINT", async () => {
	console.log("SIGINT received. Closing HTTP server...");
	await prisma.$disconnect();
	process.exit(0);
});
