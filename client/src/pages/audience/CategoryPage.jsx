import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import ArticleCard from '../../components/news/ArticleCard';
import { getArticles, getCategories, getCategory } from '../../api/client';
import { Loader2, ArrowLeft, SlidersHorizontal } from 'lucide-react';

export default function CategoryPage() {
  const { slug } = useParams();
  const [articles, setArticles] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('publishedAt');

  useEffect(() => {
    window.scrollTo(0, 0);
    async function loadCategoryData() {
      try {
        setLoading(true);
        const [catsRes, catInfoRes, articlesRes] = await Promise.all([
          getCategories(),
          getCategory(slug).catch(() => ({ name: slug, slug })),
          getArticles({ category: slug, sort: sortBy, limit: 30 })
        ]);

        setCategories(catsRes || []);
        setCategoryInfo(catInfoRes);
        setArticles(articlesRes.items || []);
      } catch (err) {
        console.error('Failed to load category articles:', err);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadCategoryData();
    }
  }, [slug, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfaf6] dark:bg-[#13100c] text-[#1f1a12] dark:text-[#efe5d1]">
      <Header categories={categories} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full">
        {/* Category Header Banner */}
        <div className="mb-8 pb-6 border-b-2 border-[#1f1a12] dark:border-[#efe5d1] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs uppercase font-extrabold tracking-widest text-[#c79a2b]">
              <span>Section Archive</span>
              <span>&bull;</span>
              <span>{articles.length} Dispatches</span>
            </div>
            <h1 className="font-cinzel text-3xl sm:text-4xl font-extrabold capitalize text-[#1a150e] dark:text-[#f7eedc]">
              {categoryInfo?.name || slug}
            </h1>
            {categoryInfo?.description && (
              <p className="mt-2 text-sm text-[#8e7d61] dark:text-[#a89679] max-w-2xl">
                {categoryInfo.description}
              </p>
            )}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#8e7d61]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#f7f3ea] dark:bg-[#1a150f] border border-[#d8cdb8] dark:border-[#382f22] text-xs font-semibold px-3 py-1.5 rounded focus:outline-none focus:border-[#c79a2b]"
            >
              <option value="publishedAt">Latest First</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-[#8e7d61]">
            <Loader2 className="w-8 h-8 animate-spin text-[#c79a2b] mb-3" />
            <span className="text-sm uppercase tracking-widest font-semibold">
              Loading {categoryInfo?.name || slug} News...
            </span>
          </div>
        ) : articles.length === 0 ? (
          <div className="py-20 text-center bg-[#f7f3ea] dark:bg-[#1a150f] rounded-lg border border-[#e8dfcd] dark:border-[#2a2216] max-w-xl mx-auto p-8">
            <h3 className="font-cinzel text-xl font-bold mb-2">No Articles in this Category Yet</h3>
            <p className="text-xs sm:text-sm text-[#8e7d61] dark:text-[#a89679] mb-6">
              You can easily fetch and categorize live news from Google News into this section using the Admin Panel.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                to="/"
                className="px-4 py-2 border border-[#d8cdb8] dark:border-[#382f22] rounded text-xs font-bold uppercase tracking-wider hover:bg-black/5"
              >
                Front Page
              </Link>
              <Link
                to="/admin/google-news"
                className="px-4 py-2 bg-[#c79a2b] text-[#13100c] rounded text-xs font-bold uppercase tracking-wider hover:bg-[#b08722]"
              >
                Fetch Google News
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="vertical" />
            ))}
          </div>
        )}
      </main>

      <Footer categories={categories} />
    </div>
  );
}
