const { execSync } = require("child_process");
const { setTimeout } = require("timers/promises");

const maxRetries = parseInt(process.env.DATABASE_CONNECTION_RETRIES || "5");
const retryDelay = parseInt(
	process.env.DATABASE_CONNECTION_RETRY_DELAY || "5000"
);
let retries = 0;

async function runMigration() {
	while (retries < maxRetries) {
		try {
			console.log(
				`Attempting database migration (attempt ${
					retries + 1
				}/${maxRetries})...`
			);
			// Use DIRECT_URL for migrations to avoid connection pooling issues
			execSync(
				"DATABASE_URL=$DIRECT_URL npx prisma migrate deploy --accept-data-loss",
				{
					stdio: "inherit",
					env: {
						...process.env,
						DATABASE_URL: process.env.DIRECT_URL,
					},
				}
			);
			console.log("Migration successful!");
			process.exit(0);
		} catch (error) {
			retries++;
			console.error(
				`Migration attempt ${retries} failed:`,
				error.message
			);

			if (retries === maxRetries) {
				console.error("Migration failed after", maxRetries, "attempts");
				process.exit(1);
			}

			console.log(
				`Migration attempt failed, retrying in ${
					retryDelay / 1000
				} seconds...`
			);
			await setTimeout(retryDelay);
		}
	}
}

runMigration().catch((error) => {
	console.error("Migration script failed:", error);
	process.exit(1);
});
