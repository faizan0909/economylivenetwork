import express from 'express';
import { db } from '../db.js';
import { requireAuth } from '../auth.js';

const router = express.Router();

// GET /api/articles - List articles with filters
router.get('/', (req, res) => {
  try {
    const {
      category,
      status,
      search,
      page = 1,
      limit = 20,
      isFeatured,
      isBreaking,
      sort = 'publishedAt'
    } = req.query;

    const result = db.getArticles({
      category,
      status,
      search,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      isFeatured,
      isBreaking,
      sort
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/articles/:slugOrId - Get single article and increment views
router.get('/:slugOrId', (req, res) => {
  try {
    const { slugOrId } = req.params;
    let article = db.getArticleBySlug(slugOrId);
    if (!article) {
      article = db.getArticleById(slugOrId);
    }

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Increment views only if published
    if (article.status === 'published') {
      db.incrementViews(article.id);
      article.views = (article.views || 0) + 1;
    }

    // Fetch related articles from same category
    const related = db.getArticles({
      category: article.category,
      status: 'published',
      limit: 4
    }).items.filter(a => a.id !== article.id).slice(0, 3);

    res.json({ article, related });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/articles - Create article (Admin)
router.post('/', requireAuth, (req, res) => {
  try {
    const {
      title,
      slug,
      category,
      categoryName,
      excerpt,
      content,
      featuredImage,
      imageCaption,
      author,
      source,
      sourceUrl,
      isBreaking,
      isFeatured,
      status
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Article title is required' });
    }

    const newArticle = db.createArticle({
      title,
      slug,
      category,
      categoryName,
      excerpt,
      content,
      featuredImage,
      imageCaption,
      author: author || req.user.name || 'Editorial Desk',
      source,
      sourceUrl,
      isBreaking,
      isFeatured,
      status: status || 'published'
    });

    res.status(201).json({ message: 'Article created successfully', article: newArticle });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/articles/:id - Update article (Admin)
router.put('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.getArticleById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const updated = db.updateArticle(id, req.body);
    res.json({ message: 'Article updated successfully', article: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/articles/:id - Delete article (Admin)
router.delete('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteArticle(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json({ message: 'Article deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
