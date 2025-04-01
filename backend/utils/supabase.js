const { createClient } = require("@supabase/supabase-js");
const { logger } = require("./logger");

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
	logger.error("Missing Supabase environment variables");
	process.exit(1);
}

const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_ANON_KEY
);

module.exports = { supabase };
