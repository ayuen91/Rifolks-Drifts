const express = require("express");
const router = express.Router();
const { supabase } = require("../utils/supabase");
const { logger } = require("../utils/logger");

// Health check endpoint
router.get("/", async (req, res) => {
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

module.exports = router;
