/* ═══════════════════════════════════════════════════
   MODELS/CONTACT.JS — Mongoose Schema
   ═══════════════════════════════════════════════════ */

const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email address']
  },
  subject: {
    type: String,
    trim: true,
    maxlength: 200,
    default: 'Portfolio Enquiry'
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    minlength: [10, 'Message must be at least 10 characters'],
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'replied', 'archived'],
    default: 'unread'
  },
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);