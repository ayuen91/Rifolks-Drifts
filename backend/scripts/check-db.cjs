const { PrismaClient } = require("@prisma/client");
const { setTimeout } = require("timers/promises");

const maxRetries = parseInt(process.env.DATABASE_CONNECTION_RETRIES || "5");
const retryDelay = parseInt(
	process.env.DATABASE_CONNECTION_RETRY_DELAY || "5000"
);
let retries = 0;

async function checkDatabase() {
	const prisma = new PrismaClient({
		log: ["query", "error", "warn"],
		datasources: {
			db: {
				url: process.env.DATABASE_URL,
			},
		},
	});

	while (retries < maxRetries) {
		try {
			console.log(
				`Checking database connection (attempt ${
					retries + 1
				}/${maxRetries})...`
			);
			await prisma.$queryRaw`SELECT 1`;
			console.log("Database connection successful!");
			await prisma.$disconnect();
			process.exit(0);
		} catch (error) {
			retries++;
			console.error(
				`Connection attempt ${retries} failed:`,
				error.message
			);

			if (retries === maxRetries) {
				console.error(
					"Database connection failed after",
					maxRetries,
					"attempts"
				);
				await prisma.$disconnect();
				process.exit(1);
			}

			console.log(
				`Database connection failed, retrying in ${
					retryDelay / 1000
				} seconds...`
			);
			await setTimeout(retryDelay);
		}
	}
}

checkDatabase().catch(async (error) => {
	console.error("Database check failed:", error);
	process.exit(1);
});
