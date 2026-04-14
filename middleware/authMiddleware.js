const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticate = async (req, res, next) => {
  console.log("--- 🕵️‍♂️ AUTH MIDDLEWARE HIT ---");
  console.log("1. Authorization Header:", req.headers.authorization);

  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    console.log("❌ FAIL: No token found after splitting header");
    return res.status(401).json({ msg: "No token provided" });
  }

  try {
    // Check if secret exists
    if (!process.env.JWT_SECRET) {
      console.log("⚠️ WARNING: process.env.JWT_SECRET is undefined!");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("2. ✅ Token Decoded Successfully. User ID:", decoded.id);

    const user = await User.findById(decoded.id);
    
    if (!user) {
      console.log("❌ FAIL: Token is valid, but User ID not found in Database!");
      return res.status(401).json({ msg: "Invalid token: User not found" });
    }

    console.log("3. ✅ User authenticated:", user.email);
    req.user = user; 
    next();

  } catch (err) {
    console.log("❌ FAIL: JWT Verify threw an error:", err.message);
    return res.status(401).json({ msg: `Unauthorized: ${err.message}` });
  }
};

module.exports = authenticate;
