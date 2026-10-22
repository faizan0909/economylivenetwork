import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, Sparkles } from 'lucide-react';

export default function SpotlightHero({ articles = [] }) {
  if (!articles || articles.length === 0) return null;

  const leadArticle = articles[0];
  const sideArticles = articles.slice(1, 4);

  const formatDate = (iso) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(new Date(iso || Date.now()));
  };

  return (
    <section className="mb-12">
      {/* Section Label */}
      <div className="flex items-center justify-between pb-3 mb-6 border-b-2 border-[#1f1a12] dark:border-[#efe5d1]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#c79a2b]" />
          <h2 className="font-cinzel text-lg sm:text-xl font-bold tracking-wider uppercase">
            Spotlight &bull; Top Stories
          </h2>
        </div>
        <span className="text-xs uppercase tracking-widest text-[#8e7d61] font-semibold">
          Editorial Curation
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1. Large Lead Feature (Spans 7 cols on desktop) */}
        {leadArticle && (
          <div className="lg:col-span-7 group flex flex-col justify-between bg-[#f7f3ea] dark:bg-[#1a150f] rounded-lg overflow-hidden border border-[#e8dfcd] dark:border-[#2a2216] shadow-sm hover:shadow-md transition-shadow">
            <Link
              to={`/article/${leadArticle.slug}`}
              className="relative aspect-[16/10] overflow-hidden bg-black/10 block"
            >
              <img
                src={leadArticle.featuredImage}
                alt={leadArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="inline-block bg-[#c79a2b] text-[#13100c] text-xs uppercase font-extrabold px-2.5 py-1 rounded mb-2 shadow">
                  {leadArticle.categoryName || leadArticle.category}
                </span>
                <h3 className="font-serif-headline text-xl sm:text-3xl font-bold leading-tight drop-shadow-md group-hover:text-[#c79a2b] transition-colors">
                  {leadArticle.title}
                </h3>
              </div>
            </Link>

            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
              <p className="text-sm sm:text-base text-[#5c4f3a] dark:text-[#b8a78e] leading-relaxed line-clamp-3 mb-4">
                {leadArticle.excerpt}
              </p>

              <div className="pt-4 border-t border-[#e8dfcd] dark:border-[#2a2216] flex items-center justify-between text-xs text-[#8e7d61] dark:text-[#a89679]">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#1f1a12] dark:text-[#efe5d1]">
                    By {leadArticle.author || 'Chief Correspondent'}
                  </span>
                  <span>&bull;</span>
                  <span>{formatDate(leadArticle.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {leadArticle.readTime || '5 min read'}
                  </span>
                  {leadArticle.views !== undefined && (
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {leadArticle.views}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Side Mosaic Column (Spans 5 cols on desktop) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {sideArticles.map((article, idx) => (
            <article
              key={article.id || idx}
              className="group flex gap-4 p-4 rounded-lg bg-[#f7f3ea] dark:bg-[#1a150f] border border-[#e8dfcd] dark:border-[#2a2216] hover:border-[#c79a2b]/50 transition-all flex-1"
            >
              <Link
                to={`/article/${article.slug}`}
                className="w-28 sm:w-36 aspect-[4/3] rounded overflow-hidden bg-black/10 shrink-0 block"
              >
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </Link>

              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] uppercase font-bold text-[#c79a2b]">
                      {article.categoryName || article.category}
                    </span>
                    <span className="text-[10px] text-[#8e7d61] dark:text-[#a89679]">
                      &bull; {formatDate(article.publishedAt)}
                    </span>
                  </div>

                  <Link to={`/article/${article.slug}`}>
                    <h4 className="font-serif-headline text-sm sm:text-base font-bold leading-snug group-hover:text-[#c79a2b] transition-colors line-clamp-2">
                      {article.title}
                    </h4>
                  </Link>
                </div>

                <div className="mt-2 text-[11px] text-[#8e7d61] dark:text-[#a89679] flex items-center justify-between">
                  <span className="truncate max-w-[120px]">{article.author}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
