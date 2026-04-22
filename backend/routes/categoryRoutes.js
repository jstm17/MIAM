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
  DeleteCategory,
  ResetCategoryUrl,
  UpdateCategoryUrl,
  DeleteCategories,
  ResetCategoriesUrl,
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

router.delete("/:id", auth, DeleteCategory);
router.patch("/:id/reset-url", auth, ResetCategoryUrl);
router.patch("/:id/url", auth, UpdateCategoryUrl);
router.delete("/", auth, DeleteCategories);
router.patch("/reset-url", auth, ResetCategoriesUrl);

module.exports = router;
