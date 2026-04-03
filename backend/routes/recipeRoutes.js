const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");
const { auth } = require("../middlewares/authMiddleware");

router.get("/all", recipeController.GetAllRecipes);
router.get("/", auth, recipeController.GetAllRecipesByUser);
router.get("/:id", recipeController.GetRecipeById);
router.post("/", auth, recipeController.CreateRecipe);
router.put("/:id", auth, recipeController.UpdateRecipe);
router.delete("/:id", auth, recipeController.DeleteRecipe);

module.exports = router;
