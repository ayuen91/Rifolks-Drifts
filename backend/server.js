const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { createClient } = require("@supabase/supabase-js");
const { errorHandler } = require("./middleware/errorHandler");
const { logger } = require("./utils/logger");
require("dotenv").config();

const app = express();

// Initialize Supabase client
const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_ANON_KEY
);

// Middleware
app.use(helmet());
app.use(
	cors({
		origin: process.env.ALLOWED_ORIGINS?.split(",") || [
			"http://localhost:3000",
		],
		credentials: true,
	})
);
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
		// Check database connection
		const { data, error } = await supabase
			.from("health_check")
			.select("*")
			.limit(1);
		if (error) throw error;

		res.status(200).json({
			status: "healthy",
			database: "connected",
			timestamp: new Date().toISOString(),
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
