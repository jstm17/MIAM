const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");
const { auth } = require("../middlewares/authMiddleware");
const { upload } = require("../config/cloudinary");

router.get("/all", recipeController.GetAllRecipes);
router.get("/", auth, recipeController.GetAllRecipesByUser);
router.get("/:id", recipeController.GetRecipeById);
router.post("/", auth, upload.single("image"), recipeController.CreateRecipe);
router.put("/:id", auth, upload.single("image"), recipeController.UpdateRecipe);
router.delete("/:id", auth, recipeController.DeleteRecipe);

module.exports = router;
