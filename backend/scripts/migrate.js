const { execSync } = require("child_process");
const { logger } = require("../utils/logger");

async function runMigrations() {
	try {
		// First, check if we can connect to the database
		logger.info("Checking database connection...");
		execSync("npx prisma db pull", { stdio: "inherit" });

		// Then run migrations
		logger.info("Running database migrations...");
		execSync("npx prisma migrate deploy", { stdio: "inherit" });

		logger.info("Database migrations completed successfully");
	} catch (error) {
		logger.error("Migration failed:", error);
		logger.error("Error details:", {
			message: error.message,
			code: error.code,
			stack: error.stack,
		});

		// If it's a connection error, provide more specific guidance
		if (error.message.includes("Can't reach database server")) {
			logger.error(`
				Database connection failed. Please check:
				1. DATABASE_URL environment variable is set correctly
				2. Database server is running and accessible
				3. Network allows connections to the database port
				4. Database credentials are correct
			`);
		}

		process.exit(1);
	}
}

runMigrations();
