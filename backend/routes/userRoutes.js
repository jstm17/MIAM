const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { auth, authOptional } = require("../middlewares/authMiddleware");
const { upload } = require("../config/cloudinary");

router.post("/register", userController.Register);
router.post("/login", userController.Login);
router.get("/top", userController.GetTopAllUsers);
router.get("/cooking-times-top", userController.GetTopAllUsersCookingTime);
router.get("/all", userController.GetAllUsers);
router.get("/visible", authOptional, userController.GetAllUsersVisibles);
router.get(
  "/cooking-time-visible",
  authOptional,
  userController.GetAllUsersVisiblesCookingTime,
);
router.get("/me", auth, userController.GetMe);
router.get("/:slug", userController.GetUserBySlug);
router.post("/saved-recipes/:recipeId", auth, userController.SaveRecipe);
router.delete("/saved-recipes/:recipeId", auth, userController.UnsaveRecipe);
router.post(
  "/saved-cooking-times/:cookingTimeId",
  auth,
  userController.SaveCookingTime,
);
router.delete(
  "/saved-cooking-times/:cookingTimeId",
  auth,
  userController.UnsaveCookingTime,
);
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
router.put(
  "/update",
  auth,
  upload.single("image"),
  userController.UpdateUserProfile,
);
router.put("/update-password", auth, userController.UpdatePassword);
router.put("/product", auth, userController.UpdateProductInCart);
router.post("/reset-password", userController.ResetPasswordWithToken);
router.post("/product", auth, userController.AddProductToCart);
router.delete("/product", auth, userController.RemoveProductFromCart);
router.patch("/product/reorder", auth, userController.ReorderProducts);
router.delete("/:id", auth, userController.DeleteUser);
router.delete("/", auth, userController.DeleteAccount);

module.exports = router;
