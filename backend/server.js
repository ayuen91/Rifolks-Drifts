require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { createClient } = require("@supabase/supabase-js");
const { logger } = require("./utils/logger");
const prisma = require("./utils/prisma");

// Validate required environment variables
const requiredEnvVars = ["SUPABASE_URL", "SUPABASE_ANON_KEY", "DATABASE_URL"];
for (const envVar of requiredEnvVars) {
	if (!process.env[envVar]) {
		logger.error(`Missing required environment variable: ${envVar}`);
		process.exit(1);
	}
}

const app = express();

// Initialize Supabase client
const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_ANON_KEY
);

// Connection state tracking
let isDatabaseConnected = false;
let isSupabaseConnected = false;

// Health check endpoint - placed before any middleware
app.get("/health", async (req, res) => {
	const healthStatus = {
		status: "healthy",
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
		environment: process.env.NODE_ENV || "development",
		port: process.env.PORT,
		database: "disconnected",
		supabase: "disconnected",
		memory: process.memoryUsage(),
		nodeVersion: process.version,
		details: {},
	};

	try {
		// Test database connection with timeout
		const dbPromise = prisma.$queryRaw`SELECT 1`;
		const dbTimeout = new Promise((_, reject) =>
			setTimeout(
				() => reject(new Error("Database connection timeout")),
				5000
			)
		);
		await Promise.race([dbPromise, dbTimeout]);
		healthStatus.database = "connected";
		isDatabaseConnected = true;
	} catch (error) {
		healthStatus.database = "error";
		healthStatus.details.databaseError = error.message;
		isDatabaseConnected = false;
		logger.error("Database health check error:", error);
	}

	try {
		// Test Supabase connection with timeout
		const supabasePromise = supabase.from("users").select("count").limit(1);
		const supabaseTimeout = new Promise((_, reject) =>
			setTimeout(
				() => reject(new Error("Supabase connection timeout")),
				5000
			)
		);
		const { data, error } = await Promise.race([
			supabasePromise,
			supabaseTimeout,
		]);
		if (error) throw error;
		healthStatus.supabase = "connected";
		isSupabaseConnected = true;
	} catch (error) {
		healthStatus.supabase = "error";
		healthStatus.details.supabaseError = error.message;
		isSupabaseConnected = false;
		logger.error("Supabase health check error:", error);
	}

	// Determine overall health status
	if (!isDatabaseConnected || !isSupabaseConnected) {
		healthStatus.status = "unhealthy";
		res.status(503).json(healthStatus);
	} else {
		res.status(200).json(healthStatus);
	}
});

// Basic middleware
app.use(express.json());
app.use(morgan("combined"));

// Security middleware
app.use(
	helmet({
		crossOriginResourcePolicy: { policy: "cross-origin" },
	})
);

// CORS configuration
const corsOptions = {
	origin: process.env.ALLOWED_ORIGINS?.split(",") || [
		"http://localhost:3000",
	],
	credentials: true,
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
	windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
	max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
});
app.use(limiter);

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/cod", require("./routes/codRoutes"));

// Error handling middleware
app.use((err, req, res, next) => {
	logger.error("Unhandled error:", err);
	res.status(500).json({
		error: "Internal Server Error",
		message:
			process.env.NODE_ENV === "development"
				? err.message
				: "Something went wrong",
	});
});

// Start server
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, "0.0.0.0", async () => {
	try {
		// Test database connection on startup with retries
		let retries = 3;
		while (retries > 0) {
			try {
				await prisma.$queryRaw`SELECT 1`;
				isDatabaseConnected = true;
				logger.info("Database connection successful");
				break;
			} catch (error) {
				retries--;
				if (retries === 0) throw error;
				logger.warn(
					`Database connection attempt failed, retrying... (${retries} attempts left)`
				);
				await new Promise((resolve) => setTimeout(resolve, 5000));
			}
		}

		logger.info(`Server running on port ${PORT}`);
		logger.info(`Environment: ${process.env.NODE_ENV}`);
		logger.info(`Health check available at http://0.0.0.0:${PORT}/health`);
	} catch (error) {
		logger.error("Failed to connect to database:", error);
		process.exit(1);
	}
});

// Handle server errors
server.on("error", (error) => {
	if (error.code === "EADDRINUSE") {
		logger.error(
			`Port ${PORT} is already in use. Please try a different port.`
		);
		process.exit(1);
	} else {
		logger.error("Server error:", error);
	}
});

// Handle server shutdown gracefully
process.on("SIGTERM", async () => {
	logger.info("SIGTERM received. Shutting down gracefully...");
	await prisma.$disconnect();
	server.close(() => {
		logger.info("Server closed");
		process.exit(0);
	});
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
	logger.error("Uncaught Exception:", error);
	process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
	logger.error("Unhandled Rejection at:", promise, "reason:", reason);
	process.exit(1);
});
