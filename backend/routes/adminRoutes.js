const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const adminController = require("../controllers/adminController");
const { auth } = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/adminMiddleware");

router.post(
  "/users/:id/reset-password",
  auth,
  isAdmin,
  userController.ResetPassword,
);
router.get("/all", auth, isAdmin, adminController.GetAllAdminUsers);
router.put("/update", auth, isAdmin, adminController.UpdateAdmins);

module.exports = router;
