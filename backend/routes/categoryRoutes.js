const express = require("express");
const router = express.Router();
const {
  GetAllCategories,
  GetAllCategoriesVisibles,
  GetAllCategoriesVisiblesCookingTimes,
  GetTopCategoriesVisibles,
  GetTopCategoriesVisiblesCookingTimes,
  CreateCategory,
  GetCategoryBySlug,
} = require("../controllers/categoryController");
const { auth, authOptional } = require("../middlewares/authMiddleware");

router.get("/", GetAllCategories);
router.get("/visibles", authOptional, GetAllCategoriesVisibles);
router.get(
  "/cooking-times-visibles",
  authOptional,
  GetAllCategoriesVisiblesCookingTimes,
);
router.get("/top", authOptional, GetTopCategoriesVisibles);
router.get(
  "/cooking-times-top",
  authOptional,
  GetTopCategoriesVisiblesCookingTimes,
);
router.get("/slug/:slug", GetCategoryBySlug);
router.post("/", auth, CreateCategory);

module.exports = router;
