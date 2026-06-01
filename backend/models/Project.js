/* ═══════════════════════════════════════════════════
   MODELS/PROJECT.JS — Mongoose Schema
   ═══════════════════════════════════════════════════ */

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  longDescription: {
    type: String,
    maxlength: [2000, 'Long description cannot exceed 2000 characters']
  },
  tags: {
    type: [String],
    required: true,
    validate: {
      validator: arr => arr.length > 0,
      message: 'At least one tag is required'
    }
  },
  category: {
    type: String,
    enum: ['fullstack', 'frontend', 'backend', 'mobile', 'other'],
    required: true,
    default: 'fullstack'
  },
  emoji: {
    type: String,
    default: '💻'
  },
  imageUrl: {
    type: String,
    default: null
  },
  liveUrl: {
    type: String,
    default: '#'
  },
  githubUrl: {
    type: String,
    default: '#'
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  stats: {
    stars:   { type: Number, default: 0 },
    forks:   { type: Number, default: 0 },
    views:   { type: Number, default: 0 }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Index for faster querying
projectSchema.index({ category: 1, featured: -1, order: 1 });

module.exports = mongoose.model('Project', projectSchema);