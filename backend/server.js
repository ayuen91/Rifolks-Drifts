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

// Middleware
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

// Apply CORS to all routes except healthcheck
app.use((req, res, next) => {
	if (req.path === "/health") {
		next();
	} else {
		cors(corsOptions)(req, res, next);
	}
});

app.use(express.json());
app.use(morgan("combined"));

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

// Health check endpoint
app.get("/health", async (req, res) => {
	try {
		// Basic health check without database dependency
		res.status(200).json({
			status: "healthy",
			timestamp: new Date().toISOString(),
			environment: process.env.NODE_ENV || "development",
		});
	} catch (error) {
		logger.error("Health check failed:", error);
		res.status(500).json({
			status: "unhealthy",
			error: error.message,
		});
	}
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	logger.info(`Server running on port ${PORT}`);
	logger.info(`Environment: ${process.env.NODE_ENV}`);
});
