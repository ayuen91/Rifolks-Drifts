const express = require("express");
const router = express.Router();
const { supabase } = require("../utils/supabase");
const { logger } = require("../utils/logger");

// Login route
router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) throw error;
		res.json(data);
	} catch (error) {
		logger.error("Login error:", error);
		res.status(400).json({ error: error.message });
	}
});

// Register route
router.post("/register", async (req, res) => {
	try {
		const { email, password } = req.body;
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
		});

		if (error) throw error;
		res.json(data);
	} catch (error) {
		logger.error("Registration error:", error);
		res.status(400).json({ error: error.message });
	}
});

module.exports = router;
