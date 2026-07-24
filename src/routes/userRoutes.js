const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");

router.get("/me", protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

router.get("/stream-key", protect, (req, res) => {
  res.json({ success: true, streamKey: req.user.streamKey });
});

module.exports = router;
