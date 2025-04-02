import { sql, testConnection } from "./utils/db.js";

async function main() {
	try {
		const isConnected = await testConnection();
		if (isConnected) {
			console.log("Successfully connected to the database!");

			// Test a simple query
			const currentTime = await sql`SELECT NOW()`;
			console.log("Current database time:", currentTime[0].now);
		}
	} catch (error) {
		console.error("Error:", error);
	} finally {
		process.exit(0);
	}
}

main();
