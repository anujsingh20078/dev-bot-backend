// routes/save.js
const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const History = require("../models/History");

router.post("/", authenticate, async (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ success: false, error: "No messages to save" });
  }

  try {
    const docs = messages.map((msg) => ({
      userId: req.user._id,
      userMessage: msg.role === "user" ? msg.text : null,
      botReply: msg.role === "assistant" ? msg.text : null,
      image: typeof msg.image === "string" ? msg.image : null,
      type: msg.image ? "image" : "text",
    }));

    await History.insertMany(docs);

    res.json({ success: true });
  } catch (err) {
    console.error("Error saving chat:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

module.exports = router;
