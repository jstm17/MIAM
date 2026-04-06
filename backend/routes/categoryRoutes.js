const express = require("express");
const router = express.Router();
const {
  GetAllCategories,
  CreateCategory,
} = require("../controllers/categoryController");
const { auth } = require("../middlewares/authMiddleware");

router.get("/", auth, GetAllCategories);
router.post("/", auth, CreateCategory);

module.exports = router;
