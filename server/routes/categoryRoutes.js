import express from 'express';
import { db } from '../db.js';
import { requireAuth } from '../auth.js';

const router = express.Router();

// GET /api/categories - List all categories with article counts
router.get('/', (req, res) => {
  try {
    const categories = db.getCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/categories/:slug - Get single category details
router.get('/:slug', (req, res) => {
  try {
    const category = db.getCategoryBySlug(req.params.slug);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/categories - Create category (Admin)
router.post('/', requireAuth, (req, res) => {
  try {
    const { name, slug, color, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const newCategory = db.createCategory({ name, slug, color, description });
    res.status(201).json({ message: 'Category created successfully', category: newCategory });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/categories/:id - Update category (Admin)
router.put('/:id', requireAuth, (req, res) => {
  try {
    const updated = db.updateCategory(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category updated successfully', category: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/categories/:id - Delete category (Admin)
router.delete('/:id', requireAuth, (req, res) => {
  try {
    const deleted = db.deleteCategory(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
