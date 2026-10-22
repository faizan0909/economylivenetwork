import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getArticles, getCategories, deleteArticle, updateArticle } from '../../api/client';
import {
  PlusCircle,
  Search,
  Filter,
  Trash2,
  Edit,
  ExternalLink,
  Flame,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function AdminArticles() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [actionMessage, setActionMessage] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [catsRes, articlesRes] = await Promise.all([
        getCategories(),
        getArticles({
          category: selectedCategory || undefined,
          status: selectedStatus || undefined,
          search: searchQuery || undefined,
          limit: 100
        })
      ]);
      setCategories(catsRes || []);
      setArticles(articlesRes.items || []);
    } catch (err) {
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      setDeletingId(id);
      await deleteArticle(id);
      setArticles(prev => prev.filter(a => a.id !== id));
      setActionMessage('Article deleted successfully');
      setTimeout(() => setActionMessage(''), 3000);
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (article) => {
    const nextStatus = article.status === 'published' ? 'draft' : 'published';
    try {
      await updateArticle(article.id, { status: nextStatus });
      setArticles(prev => prev.map(a => a.id === article.id ? { ...a, status: nextStatus } : a));
      setActionMessage(`Article updated to ${nextStatus}`);
      setTimeout(() => setActionMessage(''), 3000);
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    }
  };

  const handleToggleBreaking = async (article) => {
    const nextVal = !article.isBreaking;
    try {
      await updateArticle(article.id, { isBreaking: nextVal });
      setArticles(prev => prev.map(a => a.id === article.id ? { ...a, isBreaking: nextVal } : a));
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#30281b]">
        <div>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
            Articles Management
          </h1>
          <p className="text-xs text-[#a89679] mt-1">
            Total {articles.length} dispatches in system &bull; Edit, curate, and publish.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/articles/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#c79a2b] hover:bg-[#b08722] text-[#13100c] rounded text-xs font-bold uppercase tracking-wider transition-colors shadow"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Write New Article</span>
          </Link>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 bg-[#211b14] border border-[#30281b] rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#786a52]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, author, keyword..."
            className="w-full pl-9 pr-4 py-2 bg-[#18140f] border border-[#3d3222] rounded text-xs text-white placeholder-[#5c4f3a] focus:outline-none focus:border-[#c79a2b]"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#18140f] border border-[#3d3222] text-xs text-white rounded px-3 py-2 focus:outline-none focus:border-[#c79a2b]"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id || cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#18140f] border border-[#3d3222] text-xs text-white rounded px-3 py-2 focus:outline-none focus:border-[#c79a2b]"
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          {(selectedCategory || selectedStatus || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('');
                setSelectedStatus('');
                setSearchQuery('');
              }}
              className="text-xs text-[#c79a2b] hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-[#211b14] border border-[#30281b] rounded-xl overflow-hidden shadow">
        {loading ? (
          <div className="p-12 text-center text-[#c79a2b] flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Loading articles...</span>
          </div>
        ) : articles.length === 0 ? (
          <div className="p-12 text-center text-[#8e7d61]">
            <p className="text-base font-bold text-white mb-2">No articles found</p>
            <p className="text-xs mb-4">Try clearing your filters or create a new article.</p>
            <Link
              to="/admin/articles/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#c79a2b] text-[#13100c] text-xs font-bold uppercase rounded"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Write Article</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1c1610] text-[#8e7d61] uppercase border-b border-[#30281b]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Article</th>
                  <th className="py-3 px-3 font-semibold">Category</th>
                  <th className="py-3 px-3 font-semibold">Status</th>
                  <th className="py-3 px-3 font-semibold">Flags</th>
                  <th className="py-3 px-3 font-semibold">Views</th>
                  <th className="py-3 px-3 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d251a]">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-[#282117] transition-colors">
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="flex items-center gap-3">
                        <img
                          src={article.featuredImage}
                          alt={article.title}
                          className="w-12 h-10 object-cover rounded bg-[#18140f] shrink-0"
                        />
                        <div className="min-w-0">
                          <Link
                            to={`/admin/articles/edit/${article.id}`}
                            className="font-bold text-white hover:text-[#c79a2b] transition-colors line-clamp-1 text-xs sm:text-sm"
                          >
                            {article.title}
                          </Link>
                          <span className="text-[11px] text-[#8e7d61] block truncate">
                            By {article.author}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#352c1e] text-[#c79a2b]">
                        {article.categoryName || article.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(article)}
                        title="Click to toggle status"
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                          article.status === 'published'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900'
                            : 'bg-amber-950 text-amber-400 border border-amber-800 hover:bg-amber-900'
                        }`}
                      >
                        {article.status}
                      </button>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleBreaking(article)}
                          title={article.isBreaking ? 'Breaking News (Active)' : 'Mark as Breaking News'}
                          className={`p-1 rounded cursor-pointer ${
                            article.isBreaking ? 'bg-red-950 text-red-400 border border-red-800' : 'text-[#5c4f3a] hover:text-[#c5b59a]'
                          }`}
                        >
                          <Flame className="w-3.5 h-3.5" />
                        </button>
                        {article.isFeatured && (
                          <span title="Featured in Spotlight" className="p-1 rounded bg-[#3d3119] text-[#c79a2b]">
                            <Sparkles className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-mono text-[#a89679] whitespace-nowrap">
                      {article.views || 0}
                    </td>

                    <td className="py-3.5 px-3 text-[#8e7d61] whitespace-nowrap">
                      {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                      <Link
                        to={`/article/${article.slug}`}
                        target="_blank"
                        className="text-[#8e7d61] hover:text-white p-1 inline-block"
                        title="View live article"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        to={`/admin/articles/edit/${article.id}`}
                        className="text-[#c79a2b] hover:text-[#e4be5c] p-1 inline-block font-semibold"
                        title="Edit article"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id, article.title)}
                        disabled={deletingId === article.id}
                        className="text-red-400 hover:text-red-300 p-1 inline-block cursor-pointer disabled:opacity-50"
                        title="Delete article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
