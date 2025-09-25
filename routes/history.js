const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const History = require("../models/History");

// routes/history.js
router.get("/", authenticate, async (req, res) => {
  try {
    const history = await History.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    console.error("History error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
