const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  googleId: String,
  avatar: { 
    type: String, 
    default: "" 
  }
}, { timestamps: true }); 
module.exports = mongoose.model("User", userSchema);