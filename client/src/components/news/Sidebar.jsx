import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Radio, Tag, ArrowRight } from 'lucide-react';

export default function Sidebar({ trendingArticles = [], categories = [] }) {
  return (
    <aside className="space-y-8">
      {/* 1. Trending / Most Read with 1-5 rank numbers */}
      <div className="bg-[#f7f3ea] dark:bg-[#1a150f] p-5 rounded-lg border border-[#e8dfcd] dark:border-[#2a2216]">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#e8dfcd] dark:border-[#2a2216]">
          <TrendingUp className="w-4 h-4 text-[#c79a2b]" />
          <h3 className="font-cinzel text-base font-bold tracking-wider uppercase">
            Most Read &bull; Trending
          </h3>
        </div>

        <div className="space-y-4">
          {trendingArticles.slice(0, 5).map((article, idx) => (
            <Link
              key={article.id || idx}
              to={`/article/${article.slug}`}
              className="group flex gap-3 items-start pb-3.5 border-b border-[#efe7d6] dark:border-[#241e16] last:border-b-0 last:pb-0"
            >
              <span className="font-cinzel text-2xl font-black text-[#c79a2b]/80 group-hover:text-[#c79a2b] transition-colors w-7 shrink-0 text-center">
                0{idx + 1}
              </span>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase font-bold text-[#8e7d61] dark:text-[#a89679] block mb-1">
                  {article.categoryName || article.category}
                </span>
                <h4 className="font-serif-headline text-sm font-bold leading-snug group-hover:text-[#c79a2b] transition-colors line-clamp-2">
                  {article.title}
                </h4>
                <div className="mt-1.5 text-[11px] text-[#8e7d61] dark:text-[#a89679]">
                  {article.views || 0} views &bull; {article.readTime || '3 min'}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 2. Google News Live Aggregator Promo Box */}
      <div className="bg-gradient-to-br from-[#1f1a12] to-[#382b17] text-[#efe5d1] p-5 rounded-lg border border-[#c79a2b]/30 shadow-md">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c79a2b] mb-2">
          <Radio className="w-4 h-4 animate-pulse" />
          <span>Real-Time Google News Feeds</span>
        </div>
        <h4 className="font-cinzel text-lg font-bold text-white mb-2">
          Automated Topic Ingestion
        </h4>
        <p className="text-xs text-[#d1c2a5] leading-relaxed mb-4">
          Live syndication pulls stories into Crime, Politics, Technology, and Business directly from Google News.
        </p>
        <Link
          to="/admin/google-news"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#c79a2b] hover:bg-[#b08722] text-[#13100c] text-xs font-bold uppercase tracking-wider rounded transition-colors"
        >
          <span>Open News Ingestion</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 3. News Topics / Categories Cloud */}
      <div className="bg-[#f7f3ea] dark:bg-[#1a150f] p-5 rounded-lg border border-[#e8dfcd] dark:border-[#2a2216]">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#e8dfcd] dark:border-[#2a2216]">
          <Tag className="w-4 h-4 text-[#c79a2b]" />
          <h3 className="font-cinzel text-base font-bold tracking-wider uppercase">
            Browse Desks
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.id || cat.slug}
              to={`/category/${cat.slug}`}
              className="px-3 py-1.5 text-xs font-semibold rounded bg-white dark:bg-[#241e16] border border-[#d8cdb8] dark:border-[#382f22] text-[#4a3718] dark:text-[#dac99b] hover:border-[#c79a2b] hover:text-[#c79a2b] transition-all"
            >
              {cat.name}
              {cat.articleCount ? ` (${cat.articleCount})` : ''}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
