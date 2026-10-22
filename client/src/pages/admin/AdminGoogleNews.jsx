import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchGoogleNews,
  importGoogleNewsItem,
  importGoogleNewsBatch,
  getCategories
} from '../../api/client';
import {
  Radio,
  DownloadCloud,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Search,
  Filter,
  Check,
  Flame,
  Globe,
  Tag,
  Eye,
  RefreshCw
} from 'lucide-react';

const PREDEFINED_TOPICS = [
  { id: 'crime', name: 'Crime Desk', icon: '🚨', defaultCategory: 'crime', query: 'crime OR police OR arrest OR investigation' },
  { id: 'politics', name: 'Politics & Nation', icon: '🏛️', defaultCategory: 'politics', query: 'politics OR election OR parliament OR government' },
  { id: 'technology', name: 'Technology & AI', icon: '💻', defaultCategory: 'technology', query: 'technology OR artificial intelligence OR cybersecurity OR semiconductor' },
  { id: 'business', name: 'Business & Economy', icon: '📈', defaultCategory: 'business', query: 'business OR stock market OR economy OR startups' },
  { id: 'healthcare', name: 'Healthcare & Science', icon: '🩺', defaultCategory: 'healthcare', query: 'healthcare OR medical OR vaccine OR hospital' },
  { id: 'sports', name: 'Sports Arena', icon: '🏆', defaultCategory: 'sports', query: 'sports OR cricket OR football OR tournament' },
  { id: 'world', name: 'World Geopolitics', icon: '🌍', defaultCategory: 'world-news', query: 'world news OR united nations OR international' },
  { id: 'custom', name: 'Custom Search', icon: '🔍', defaultCategory: 'politics', query: '' }
];

