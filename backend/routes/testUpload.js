const express = require("express");
const router = express.Router();
const { upload } = require("../config/cloudinary");

router.post("/test", upload.single("image"), (req, res) => {
  try {
    res.json({
      message: "Upload réussi 🎉",
      file: req.file,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
