/* ═══════════════════════════════════════════════════
   ROUTES/PROJECTS.JS — CRUD API for Projects
   ═══════════════════════════════════════════════════ */

const express = require('express');
const { body, query, validationResult } = require('express-validator');
const router  = express.Router();
const Project = require('../models/Project');

// Simple admin guard middleware
const adminAuth = (req, res, next) => {
  const token = req.headers['x-admin-token'];
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

/* ── GET /api/projects ──────────────────────────── */
// Public — list all projects (with optional filters)
router.get('/', [
  query('category').optional().isIn(['all','fullstack','frontend','backend','mobile','other']),
  query('featured').optional().isBoolean(),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const filter = {};
    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category;
    }
    if (req.query.featured !== undefined) {
      filter.featured = req.query.featured === 'true';
    }

    const limit = parseInt(req.query.limit) || 20;

    const projects = await Project
      .find(filter)
      .sort({ featured: -1, order: 1, createdAt: -1 })
      .limit(limit)
      .lean();

    res.json({ projects, total: projects.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

/* ── GET /api/projects/:id ──────────────────────── */
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // Increment view count
    project.stats.views += 1;
    await project.save();

    res.json(project);
  } catch (err) {
    res.status(err.name === 'CastError' ? 400 : 500).json({ error: 'Invalid project ID' });
  }
});

/* ── POST /api/projects ─────────────────────────── */
// Admin only
router.post('/', adminAuth, [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 100 }),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('tags').isArray({ min: 1 }).withMessage('At least one tag required'),
  body('category').isIn(['fullstack','frontend','backend','mobile','other'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const project = await Project.create(req.body);
    res.status(201).json({ message: 'Project created', project });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ── PUT /api/projects/:id ──────────────────────── */
// Admin only
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project updated', project });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ── DELETE /api/projects/:id ───────────────────── */
// Admin only
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;