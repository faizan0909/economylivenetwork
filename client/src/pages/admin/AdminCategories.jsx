import React, { useEffect, useState } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api/client';
import {
  FolderTree,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Tag
} from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCat, setEditingCat] = useState(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#c79a2b');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await getCategories();
      setCategories(res || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleNameChange = (val) => {
    setName(val);
    if (!editingCat) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const handleStartEdit = (cat) => {
    setEditingCat(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setColor(cat.color || '#c79a2b');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingCat(null);
    setName('');
    setSlug('');
    setDescription('');
    setColor('#c79a2b');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    setError('');
    setMessage('');
    try {
      if (editingCat) {
        await updateCategory(editingCat.id, { name, slug, description, color });
        setMessage(`Category "${name}" updated successfully!`);
      } else {
        await createCategory({ name, slug, description, color });
        setMessage(`Category "${name}" created successfully!`);
      }
      handleCancelEdit();
      await loadCategories();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, catName) => {
    if (!window.confirm(`Are you sure you want to delete category "${catName}"?`)) return;
    try {
      await deleteCategory(id);
      setMessage(`Category "${catName}" deleted!`);
      setCategories(prev => prev.filter(c => c.id !== id));
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[#30281b]">
        <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
          Category Desks Management
        </h1>
        <p className="text-xs text-[#a89679] mt-1">
          Organize and classify dispatches across Crime, Politics, Technology, and Custom beats.
        </p>
      </div>

      {message && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 rounded text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column (Spans 5 cols) */}
        <div className="lg:col-span-5 bg-[#211b14] border border-[#30281b] p-6 rounded-xl h-fit">
          <h2 className="font-cinzel text-base font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#c79a2b]" />
            <span>{editingCat ? `Edit Desk: ${editingCat.name}` : 'Add New Category Desk'}</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-bold text-[#c5b59a] mb-1">
                Desk Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Crime, Artificial Intelligence..."
                className="w-full px-3 py-2 bg-[#18140f] border border-[#3d3222] rounded text-xs text-white focus:outline-none focus:border-[#c79a2b]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-[#8e7d61] mb-1">
                URL Slug
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. crime, ai-tech"
                className="w-full px-3 py-2 bg-[#18140f] border border-[#3d3222] rounded text-xs text-[#a89679] font-mono focus:outline-none focus:border-[#c79a2b]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-[#c5b59a] mb-1">
                Badge Theme Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-8 rounded bg-transparent cursor-pointer border border-[#3d3222]"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-28 px-3 py-1.5 bg-[#18140f] border border-[#3d3222] rounded text-xs font-mono text-white focus:outline-none focus:border-[#c79a2b]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-[#c5b59a] mb-1">
                Desk Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Scope of reporting covered under this desk..."
                className="w-full px-3 py-2 bg-[#18140f] border border-[#3d3222] rounded text-xs text-white focus:outline-none focus:border-[#c79a2b]"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 bg-[#c79a2b] hover:bg-[#b08722] disabled:opacity-50 text-[#13100c] rounded text-xs font-bold uppercase tracking-wider transition-colors shadow flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                <span>{editingCat ? 'Save Changes' : 'Create Category'}</span>
              </button>

              {editingCat && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2.5 text-xs text-[#8e7d61] hover:text-white uppercase font-semibold"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Categories List Table (Spans 7 cols) */}
        <div className="lg:col-span-7 bg-[#211b14] border border-[#30281b] rounded-xl p-6">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#30281b]">
            <h2 className="font-cinzel text-base font-bold text-white uppercase tracking-wider">
              Configured Category Desks ({categories.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-[#c79a2b] flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Loading categories...</span>
            </div>
          ) : (
            <div className="divide-y divide-[#2d251a]">
              {categories.map((cat) => (
                <div key={cat.id || cat.slug} className="py-3.5 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color || '#c79a2b' }}
                      />
                      <span className="font-bold text-white text-sm">
                        {cat.name}
                      </span>
                      <span className="text-[10px] font-mono text-[#8e7d61] bg-[#18140f] px-1.5 py-0.5 rounded border border-[#30281b]">
                        /{cat.slug}
                      </span>
                    </div>

                    {cat.description && (
                      <p className="text-xs text-[#8e7d61] line-clamp-1 max-w-md">
                        {cat.description}
                      </p>
                    )}

                    <div className="text-[11px] text-[#c79a2b] mt-1 font-semibold">
                      {cat.articleCount !== undefined ? `${cat.articleCount} published articles` : ''}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleStartEdit(cat)}
                      className="p-1.5 text-[#8e7d61] hover:text-[#c79a2b] transition-colors"
                      title="Edit Category"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id || cat.slug, cat.name)}
                      className="p-1.5 text-[#8e7d61] hover:text-red-400 transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
