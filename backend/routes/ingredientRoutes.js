const express = require("express");
const router = express.Router();
const {
  GetAllIngredients,
  CreateIngredient,
} = require("../controllers/ingredientController");
const { auth } = require("../middlewares/authMiddleware");

router.get("/", auth, GetAllIngredients);
router.post("/", auth, CreateIngredient);

module.exports = router;
