const express = require("express");
const router = express.Router();
const {
  GetAllCategories,
  CreateCategory,
  GetCategoryBySlug,
} = require("../controllers/categoryController");
const { auth } = require("../middlewares/authMiddleware");

router.get("/", GetAllCategories);
router.get("/slug/:slug", GetCategoryBySlug);
router.post("/", auth, CreateCategory);

module.exports = router;
