const { execSync } = require("child_process");
const { logger } = require("../utils/logger");

try {
	logger.info("Running database migrations...");
	execSync("npx prisma migrate reset --force", { stdio: "inherit" });
	execSync("npx prisma migrate deploy", { stdio: "inherit" });
	logger.info("Database migrations completed successfully");
} catch (error) {
	logger.error("Migration failed:", error);
	process.exit(1);
}
