const { execSync } = require("child_process");
const { logger } = require("../utils/logger");
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables from .env file if it exists
const envPath = path.resolve(__dirname, "../.env");
dotenv.config({ path: envPath });

async function runMigrations() {
	try {
		// Validate required environment variables
		const requiredEnvVars = ["DATABASE_URL", "DIRECT_URL"];
		const missingVars = requiredEnvVars.filter(
			(varName) => !process.env[varName]
		);

		if (missingVars.length > 0) {
			throw new Error(
				`Missing required environment variables: ${missingVars.join(
					", "
				)}`
			);
		}

		// First, check if we can connect to the database
		logger.info("Checking database connection...");
		logger.info(
			"Database URL:",
			process.env.DATABASE_URL?.replace(/:[^@]+@/, ":****@")
		);

		// Try to connect to the database
		logger.info("Attempting to connect to database...");
		execSync("npx prisma db pull", {
			stdio: "inherit",
			env: {
				...process.env,
				DATABASE_URL: process.env.DATABASE_URL,
				DIRECT_URL: process.env.DIRECT_URL,
			},
		});

		// Then run migrations
		logger.info("Running database migrations...");
		execSync("npx prisma migrate deploy", {
			stdio: "inherit",
			env: {
				...process.env,
				DATABASE_URL: process.env.DATABASE_URL,
				DIRECT_URL: process.env.DIRECT_URL,
			},
		});

		logger.info("Database migrations completed successfully");
	} catch (error) {
		logger.error("Migration failed:", error);
		logger.error("Error details:", {
			message: error.message,
			code: error.code,
			stack: error.stack,
			env: {
				DATABASE_URL: process.env.DATABASE_URL ? "present" : "missing",
				DIRECT_URL: process.env.DIRECT_URL ? "present" : "missing",
				NODE_ENV: process.env.NODE_ENV,
			},
		});

		// If it's a connection error, provide more specific guidance
		if (error.message.includes("Can't reach database server")) {
			logger.error(`
				Database connection failed. Please check:
				1. DATABASE_URL environment variable is set correctly
				2. Database server is running and accessible
				3. Network allows connections to the database port
				4. Database credentials are correct
				5. Project reference and password are correct
				6. Direct connection is available for migrations
			`);
		}

		process.exit(1);
	}
}

runMigrations();
