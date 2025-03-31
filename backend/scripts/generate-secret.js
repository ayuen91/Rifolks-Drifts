const crypto = require("crypto");

function generateSecret() {
	// Generate a random 64-byte buffer
	const buffer = crypto.randomBytes(64);

	// Convert to base64 string
	const secret = buffer.toString("base64");

	console.log("\nGenerated JWT Secret:");
	console.log("---------------------");
	console.log(secret);
	console.log("\nAdd this to your .env file as JWT_SECRET");
	console.log(
		"Make sure to keep this secret secure and never commit it to version control!"
	);
}

generateSecret();
