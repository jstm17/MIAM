const express = require("express");
const router = express.Router();
const {
  GetAllCategories,
  GetAllCategoriesVisibles,
  CreateCategory,
  GetCategoryBySlug,
} = require("../controllers/categoryController");
const { auth, authOptional } = require("../middlewares/authMiddleware");

router.get("/", GetAllCategories);
router.get("/visibles", authOptional, GetAllCategoriesVisibles);
router.get("/slug/:slug", GetCategoryBySlug);
router.post("/", auth, CreateCategory);

module.exports = router;
