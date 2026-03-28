const mongoose = require("mongoose");

// 1. Message Schema (Same as before)
const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    enum: ["user", "model"], 
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String, 
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// 2. Conversation Schema (Updated with isPinned)
const conversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true, 
  },
  title: {
    type: String,
    default: "New Chat", 
  },
  
  // 👇 NEW: Pin Feature ke liye field
  isPinned: {
    type: Boolean,
    default: false, // By default chat pinned nahi hogi
  },

  messages: [messageSchema], 
  
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Auto-update 'lastUpdated' on save
conversationSchema.pre("save", function (next) {
  this.lastUpdated = Date.now();
  next();
});

module.exports = mongoose.model("Conversation", conversationSchema);