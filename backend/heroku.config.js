const config = {
	port: process.env.PORT || 5000,
	nodeEnv: process.env.NODE_ENV || "development",
	supabaseUrl: process.env.SUPABASE_URL,
	supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
	stripeSecretKey: process.env.STRIPE_SECRET_KEY,
	jwtSecret: process.env.JWT_SECRET,
	clientUrl: process.env.CLIENT_URL,
	corsOptions: {
		origin: process.env.CLIENT_URL,
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	},
};

module.exports = config;
