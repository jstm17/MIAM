const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { auth } = require("../middlewares/authMiddleware");

router.post("/register", userController.Register);
router.post("/login", userController.Login);
router.get("/top", userController.GetTopAllUsers);
router.get("/all", userController.GetAllUsers);
router.get("/visible", auth, userController.GetAllUsersVisibles);
router.get("/me", auth, userController.GetMe);
router.get("/:slug", userController.GetUserBySlug);
router.post("/saved-recipes/:recipeId", auth, userController.SaveRecipe);
router.delete("/saved-recipes/:recipeId", auth, userController.UnsaveRecipe);
router.post(
  "/saved-ingredients/:recipeId",
  auth,
  userController.AddIngredientToCart,
);
router.delete(
  "/saved-ingredients/:recipeId/:ingredientId",
  auth,
  userController.RemoveIngredientFromCart,
);
router.delete("/saved-ingredients", auth, userController.ClearShoppingList);
router.put("/update-name", auth, userController.UpdateUserName);
router.delete("/", auth, userController.DeleteUser);

module.exports = router;
