const fs = require("fs");
const path = require("path");

const buildDir = path.join(__dirname, "..", "build");

// Check if build directory exists
if (!fs.existsSync(buildDir)) {
	console.error("Build directory not found!");
	process.exit(1);
}

// Check for required files
const requiredFiles = [
	"index.html",
	"static/js/main.chunk.js",
	"static/css/main.chunk.css",
	"sitemap.xml",
	"robots.txt",
];

for (const file of requiredFiles) {
	const filePath = path.join(buildDir, file);
	if (!fs.existsSync(filePath)) {
		console.error(`Required file not found: ${file}`);
		process.exit(1);
	}
}

// Check for environment variables
const requiredEnvVars = [
	"REACT_APP_API_URL",
	"REACT_APP_SUPABASE_URL",
	"REACT_APP_SUPABASE_ANON_KEY",
	"REACT_APP_BASE_URL",
	"REACT_APP_ENABLE_PERFORMANCE_MONITORING",
	"REACT_APP_PERFORMANCE_MONITORING_SAMPLE_RATE",
];

for (const envVar of requiredEnvVars) {
	if (!process.env[envVar]) {
		console.error(`Required environment variable not set: ${envVar}`);
		process.exit(1);
	}
}

// Check bundle size
const jsPath = path.join(buildDir, "static/js/main.chunk.js");
const cssPath = path.join(buildDir, "static/css/main.chunk.css");

const jsSize = fs.statSync(jsPath).size / 1024 / 1024; // Convert to MB
const cssSize = fs.statSync(cssPath).size / 1024; // Convert to KB

console.log("Bundle sizes:");
console.log(`JavaScript: ${jsSize.toFixed(2)}MB`);
console.log(`CSS: ${cssSize.toFixed(2)}KB`);

if (jsSize > 2) {
	console.warn(
		"Warning: JavaScript bundle is large (>2MB). Consider code splitting."
	);
}

// Check for performance monitoring configuration
if (process.env.REACT_APP_ENABLE_PERFORMANCE_MONITORING === "true") {
	const sampleRate = parseFloat(
		process.env.REACT_APP_PERFORMANCE_MONITORING_SAMPLE_RATE
	);
	if (isNaN(sampleRate) || sampleRate < 0 || sampleRate > 1) {
		console.warn(
			"Warning: Invalid performance monitoring sample rate. Should be between 0 and 1."
		);
	}
}

console.log("Build check passed successfully!");
