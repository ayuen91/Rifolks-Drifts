import express from "express";
import {
	getUsers,
	createUser,
	updateUser,
	deleteUser,
} from "../controllers/userController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getUsers);
router.post("/", auth, createUser);
router.put("/:id", auth, updateUser);
router.delete("/:id", auth, deleteUser);

export default router;
