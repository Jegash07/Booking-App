const mongoose = require('mongoose');

// User schema for storing basic info and role
const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Full Name
  email: { type: String, required: true, unique: true }, // User Email
  password: { type: String, required: true }, // Hashed Password
  role: { type: String, enum: ['user', 'admin'], default: 'user' } // Role for Role-Based Access Control
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
