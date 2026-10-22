import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, Flame } from 'lucide-react';

export default function ArticleCard({ article, variant = 'vertical', showExcerpt = true }) {
  if (!article) return null;

  // Format date or relative time
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(article.publishedAt || article.createdAt || Date.now()));

  // Category badge style
  const getCategoryColor = (cat) => {
    switch ((cat || '').toLowerCase()) {
      case 'crime': return 'bg-red-600 text-white';
      case 'politics': return 'bg-blue-600 text-white';
      case 'technology': return 'bg-emerald-600 text-white';
      case 'business': return 'bg-amber-600 text-white';
      case 'healthcare': return 'bg-cyan-600 text-white';
      case 'sports': return 'bg-orange-600 text-white';
      case 'cxo-view': return 'bg-purple-600 text-white';
      default: return 'bg-[#c79a2b] text-[#13100c]';
    }
  };

  // Horizontal variant (for lists and feeds)
  if (variant === 'horizontal') {
    return (
      <article className="group flex flex-col sm:flex-row gap-4 sm:gap-6 pb-6 border-b border-[#e8dfcd] dark:border-[#262015] last:border-b-0">
        <Link
          to={`/article/${article.slug}`}
          className="sm:w-1/3 aspect-[16/10] sm:aspect-[4/3] overflow-hidden rounded bg-[#efe7d6] dark:bg-[#241e16] shrink-0 relative block"
        >
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {article.isBreaking && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow">
              Breaking
            </span>
          )}
        </Link>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link
                to={`/category/${article.category}`}
                className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${getCategoryColor(article.category)} hover:opacity-90`}
              >
                {article.categoryName || article.category}
              </Link>
              <span className="text-xs text-[#8e7d61] dark:text-[#a89679] flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {article.readTime || '4 min read'}
              </span>
            </div>

            <Link to={`/article/${article.slug}`}>
              <h3 className="font-serif-headline text-lg sm:text-xl font-bold leading-snug group-hover:text-[#c79a2b] transition-colors line-clamp-2">
                {article.title}
              </h3>
            </Link>

            {showExcerpt && article.excerpt && (
              <p className="mt-2 text-xs sm:text-sm text-[#5c4f3a] dark:text-[#b3a48a] line-clamp-2 leading-relaxed">
                {article.excerpt}
              </p>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-[#8e7d61] dark:text-[#a89679]">
            <span className="font-medium text-[#1f1a12] dark:text-[#efe5d1]">
              By {article.author || 'EconomyLive Desk'}
            </span>
            <div className="flex items-center gap-3">
              <span>{formattedDate}</span>
              {article.views !== undefined && (
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {article.views}
                </span>
              )}
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Compact variant (for sidebars)
  if (variant === 'compact') {
    return (
      <article className="group flex gap-3 items-start py-3 border-b border-[#efe7d6] dark:border-[#221c13] last:border-b-0">
        <Link
          to={`/article/${article.slug}`}
          className="w-20 h-16 rounded overflow-hidden bg-[#efe7d6] dark:bg-[#241e16] shrink-0 block"
        >
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link
              to={`/category/${article.category}`}
              className="text-[9px] uppercase font-bold text-[#c79a2b] hover:underline"
            >
              {article.categoryName || article.category}
            </Link>
            <span className="text-[10px] text-[#8e7d61] dark:text-[#a89679]">
              {formattedDate}
            </span>
          </div>
          <Link to={`/article/${article.slug}`}>
            <h4 className="font-serif-headline text-xs sm:text-sm font-bold line-clamp-2 leading-snug group-hover:text-[#c79a2b] transition-colors">
              {article.title}
            </h4>
          </Link>
        </div>
      </article>
    );
  }

  // Default Vertical Card
  return (
    <article className="group flex flex-col bg-[#f7f3ea]/50 dark:bg-[#1a150f]/50 border border-[#e8dfcd] dark:border-[#262015] rounded overflow-hidden hover:shadow-md transition-all duration-300">
      <Link
        to={`/article/${article.slug}`}
        className="aspect-[16/10] overflow-hidden bg-[#efe7d6] dark:bg-[#241e16] relative block"
      >
        <img
          src={article.featuredImage}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-2 left-2 flex gap-1">
          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded shadow ${getCategoryColor(article.category)}`}>
            {article.categoryName || article.category}
          </span>
          {article.isBreaking && (
            <span className="bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow flex items-center gap-1">
              <Flame className="w-2.5 h-2.5" />
              Breaking
            </span>
          )}
        </div>
      </Link>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8e7d61] dark:text-[#a89679] mb-2">
            <span>{formattedDate}</span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTime || '4 min read'}
            </span>
          </div>

          <Link to={`/article/${article.slug}`}>
            <h3 className="font-serif-headline text-base sm:text-lg font-bold leading-snug group-hover:text-[#c79a2b] transition-colors line-clamp-2">
              {article.title}
            </h3>
          </Link>

          {showExcerpt && article.excerpt && (
            <p className="mt-2 text-xs sm:text-sm text-[#5c4f3a] dark:text-[#b3a48a] line-clamp-3 leading-relaxed">
              {article.excerpt}
            </p>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-[#e8dfcd] dark:border-[#262015] flex items-center justify-between text-xs text-[#8e7d61] dark:text-[#a89679]">
          <span className="font-medium text-[#1f1a12] dark:text-[#efe5d1] truncate max-w-[140px]">
            {article.author || 'Editorial Bureau'}
          </span>
          {article.views !== undefined && (
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {article.views}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
