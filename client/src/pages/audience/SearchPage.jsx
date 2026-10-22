import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import ArticleCard from '../../components/news/ArticleCard';
import { getArticles, getCategories } from '../../api/client';
import { Search, Loader2 } from 'lucide-react';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    async function performSearch() {
      if (!query.trim()) {
        setArticles([]);
        return;
      }
      try {
        setLoading(true);
        const res = await getArticles({ search: query, limit: 30 });
        setArticles(res.items || []);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    }

    performSearch();
    setSearchInput(query);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfaf6] dark:bg-[#13100c] text-[#1f1a12] dark:text-[#efe5d1]">
      <Header categories={categories} />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-8 py-10 w-full">
        {/* Search Input Box */}
        <div className="max-w-2xl mx-auto mb-10 text-center">
          <h1 className="font-cinzel text-3xl font-extrabold mb-3">
            Search News Archive
          </h1>
          <p className="text-xs sm:text-sm text-[#8e7d61] dark:text-[#a89679] mb-6">
            Find reports across Crime, Politics, Technology, Business, Healthcare, and World News.
          </p>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e7d61]" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Type keywords (e.g. cyber, supreme court, semiconductor)..."
                className="w-full pl-11 pr-4 py-3 bg-[#f7f3ea] dark:bg-[#1a150f] border border-[#d8cdb8] dark:border-[#382f22] rounded text-sm focus:outline-none focus:border-[#c79a2b]"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#c79a2b] hover:bg-[#b08722] text-[#13100c] font-bold text-xs uppercase tracking-wider rounded transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Search Results */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#8e7d61]">
            <Loader2 className="w-8 h-8 animate-spin text-[#c79a2b] mb-3" />
            <span className="text-sm uppercase tracking-widest font-semibold">
              Searching Archives...
            </span>
          </div>
        ) : query ? (
          <div>
            <div className="pb-3 mb-6 border-b border-[#e8dfcd] dark:border-[#2a2216] flex items-center justify-between text-xs text-[#8e7d61]">
              <span>
                Found <strong className="text-[#1f1a12] dark:text-[#efe5d1]">{articles.length}</strong> dispatches matching "{query}"
              </span>
            </div>

            {articles.length === 0 ? (
              <div className="py-16 text-center text-[#8e7d61]">
                <p className="text-base font-semibold mb-2">No matching dispatches found</p>
                <p className="text-xs">Try different keywords or browse topics in the navigation bar.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="horizontal" />
                ))}
              </div>
            )}
          </div>
        ) : null}
      </main>

      <Footer categories={categories} />
    </div>
  );
}
