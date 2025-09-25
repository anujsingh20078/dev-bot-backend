const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const History = require("../models/History");

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-pro";

router.post("/", authenticate, async (req, res) => {
  const { prompt } = req.body;

  try {
    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    };

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_KEY,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("\n")?.trim() ||
      "⚠️ No response from Gemini";

    // ✅ Save user-specific history
    await History.create({
      userId: req.user._id,
      userMessage: prompt,
      botReply: reply,
      type: "text",
    });

    res.json({ reply });
  } catch (err) {
    console.error("Chat route error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
