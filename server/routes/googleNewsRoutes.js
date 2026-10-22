import express from 'express';
import { googleNewsService } from '../googleNewsService.js';
import { requireAuth } from '../auth.js';

const router = express.Router();

// GET /api/google-news/fetch - Fetch live feeds from Google News
router.get('/fetch', async (req, res) => {
  try {
    const { topic = '', query = '', country = 'IN', lang = 'en-IN' } = req.query;
    const data = await googleNewsService.fetchNews({ topic, query, country, lang });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/google-news/import - Import a single Google News item to DB (Admin)
router.post('/import', requireAuth, (req, res) => {
  try {
    const { item, targetCategory, status = 'published' } = req.body;
    if (!item || !item.title) {
      return res.status(400).json({ error: 'Item data with title is required' });
    }

    const article = googleNewsService.importItem(item, targetCategory, status);
    res.status(201).json({ message: 'Article imported successfully', article });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/google-news/import-batch - Import multiple Google News items (Admin)
router.post('/import-batch', requireAuth, (req, res) => {
  try {
    const { items, targetCategory, status = 'published' } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'An array of items is required' });
    }

    const imported = googleNewsService.importBatch(items, targetCategory, status);
    res.status(201).json({
      message: `Successfully imported ${imported.length} articles`,
      count: imported.length,
      articles: imported
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
