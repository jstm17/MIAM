const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");
const { auth, authOptional } = require("../middlewares/authMiddleware");
const { upload } = require("../config/cloudinary");

router.get("/all", recipeController.GetAllRecipes);
router.get("/", auth, recipeController.GetAllRecipesByMe);
router.get("/visibles", authOptional, recipeController.GetAllRecipesVisibles);
router.get("/user/:id", recipeController.GetAllRecipesByUserId);
router.get("/slug/:slug", authOptional, recipeController.GetRecipeBySlug);
router.get(
  "/category/:slug",
  authOptional,
  recipeController.GetAllRecipesVisiblesByCategory,
);
router.get("/category/:slug", recipeController.GetAllRecipesByCategory);
router.get("/:id", recipeController.GetRecipeById);
router.post("/", auth, upload.single("image"), recipeController.CreateRecipe);
router.put(
  "/:slug",
  auth,
  upload.single("image"),
  recipeController.UpdateRecipe,
);
router.delete("/:id", auth, recipeController.DeleteRecipe);
router.patch("/:id/show", auth, recipeController.ShowRecipe);
router.patch("/:id/hide", auth, recipeController.HideRecipe);

module.exports = router;
