const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { logger } = require("../utils/logger");

const protect = async (req, res, next) => {
	try {
		let token;

		if (req.headers.authorization?.startsWith("Bearer")) {
			token = req.headers.authorization.split(" ")[1];
		}

		if (!token) {
			return res.status(401).json({ error: "Not authorized, no token" });
		}

		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			const user = await User.findById(decoded.id);

			if (!user) {
				return res.status(401).json({ error: "User not found" });
			}

			req.user = user;
			next();
		} catch (error) {
			logger.error("Token verification failed:", error);
			return res
				.status(401)
				.json({ error: "Not authorized, token failed" });
		}
	} catch (error) {
		logger.error("Auth middleware error:", error);
		res.status(500).json({ error: "Server error" });
	}
};

const admin = (req, res, next) => {
	if (req.user && req.user.role === "admin") {
		next();
	} else {
		res.status(401).json({ error: "Not authorized as admin" });
	}
};

module.exports = { protect, admin };
