const { logger } = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
	logger.error("Error:", err);

	// Handle specific error types
	if (err.name === "ValidationError") {
		return res.status(400).json({
			error: "Validation Error",
			details: err.message,
		});
	}

	if (err.name === "UnauthorizedError") {
		return res.status(401).json({
			error: "Unauthorized",
			message: "Invalid or expired token",
		});
	}

	// Default error
	res.status(err.status || 500).json({
		error:
			process.env.NODE_ENV === "production"
				? "Internal Server Error"
				: err.message,
		...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
	});
};

module.exports = { errorHandler };
