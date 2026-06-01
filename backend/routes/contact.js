/* ═══════════════════════════════════════════════════
   ROUTES/CONTACT.JS — Contact form submission
   ═══════════════════════════════════════════════════ */

const express   = require('express');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const router    = express.Router();
const Contact   = require('../models/Contact');

/* ── Email Transporter (configure in .env) ──────── */
const createTransporter = () => {
  if (!process.env.EMAIL_HOST) return null;
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

/* ── POST /api/contact ──────────────────────────── */
router.post('/', [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }),
  body('email')
    .trim()
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 2000 }).withMessage('Message must be 10-2000 characters')
], async (req, res) => {
  try {
    // Validate
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, subject, message } = req.body;

    // Save to database
    const contact = await Contact.create({
      name, email, subject, message,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    // Send email notification (if configured)
    const transporter = createTransporter();
    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
          to: process.env.OWNER_EMAIL || process.env.EMAIL_USER,
          replyTo: email,
          subject: `[Portfolio] ${subject || 'New Contact Message'} from ${name}`,
          html: `
            <div style="font-family:sans-serif;max-width:600px">
              <h2 style="color:#f5d060">New Portfolio Message</h2>
              <p><strong>From:</strong> ${name} (${email})</p>
              <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
              <hr/>
              <p style="white-space:pre-wrap">${message}</p>
              <hr/>
              <small style="color:#888">Received: ${new Date().toLocaleString()}</small>
            </div>
          `
        });

        // Send auto-reply to sender
        await transporter.sendMail({
          from: `"Alex Rivera" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: `Thanks for reaching out, ${name}!`,
          html: `
            <div style="font-family:sans-serif;max-width:600px">
              <h2>Thanks for your message, ${name}!</h2>
              <p>I've received your message and will get back to you within 24 hours.</p>
              <p>In the meantime, feel free to check out my latest work on GitHub.</p>
              <br/>
              <p>Best,<br/>Alex Rivera</p>
            </div>
          `
        });
      } catch (emailErr) {
        console.error('Email send failed (non-critical):', emailErr.message);
      }
    }

    res.status(201).json({
      message: 'Message received! I\'ll be in touch soon.',
      id: contact._id
    });

  } catch (err) {
    console.error('Contact submission error:', err);
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

/* ── GET /api/contact ─ Admin: list messages ────── */
router.get('/', (req, res, next) => {
  const token = req.headers['x-admin-token'];
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}, async (req, res) => {
  try {
    const messages = await Contact
      .find()
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ messages, total: messages.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;