const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");
const { auth } = require("../middlewares/authMiddleware");
const { upload } = require("../config/cloudinary");

router.get("/all", recipeController.GetAllRecipes);
router.get("/", auth, recipeController.GetAllRecipesByMe);
router.get("/user/:id", recipeController.GetAllRecipesByUserId);
router.get("/slug/:slug", recipeController.GetRecipeBySlug);
router.get("/category/:slug", recipeController.GetRecipeByCategory);
router.get("/:id", recipeController.GetRecipeById);
router.post("/", auth, upload.single("image"), recipeController.CreateRecipe);
router.put("/:id", auth, upload.single("image"), recipeController.UpdateRecipe);
router.delete("/:id", auth, recipeController.DeleteRecipe);
router.patch("/:id/show", auth, recipeController.ShowRecipe);
router.patch("/:id/hide", auth, recipeController.HideRecipe);

module.exports = router;
