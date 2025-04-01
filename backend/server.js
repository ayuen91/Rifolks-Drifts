require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { createClient } = require("@supabase/supabase-js");
const { errorHandler } = require("./middleware/errorHandler");
const { logger } = require("./utils/logger");

// Validate required environment variables
const requiredEnvVars = ["SUPABASE_URL", "SUPABASE_ANON_KEY"];
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

// Basic middleware for all routes
app.use(express.json());
app.use(morgan("combined"));

// Health check endpoint
app.get("/health", (req, res) => {
	res.status(200).json({
		status: "healthy",
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
	});
});

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
const server = app.listen(PORT, () => {
	logger.info(`Server is running on port ${PORT}`);
	logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
	logger.info(`Health check available at http://0.0.0.0:${PORT}/health`);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
	logger.error("Uncaught Exception:", err);
	process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
	logger.error("Unhandled Rejection:", err);
	process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
	logger.info("SIGTERM received. Shutting down gracefully...");
	server.close(() => {
		logger.info("Server closed");
		process.exit(0);
	});
});