export default function AdminGoogleNews() {
  const [categories, setCategories] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('crime');
  const [customQuery, setCustomQuery] = useState('');
  const [country, setCountry] = useState('IN');
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importingId, setImportingId] = useState(null);
  const [batchImporting, setBatchImporting] = useState(false);
  const [importedSlugs, setImportedSlugs] = useState({});
  const [batchCategory, setBatchCategory] = useState('crime');
  const [toastMessage, setToastMessage] = useState('');

  // Per-item category selection state
  const [itemCategories, setItemCategories] = useState({});

  useEffect(() => {
    getCategories().then(cats => {
      setCategories(cats || []);
    }).catch(console.error);
    // Initial fetch for Crime
    handleFetch('crime');
  }, []);

  const handleFetch = async (topicKey = selectedTopic) => {
    setLoading(true);
    setToastMessage('');
    try {
      const topicObj = PREDEFINED_TOPICS.find(t => t.id === topicKey);
      let res;

      if (topicKey === 'custom' && customQuery.trim()) {
        res = await fetchGoogleNews({ query: customQuery.trim(), country });
      } else if (topicKey !== 'custom') {
        res = await fetchGoogleNews({ topic: topicKey, country });
      } else {
        res = await fetchGoogleNews({ topic: 'top', country });
      }

      setNewsItems(res.items || []);

      // Initialize category mapping for each item with suggested category
      const initialMap = {};
      (res.items || []).forEach(item => {
        initialMap[item.feedId] = item.suggestedCategory || (topicObj?.defaultCategory || 'politics');
      });
      setItemCategories(initialMap);

      if (topicObj?.defaultCategory) {
        setBatchCategory(topicObj.defaultCategory);
      }
    } catch (err) {
      alert(`Fetch failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleItemCategoryChange = (feedId, newCat) => {
    setItemCategories(prev => ({ ...prev, [feedId]: newCat }));
  };

  const handleImportSingle = async (item, status = 'published') => {
    const targetCategory = itemCategories[item.feedId] || item.suggestedCategory || 'politics';
    setImportingId(item.feedId);
    try {
      const res = await importGoogleNewsItem(item, targetCategory, status);
      setImportedSlugs(prev => ({ ...prev, [item.feedId]: res.article.slug }));
      setToastMessage(`Imported "${item.title.slice(0, 40)}..." into ${targetCategory.toUpperCase()}`);
      setTimeout(() => setToastMessage(''), 4000);
    } catch (err) {
      alert(`Import failed: ${err.message}`);
    } finally {
      setImportingId(null);
    }
  };

  const handleBatchImport = async () => {
    if (!newsItems.length) return;
    if (!window.confirm(`Import top ${Math.min(10, newsItems.length)} stories into category "${batchCategory.toUpperCase()}"?`)) return;

    setBatchImporting(true);
    try {
      const itemsToImport = newsItems.slice(0, 10).map(item => ({
        ...item,
        suggestedCategory: batchCategory
      }));

      const res = await importGoogleNewsBatch(itemsToImport, batchCategory, 'published');
      const newSlugs = { ...importedSlugs };
      res.articles.forEach((art, idx) => {
        if (newsItems[idx]) {
          newSlugs[newsItems[idx].feedId] = art.slug;
        }
      });
      setImportedSlugs(newSlugs);
      setToastMessage(`Batch imported ${res.count} articles into ${batchCategory.toUpperCase()} successfully!`);
    } catch (err) {
      alert(`Batch import failed: ${err.message}`);
    } finally {
      setBatchImporting(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Page Masthead */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#30281b]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c79a2b] mb-1">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Google News Live Syndication Engine</span>
          </div>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
            Fetch & Categorize Google News
          </h1>
          <p className="text-xs text-[#a89679] mt-1 max-w-3xl leading-relaxed">
            Extract real-time feeds across <strong>Crime</strong>, <strong>Politics</strong>, <strong>Technology</strong>, <strong>Business</strong>, and more. Convert them into formatted articles with 1 click.
          </p>
        </div>

        {/* Global / Country Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#211b14] border border-[#30281b] px-3 py-2 rounded">
            <Globe className="w-4 h-4 text-[#c79a2b]" />
            <select
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
              }}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="IN" className="bg-[#211b14]">India Edition (en-IN)</option>
              <option value="US" className="bg-[#211b14]">US Edition (en-US)</option>
              <option value="GB" className="bg-[#211b14]">UK Edition (en-GB)</option>
              <option value="GLOBAL" className="bg-[#211b14]">Global Headlines</option>
            </select>
          </div>

          <button
            onClick={() => handleFetch()}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-[#c79a2b] hover:bg-[#b08722] disabled:opacity-50 text-[#13100c] rounded text-xs font-bold uppercase tracking-wider transition-colors shadow"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            <span>Refresh Feed</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded text-xs flex items-center justify-between animate-fadeIn shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </div>
          <Link
            to="/"
            target="_blank"
            className="text-[#c79a2b] hover:underline font-bold flex items-center gap-1 shrink-0"
          >
            <span>View Public Frontpage</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Topic Switcher Tabs */}
      <div className="bg-[#211b14] border border-[#30281b] rounded-xl p-4 space-y-4">
        <span className="text-xs uppercase font-extrabold tracking-wider text-[#c5b59a] block">
          Select Topic or Desk to Pull Live News:
        </span>
        <div className="flex flex-wrap gap-2">
          {PREDEFINED_TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => {
                setSelectedTopic(topic.id);
                if (topic.id !== 'custom') {
                  handleFetch(topic.id);
                }
              }}
              className={`
                px-3.5 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer
                ${selectedTopic === topic.id
                  ? 'bg-[#c79a2b] text-[#13100c] shadow-md scale-102'
                  : 'bg-[#18140f] text-[#c5b59a] border border-[#30281b] hover:border-[#c79a2b]/60 hover:text-white'
                }
              `}
            >
              <span>{topic.icon}</span>
              <span>{topic.name}</span>
            </button>
          ))}
        </div>

        {/* Custom Search Form if Custom Selected */}
        {selectedTopic === 'custom' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleFetch('custom');
            }}
            className="flex gap-2 pt-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8e7d61]" />
              <input
                type="text"
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                placeholder="Type any search query e.g. Cyber Crime, AI Legislation, High Court..."
                className="w-full pl-9 pr-3 py-2 bg-[#18140f] border border-[#3d3222] rounded text-xs text-white focus:outline-none focus:border-[#c79a2b]"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-[#c79a2b] hover:bg-[#b08722] text-[#13100c] text-xs font-bold uppercase tracking-wider rounded"
            >
              Search Google News
            </button>
          </form>
        )}
      </div>

      {/* Batch Import Bar */}
      {newsItems.length > 0 && (
        <div className="p-4 bg-gradient-to-r from-[#282117] to-[#1c1610] border border-[#c79a2b]/40 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Batch Ingestion:
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#a89679]">Target Category:</span>
              <select
                value={batchCategory}
                onChange={(e) => setBatchCategory(e.target.value)}
                className="bg-[#18140f] border border-[#3d3222] text-xs text-white rounded px-2.5 py-1.5 focus:outline-none focus:border-[#c79a2b]"
              >
                {categories.map((c) => (
                  <option key={c.id || c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleBatchImport}
            disabled={batchImporting}
            className="flex items-center gap-2 px-4 py-2 bg-[#c79a2b] hover:bg-[#b08722] disabled:opacity-50 text-[#13100c] text-xs font-bold uppercase tracking-wider rounded transition-colors shadow"
          >
            {batchImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <DownloadCloud className="w-4 h-4" />}
            <span>Import Top 10 Stories into {batchCategory.toUpperCase()}</span>
          </button>
        </div>
      )}

      {/* News Feed Results */}
      <div>
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#30281b]">
          <h2 className="font-cinzel text-base font-bold text-white uppercase tracking-wider">
            Google News Stories ({newsItems.length})
          </h2>
          <span className="text-xs text-[#8e7d61]">
            Curate desk assignments before importing
          </span>
        </div>

        {loading ? (
          <div className="p-20 text-center text-[#c79a2b] flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin mb-3" />
            <span className="text-xs uppercase tracking-widest font-bold">
              Fetching Live Google News Wire...
            </span>
          </div>
        ) : newsItems.length === 0 ? (
          <div className="p-16 text-center text-[#8e7d61] bg-[#211b14] rounded-xl border border-[#30281b]">
            <p className="text-base font-bold text-white mb-2">No news items returned</p>
            <p className="text-xs">Try selecting a different topic or enter a custom query.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {newsItems.map((item) => {
              const assignedCategory = itemCategories[item.feedId] || item.suggestedCategory || 'politics';
              const isImported = Boolean(importedSlugs[item.feedId]);
              const importedSlug = importedSlugs[item.feedId];

              return (
                <div
                  key={item.feedId}
                  className={`
                    p-5 rounded-xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6
                    ${isImported ? 'bg-[#1e261a] border-emerald-900/60' : 'bg-[#211b14] border-[#30281b] hover:border-[#4a3d28]'}
                  `}
                >
                  {/* Left: Thumbnail & Story Details */}
                  <div className="flex gap-4 items-start min-w-0 flex-1">
                    <img
                      src={item.previewImage}
                      alt={item.title}
                      className="w-24 sm:w-28 aspect-[4/3] object-cover rounded bg-[#18140f] shrink-0"
                    />

                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#352c1e] text-[#c79a2b]">
                          Source: {item.source}
                        </span>
                        <span className="text-[11px] text-[#8e7d61]">
                          {new Date(item.pubDate).toLocaleString()}
                        </span>
                        {item.suggestedCategory && (
                          <span className="text-[10px] text-[#a89679] bg-[#18140f] px-1.5 py-0.5 rounded border border-[#30281b]">
                            Auto-detected: {item.suggestedCategory}
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif-headline text-sm sm:text-base font-bold text-white leading-snug">
                        {item.title}
                      </h3>

                      <p className="text-xs text-[#a89679] line-clamp-2 leading-relaxed">
                        {item.snippet}
                      </p>
                    </div>
                  </div>

                  {/* Right: Category Selector & Import Controls */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-[#30281b]">
                    {/* Category Dropdown */}
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <span className="text-[11px] text-[#8e7d61] font-medium">Assign Desk:</span>
                      <select
                        value={assignedCategory}
                        onChange={(e) => handleItemCategoryChange(item.feedId, e.target.value)}
                        className="bg-[#18140f] border border-[#3d3222] text-xs text-white rounded px-2.5 py-1.5 focus:outline-none focus:border-[#c79a2b]"
                      >
                        {categories.map((c) => (
                          <option key={c.id || c.slug} value={c.slug}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Action buttons */}
                    {isImported ? (
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold bg-emerald-950/80 px-3 py-1.5 rounded border border-emerald-800">
                          <Check className="w-3.5 h-3.5" />
                          <span>Imported</span>
                        </span>
                        <Link
                          to={`/article/${importedSlug}`}
                          target="_blank"
                          className="px-3 py-1.5 bg-[#2a2217] text-[#c79a2b] hover:text-white rounded text-xs font-semibold flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Live</span>
                        </Link>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => handleImportSingle(item, 'published')}
                          disabled={importingId === item.feedId}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-[#c79a2b] hover:bg-[#b08722] disabled:opacity-50 text-[#13100c] rounded text-xs font-bold uppercase tracking-wider transition-colors shadow"
                        >
                          {importingId === item.feedId ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <DownloadCloud className="w-3.5 h-3.5" />
                          )}
                          <span>Publish</span>
                        </button>

                        <button
                          onClick={() => handleImportSingle(item, 'draft')}
                          disabled={importingId === item.feedId}
                          className="flex-1 sm:flex-none px-3 py-1.5 bg-[#18140f] hover:bg-[#282117] border border-[#3d3222] text-[#c5b59a] rounded text-xs font-semibold transition-colors"
                        >
                          Draft
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
