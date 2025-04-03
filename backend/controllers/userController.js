import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { logger } from "../utils/logger.js";

const prisma = new PrismaClient();

// Get all users
export const getUsers = async (req, res) => {
	try {
		const users = await prisma.user.findMany();
		res.json(users);
	} catch (error) {
		logger.error("Error fetching users:", error);
		res.status(500).json({ error: "Failed to fetch users" });
	}
};

// Create a new user
export const createUser = async (req, res) => {
	try {
		const { email, password, name, role } = req.body;

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
				role,
			},
		});

		res.status(201).json({
			message: "User created successfully",
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				role: user.role,
			},
		});
	} catch (error) {
		logger.error("Error creating user:", error);
		res.status(500).json({ error: "Failed to create user" });
	}
};

// Update an existing user
export const updateUser = async (req, res) => {
	try {
		const { id } = req.params;
		const { email, password, name, role } = req.body;

		// Hash password if provided
		let hashedPassword = null;
		if (password) {
			hashedPassword = await bcrypt.hash(password, 10);
		}

		// Update user in database
		const user = await prisma.user.update({
			where: { id: parseInt(id) },
			data: {
				email,
				...(hashedPassword ? { password: hashedPassword } : {}),
				name,
				role,
			},
		});

		res.json({
			message: "User updated successfully",
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				role: user.role,
			},
		});
	} catch (error) {
		logger.error("Error updating user:", error);
		res.status(500).json({ error: "Failed to update user" });
	}
};
// Delete an existing user
export const deleteUser = async (req, res) => {
	try {
		const { id } = req.params;

		// Delete user from database
		await prisma.user.delete({
			where: { id: parseInt(id) },
		});

		res.json({ message: "User deleted successfully" });
	} catch (error) {
		logger.error("Error deleting user:", error);
		res.status(500).json({ error: "Failed to delete user" });
	}
};

// 2FA Controllers
export const generate2FASecret = async (req, res) => {
    try {
        const secret = authenticator.generateSecret();
        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                tempTotpSecret: secret,
                totpExpiresAt: new Date(Date.now() + 300000)
            }
        });

        const otpauthUrl = authenticator.keyuri(user.email, 'Rifolks-Drifts', secret);

        res.json({
            success: true,
            secret,
            otpauthUrl,
            expiresAt: user.totpExpiresAt
        });
    } catch (error) {
        logger.error('2FA Secret Generation Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate 2FA setup',
            error: error.message
        });
    }
};

export const verify2FASetup = async (req, res) => {
    try {
        const { code } = req.body;
        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });

        if (!user?.tempTotpSecret) {
            return res.status(400).json({
                success: false,
                message: 'No pending 2FA setup'
            });
        }

        const isValid = authenticator.verify({
            secret: user.tempTotpSecret,
            encoding: 'base32',
            token: code
        });

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid verification code'
            });
        }

        await prisma.user.update({
            where: { id: req.user.id },
            data: {
                totpSecret: user.tempTotpSecret,
                totpEnabled: true,
                tempTotpSecret: null,
                totpExpiresAt: null
            }
        });

        res.json({
            success: true,
            message: '2FA setup completed successfully'
        });
    } catch (error) {
        logger.error('2FA Verification Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify 2FA setup',
            error: error.message
        });
    }
};

export const verify2FALogin = async (req, res) => {
    try {
        const { email, code } = req.body;
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user?.totpEnabled || !user.totpSecret) {
            return res.status(400).json({
                success: false,
                message: '2FA not enabled for this account'
            });
        }

        const isValid = authenticator.verify({
            secret: user.totpSecret,
            encoding: 'base32',
            token: code
        });

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid 2FA code'
            });
        }

        const token = jwt.sign(
            { userId: user.id, mfaVerified: true },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000
        });

        res.json({
            success: true,
            message: '2FA verification successful'
        });
    } catch (error) {
        logger.error('2FA Login Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify 2FA code',
            error: error.message
        });
    }
};
