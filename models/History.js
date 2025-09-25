// models/History.js
const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userMessage: String,
  botReply: String,
  type: {
    type: String,
    default: "text", // or "image"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("History", historySchema);
