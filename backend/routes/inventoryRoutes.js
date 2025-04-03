import express from "express";
import {
	getInventory,
	updateInventory,
} from "../controllers/inventoryController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getInventory);
router.put("/:productId", auth, updateInventory);

export default router;
