const express = require("express");
const router = express.Router();
const {
	getCategories,
	getCategoryById,
	createCategory,
	updateCategory,
	deleteCategory,
	getCategoriesByGender,
} = require("../controllers/categoryController");
const { protect, admin } = require("../middleware/auth");

router.get("/", getCategories);
router.get("/gender/:gender", getCategoriesByGender);
router.get("/:id", getCategoryById);

// Admin routes
router.post("/", protect, admin, createCategory);
router.put("/:id", protect, admin, updateCategory);
router.delete("/:id", protect, admin, deleteCategory);

module.exports = router;
