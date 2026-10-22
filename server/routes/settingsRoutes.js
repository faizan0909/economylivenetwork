import express from 'express';
import { db } from '../db.js';
import { requireAuth } from '../auth.js';

const router = express.Router();

// GET /api/settings - Get public settings
router.get('/settings', (req, res) => {
  try {
    const settings = db.getSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/settings - Update site settings (Admin)
router.put('/settings', requireAuth, (req, res) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json({ message: 'Settings updated successfully', settings: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/stats - Dashboard analytics (Admin)
router.get('/stats', requireAuth, (req, res) => {
  try {
    const stats = db.getStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
