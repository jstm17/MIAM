const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const { auth } = require("../middlewares/authMiddleware");

router.post("/", auth, chatController.AskRecipe);

module.exports = router;
