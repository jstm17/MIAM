const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { auth } = require("../middlewares/authMiddleware");

router.post("/register", userController.Register);
router.post("/login", userController.Login);
router.get("/me", auth, userController.GetMe);
router.post("/saved-recipes/:recipeId", auth, userController.SaveRecipe);
router.delete("/saved-recipes/:recipeId", auth, userController.UnsaveRecipe);
router.put("/update-name", auth, userController.UpdateUserName);
router.delete("/", auth, userController.DeleteUser);

module.exports = router;
