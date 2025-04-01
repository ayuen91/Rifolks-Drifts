const dotenv = require('dotenv');
dotenv.config();

const requiredEnvVars = {
  // Server
  PORT: "Server port number",
  NODE_ENV: "Node environment (development/production)",

  // Database
  DATABASE_URL: "PostgreSQL database URL",

  // JWT
  JWT_SECRET: "JWT secret key",
  JWT_EXPIRES_IN: "JWT expiration time",

  // Supabase
  SUPABASE_URL: "Supabase project URL",
  SUPABASE_ANON_KEY: "Supabase anonymous key",

  // CORS
  ALLOWED_ORIGINS: "Comma-separated list of allowed origins",

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: "Rate limit window in milliseconds",
  RATE_LIMIT_MAX_REQUESTS: "Maximum number of requests per window",

  // Logging
  LOG_LEVEL: "Logging level (info/debug/error)",
};

function checkEnvVars() {
  const missingVars = [];
  const warnings = [];

  // Check for missing required variables
  Object.entries(requiredEnvVars).forEach(([key, description]) => {
    if (!process.env[key]) {
      missingVars.push({ key, description });
    }
  });

  // Check for development-specific warnings
  if (process.env.NODE_ENV === "production") {
    if (process.env.JWT_SECRET === "your_jwt_secret_here") {
      warnings.push(
        "JWT_SECRET is using default value. Please set a secure secret in production."
      );
    }
    if (process.env.LOG_LEVEL === "debug") {
      warnings.push(
        "LOG_LEVEL is set to debug in production. Consider using info or error level."
      );
    }
  }

  // Print results
  if (missingVars.length > 0) {
    console.error("\n❌ Missing required environment variables:");
    missingVars.forEach(({ key, description }) => {
      console.error(`  - ${key}: ${description}`);
    });
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.warn("\n⚠️  Warnings:");
    warnings.forEach((warning) => {
      console.warn(`  - ${warning}`);
    });
  }

  console.log("\n✅ All required environment variables are set!");
}

// Run the check
checkEnvVars();
