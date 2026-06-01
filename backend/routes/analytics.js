/* ═══════════════════════════════════════════════════
   ROUTES/ANALYTICS.JS — Simple page view tracking
   ═══════════════════════════════════════════════════ */

const express  = require('express');
const router   = express.Router();
const mongoose = require('mongoose');

// Inline lightweight schema
const pageViewSchema = new mongoose.Schema({
  path:      { type: String, required: true },
  userAgent: String,
  referrer:  String,
  timestamp: { type: Date, default: Date.now }
});
const PageView = mongoose.models.PageView || mongoose.model('PageView', pageViewSchema);

/* ── POST /api/analytics/pageview ───────────────── */
router.post('/pageview', async (req, res) => {
  try {
    await PageView.create({
      path:      req.body.path || '/',
      userAgent: req.headers['user-agent'],
      referrer:  req.headers['referer'] || req.body.referrer
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── GET /api/analytics/summary ─ Admin ─────────── */
router.get('/summary', async (req, res) => {
  const token = req.headers['x-admin-token'];
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const total = await PageView.countDocuments();
    const today = await PageView.countDocuments({
      timestamp: { $gte: new Date(new Date().setHours(0,0,0,0)) }
    });
    const byPath = await PageView.aggregate([
      { $group: { _id: '$path', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    res.json({ total, today, topPages: byPath });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;