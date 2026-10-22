import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getArticle, createArticle, updateArticle, getCategories } from '../../api/client';
import {
  Save,
  ArrowLeft,
  Image as ImageIcon,
  Flame,
  Sparkles,
  Eye,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Quote,
  List,
  ExternalLink
} from 'lucide-react';

const PRESET_IMAGES = {
  crime: [
    { label: 'Supreme Court & Gavel', url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Cyber Crime & Security', url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Police & Investigation', url: 'https://images.unsplash.com/photo-1575517111478-7f6afd0973db?auto=format&fit=crop&w=1200&q=80' }
  ],
  politics: [
    { label: 'Parliament Assembly', url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Elections & Ballot', url: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Press Conference', url: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=1200&q=80' }
  ],
  technology: [
    { label: 'Quantum & Microchip', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80' },
    { label: 'AI & Neural Networks', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Code & Software', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80' }
  ],
  business: [
    { label: 'Stock Market Bull', url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Financial Trading Terminal', url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80' }
  ],
  healthcare: [
    { label: 'Medical Diagnostic ICU', url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Biotech Lab Research', url: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&q=80' }
  ]
};

export default function AdminArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'politics',
    excerpt: '',
    content: '<p>Write your detailed news report here...</p>',
    featuredImage: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
    imageCaption: '',
    author: 'Editorial Desk',
    source: 'EconomyLive Network',
    sourceUrl: '',
    isBreaking: false,
    isFeatured: false,
    status: 'published'
  });

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);

    if (isEditing) {
      getArticle(id)
        .then(res => {
          if (res.article) {
            setFormData({
              title: res.article.title || '',
              slug: res.article.slug || '',
              category: res.article.category || 'politics',
              excerpt: res.article.excerpt || '',
              content: res.article.content || '',
              featuredImage: res.article.featuredImage || '',
              imageCaption: res.article.imageCaption || '',
              author: res.article.author || 'Editorial Desk',
              source: res.article.source || '',
              sourceUrl: res.article.sourceUrl || '',
              isBreaking: Boolean(res.article.isBreaking),
              isFeatured: Boolean(res.article.isFeatured),
              status: res.article.status || 'published'
            });
          }
        })
        .catch(err => setErrorMessage(err.message))
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleTitleChange = (val) => {
    setFormData(prev => ({
      ...prev,
      title: val,
      // Auto generate slug if creating or if slug was empty
      slug: !isEditing ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : prev.slug
    }));
  };

  const insertTag = (openTag, closeTag = '') => {
    const textarea = document.getElementById('article-content-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end) || 'Sample text';
    const replacement = `${openTag}${selected}${closeTag}`;

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setFormData(prev => ({ ...prev, content: newContent }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + openTag.length, start + openTag.length + selected.length);
    }, 10);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMessage('Article headline title is required');
      return;
    }

    setSaving(true);
    setErrorMessage('');
    try {
      if (isEditing) {
        await updateArticle(id, formData);
        setSuccessMessage('Article updated successfully!');
      } else {
        const created = await createArticle(formData);
        setSuccessMessage('Article published successfully!');
        setTimeout(() => navigate('/admin/articles'), 1500);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-[#c79a2b] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Loading article...</span>
      </div>
    );
  }

  const categoryPresets = PRESET_IMAGES[formData.category] || PRESET_IMAGES.politics;

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#30281b]">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/articles"
            className="p-2 rounded bg-[#211b14] border border-[#30281b] text-[#a89679] hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
              {isEditing ? 'Edit Editorial Article' : 'Compose New Article'}
            </h1>
            <p className="text-xs text-[#8e7d61]">
              Publish investigative reporting and categorized dispatches.
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#c79a2b] hover:bg-[#b08722] disabled:opacity-50 text-[#13100c] rounded text-xs font-bold uppercase tracking-wider transition-colors shadow"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : 'Save & Publish'}</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 rounded text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Grid */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title & Slug */}
        <div className="p-5 bg-[#211b14] border border-[#30281b] rounded-xl space-y-4">
          <div>
            <label className="block text-xs uppercase font-bold text-[#c5b59a] mb-1.5">
              Headline Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Supreme Court Delivers Major Ruling on Cyber Forensics..."
              className="w-full px-4 py-2.5 bg-[#18140f] border border-[#3d3222] rounded text-white text-base font-serif-headline focus:outline-none focus:border-[#c79a2b]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase font-bold text-[#8e7d61] mb-1">
                URL Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="supreme-court-delivers-major-ruling"
                className="w-full px-3 py-2 bg-[#18140f] border border-[#3d3222] rounded text-xs text-[#a89679] font-mono focus:outline-none focus:border-[#c79a2b]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-[#c5b59a] mb-1">
                Category Desk *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-[#18140f] border border-[#3d3222] rounded text-xs text-white focus:outline-none focus:border-[#c79a2b]"
              >
                {categories.map((cat) => (
                  <option key={cat.id || cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Excerpt */}
        <div className="p-5 bg-[#211b14] border border-[#30281b] rounded-xl">
          <label className="block text-xs uppercase font-bold text-[#c5b59a] mb-1.5">
            Excerpt / Standfirst
          </label>
          <textarea
            rows={3}
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            placeholder="A short compelling 1-2 sentence lead summary appearing on cards and below the headline..."
            className="w-full px-3 py-2 bg-[#18140f] border border-[#3d3222] rounded text-xs sm:text-sm text-white focus:outline-none focus:border-[#c79a2b] leading-relaxed"
          />
        </div>

        {/* Featured Image & Presets */}
        <div className="p-5 bg-[#211b14] border border-[#30281b] rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs uppercase font-bold text-[#c5b59a]">
              Featured Cover Image
            </label>
            <span className="text-[11px] text-[#8e7d61]">
              Enter image URL or select from category presets below
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="w-full sm:w-1/3 aspect-[16/10] rounded overflow-hidden bg-[#18140f] border border-[#30281b] shrink-0">
              {formData.featuredImage ? (
                <img
                  src={formData.featuredImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#5c4f3a]">
                  <ImageIcon className="w-8 h-8" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3 w-full">
              <input
                type="text"
                value={formData.featuredImage}
                onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 bg-[#18140f] border border-[#3d3222] rounded text-xs text-white focus:outline-none focus:border-[#c79a2b]"
              />

              <input
                type="text"
                value={formData.imageCaption}
                onChange={(e) => setFormData({ ...formData, imageCaption: e.target.value })}
                placeholder="Image caption / Photo credit (e.g. Photo: EconomyLive Media / Reuters)"
                className="w-full px-3 py-2 bg-[#18140f] border border-[#3d3222] rounded text-xs text-[#a89679] focus:outline-none focus:border-[#c79a2b]"
              />

              {/* Quick Image Presets */}
              <div className="pt-2">
                <span className="text-[11px] text-[#8e7d61] block mb-1.5">
                  Quick High-Res Presets for {formData.category.toUpperCase()}:
                </span>
                <div className="flex flex-wrap gap-2">
                  {categoryPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, featuredImage: preset.url, imageCaption: preset.label })}
                      className="px-2.5 py-1 text-[11px] rounded bg-[#18140f] border border-[#3d3222] hover:border-[#c79a2b] text-[#c5b59a] hover:text-[#c79a2b] transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body Editor */}
        <div className="p-5 bg-[#211b14] border border-[#30281b] rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs uppercase font-bold text-[#c5b59a]">
              Article Body Content (HTML / Rich Format)
            </label>
            <span className="text-[11px] text-[#8e7d61]">
              Supports H2, H3, quotes, paragraphs, and lists
            </span>
          </div>

          {/* Quick Formatting Toolbar */}
          <div className="flex flex-wrap items-center gap-1.5 p-2 bg-[#18140f] border border-[#30281b] rounded text-xs">
            <button
              type="button"
              onClick={() => insertTag('<h2>', '</h2>')}
              className="p-1.5 hover:bg-[#282117] text-[#c5b59a] hover:text-white rounded flex items-center gap-1"
              title="Add Section Heading (H2)"
            >
              <Heading2 className="w-3.5 h-3.5" />
              <span>H2</span>
            </button>
            <button
              type="button"
              onClick={() => insertTag('<h3>', '</h3>')}
              className="p-1.5 hover:bg-[#282117] text-[#c5b59a] hover:text-white rounded flex items-center gap-1"
              title="Add Subheading (H3)"
            >
              <Heading3 className="w-3.5 h-3.5" />
              <span>H3</span>
            </button>
            <span className="text-[#3d3222]">|</span>
            <button
              type="button"
              onClick={() => insertTag('<strong>', '</strong>')}
              className="p-1.5 hover:bg-[#282117] text-[#c5b59a] hover:text-white rounded"
              title="Bold"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertTag('<em>', '</em>')}
              className="p-1.5 hover:bg-[#282117] text-[#c5b59a] hover:text-white rounded"
              title="Italic"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertTag('<blockquote>', '</blockquote>')}
              className="p-1.5 hover:bg-[#282117] text-[#c5b59a] hover:text-white rounded"
              title="Blockquote"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertTag('<ul>\n  <li>', '</li>\n  <li>Item 2</li>\n</ul>')}
              className="p-1.5 hover:bg-[#282117] text-[#c5b59a] hover:text-white rounded"
              title="Bullet List"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertTag('<p>', '</p>')}
              className="p-1.5 hover:bg-[#282117] text-[#c5b59a] hover:text-white rounded"
              title="Paragraph"
            >
              &para; Paragraph
            </button>
          </div>

          <textarea
            id="article-content-textarea"
            rows={14}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-4 py-3 bg-[#18140f] border border-[#3d3222] rounded text-xs sm:text-sm text-white font-mono leading-relaxed focus:outline-none focus:border-[#c79a2b]"
          />
        </div>

        {/* Flags & Metadata */}
        <div className="p-5 bg-[#211b14] border border-[#30281b] rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs uppercase font-bold text-[#c5b59a] mb-1.5">
              Byline / Author
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-3 py-2 bg-[#18140f] border border-[#3d3222] rounded text-xs text-white focus:outline-none focus:border-[#c79a2b]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-[#c5b59a] mb-1.5">
              Source Attribution
            </label>
            <input
              type="text"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              placeholder="e.g. EconomyLive Network / Reuters"
              className="w-full px-3 py-2 bg-[#18140f] border border-[#3d3222] rounded text-xs text-white focus:outline-none focus:border-[#c79a2b]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-[#c5b59a] mb-1.5">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 bg-[#18140f] border border-[#3d3222] rounded text-xs text-white focus:outline-none focus:border-[#c79a2b]"
            >
              <option value="published">Published Live</option>
              <option value="draft">Save as Draft</option>
            </select>
          </div>
        </div>

        {/* Feature & Breaking Toggles */}
        <div className="p-5 bg-[#211b14] border border-[#30281b] rounded-xl flex flex-wrap items-center gap-8">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.isBreaking}
              onChange={(e) => setFormData({ ...formData, isBreaking: e.target.checked })}
              className="w-4 h-4 rounded text-[#c79a2b] bg-[#18140f] border-[#3d3222] focus:ring-0"
            />
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 uppercase">
              <Flame className="w-4 h-4 text-red-500" />
              <span>Broadcast in Breaking News Marquee Ticker</span>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="w-4 h-4 rounded text-[#c79a2b] bg-[#18140f] border-[#3d3222] focus:ring-0"
            />
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#c79a2b] uppercase">
              <Sparkles className="w-4 h-4" />
              <span>Feature in Spotlight Hero Grid</span>
            </div>
          </label>
        </div>

        {/* Save button bottom */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            to="/admin/articles"
            className="px-4 py-2.5 text-xs text-[#a89679] hover:text-white uppercase font-semibold"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-[#c79a2b] hover:bg-[#b08722] disabled:opacity-50 text-[#13100c] rounded text-xs font-bold uppercase tracking-wider transition-colors shadow"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isEditing ? 'Update Article' : 'Publish Article'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
