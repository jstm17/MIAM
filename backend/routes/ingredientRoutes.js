const express = require("express");
const router = express.Router();
const {
  GetAllIngredients,
  GetAllIngredientsVisibles,
  CreateIngredient,
} = require("../controllers/ingredientController");
const { auth, authOptional } = require("../middlewares/authMiddleware");

router.get("/", GetAllIngredients);
router.get("/visibles", authOptional, GetAllIngredientsVisibles);
router.post("/", auth, CreateIngredient);

module.exports = router;
