const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// JWT helper
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// === Signup Route ===
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    const token = generateToken(user);
    res.json({ token, user });
  } catch (err) {
    console.error("❌ Signup Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// === Login Route ===
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = generateToken(user);
    res.json({ token, user });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// === Logout Route ===
router.post("/logout", (req, res) => {
  res.json({ msg: "Logged out" });
});

module.exports = router;
