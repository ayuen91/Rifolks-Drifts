import express from "express";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// Initialize Supabase client
const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_ANON_KEY
);

// Login route
router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		// Find user in database
		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		// Verify password
		const isValidPassword = await bcrypt.compare(password, user.password);

		if (!isValidPassword) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		// Sign in with Supabase
		const { data: supabaseData, error: supabaseError } =
			await supabase.auth.signInWithPassword({
				email,
				password,
			});

		if (supabaseError) {
			throw supabaseError;
		}

		// Generate JWT token
		const token = jwt.sign(
			{ userId: user.id, email: user.email },
			process.env.JWT_SECRET,
			{ expiresIn: "24h" }
		);

		res.json({
			token,
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
			},
		});
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({ error: "Failed to login" });
	}
});

// Register route
router.post("/register", async (req, res) => {
	try {
		const { email, password, name } = req.body;

		// Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			return res.status(400).json({ error: "User already exists" });
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create user in database
		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				name,
			},
		});

		// Create user in Supabase
		const { data: supabaseUser, error: supabaseError } =
			await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						name,
					},
				},
			});

		if (supabaseError) {
			// Rollback database creation if Supabase fails
			await prisma.user.delete({ where: { id: user.id } });
			throw supabaseError;
		}

		res.status(201).json({
			message: "User registered successfully",
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
			},
		});
	} catch (error) {
		console.error("Registration error:", error);
		res.status(500).json({ error: "Failed to register user" });
	}
});

// Get user profile
router.get("/profile", auth, async (req, res) => {
	try {
		const { data: user, error } = await supabase
			.from("users")
			.select("id, name, email, role")
			.eq("id", req.user.id)
			.single();

		if (error) {
			logger.error("Error fetching user profile:", error);
			return res
				.status(500)
				.json({ error: "Error fetching user profile" });
		}

		res.json(user);
	} catch (error) {
		logger.error("Get profile error:", error);
		res.status(500).json({ error: "Server error" });
	}
});

// Logout user
router.post("/logout", async (req, res) => {
	try {
		const { error } = await supabase.auth.signOut();
		if (error) throw error;
		res.json({ message: "Logged out successfully" });
	} catch (error) {
		console.error("Logout error:", error);
		res.status(500).json({ error: "Failed to logout" });
	}
});

export default router;
