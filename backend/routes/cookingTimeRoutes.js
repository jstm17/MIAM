const express = require("express");
const router = express.Router();
const cookingTimeController = require("../controllers/cookingTimeController");
const { auth, authOptional } = require("../middlewares/authMiddleware");
const { upload } = require("../config/cloudinary");

router.get("/all", cookingTimeController.GetAllCookingTimes);
router.get("/", auth, cookingTimeController.GetAllCookingTimesByMe);
router.get(
  "/visibles",
  authOptional,
  cookingTimeController.GetAllCookingTimesVisibles,
);
router.get("/user/:id", cookingTimeController.GetAllCookingTimesByUserId);
router.get(
  "/slug/:slug",
  authOptional,
  cookingTimeController.GetCookingTimeBySlug,
);
router.get(
  "/category/:slug",
  authOptional,
  cookingTimeController.GetAllCookingTimesVisiblesByCategory,
);
router.get(
  "/category/:slug",
  cookingTimeController.GetAllCookingTimesByCategory,
);
router.get("/:id", cookingTimeController.GetCookingTimeById);
router.post(
  "/",
  auth,
  upload.single("image"),
  cookingTimeController.CreateCookingTime,
);
router.put(
  "/:slug",
  auth,
  upload.single("image"),
  cookingTimeController.UpdateCookingTime,
);
router.delete("/", auth, cookingTimeController.DeleteCookingTimes);
router.delete("/:id", auth, cookingTimeController.DeleteCookingTime);
router.patch("/:id/show", auth, cookingTimeController.ShowCookingTime);
router.patch("/:id/hide", auth, cookingTimeController.HideCookingTime);

module.exports = router;
