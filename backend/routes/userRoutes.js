const express = require("express");
const router = express.Router();
const usersController = require("../controllers/userController");
const { auth } = require("../middlewares/authMiddleware");

router.post("/register", usersController.Register);
router.post("/login", usersController.Login);
router.get("/me", auth, usersController.GetMe);

module.exports = router;
