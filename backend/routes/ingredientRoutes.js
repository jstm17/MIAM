const express = require("express");
const router = express.Router();
const {
  GetAllIngredients,
  GetAllIngredientsVisibles,
  CreateIngredient,
  DeleteIngredient,
  ResetIngredientUrl,
  DeleteIngredients,
  ResetIngredientsUrl,
} = require("../controllers/ingredientController");
const { auth, authOptional } = require("../middlewares/authMiddleware");

router.get("/", GetAllIngredients);
router.get("/visibles", authOptional, GetAllIngredientsVisibles);
router.post("/", auth, CreateIngredient);
router.delete("/:id", auth, DeleteIngredient);
router.patch("/:id/reset-url", auth, ResetIngredientUrl);
router.delete("/", auth, DeleteIngredients);
router.patch("/reset-url", auth, ResetIngredientsUrl);

module.exports = router;
