const fs = require("fs");
const path = require("path");

const buildDir = path.join(__dirname, "..", "build");
const sitemapPath = path.join(buildDir, "sitemap.xml");

// Base URL from environment variable or default
const baseUrl =
	process.env.REACT_APP_BASE_URL || "https://rifolks-drifts.netlify.app";

// Define routes
const routes = [
	"",
	"/products",
	"/about",
	"/contact",
	"/terms",
	"/privacy",
	"/shipping",
	"/returns",
];

// Generate sitemap XML
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	${routes
		.map(
			(route) => `
	<url>
		<loc>${baseUrl}${route}</loc>
		<changefreq>${route === "" ? "daily" : "weekly"}</changefreq>
		<priority>${route === "" ? "1.0" : "0.8"}</priority>
	</url>`
		)
		.join("")}
</urlset>`;

// Write sitemap to build directory
fs.writeFileSync(sitemapPath, sitemap);

console.log("Sitemap generated successfully!");
