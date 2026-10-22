import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ArticleCard from './ArticleCard';

export default function CategoryShowcase({ category, title, description, articles = [], maxItems = 4 }) {
  if (!articles || articles.length === 0) return null;

  const displayArticles = articles.slice(0, maxItems);

  return (
    <section className="mb-14">
      {/* Category Section Header */}
      <div className="flex items-end justify-between pb-3 mb-6 border-b-2 border-[#1f1a12] dark:border-[#efe5d1]">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#c79a2b] block mb-1">
            Desk Coverage
          </span>
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold tracking-wide">
            {title || category}
          </h2>
          {description && (
            <p className="text-xs sm:text-sm text-[#8e7d61] dark:text-[#a89679] mt-0.5">
              {description}
            </p>
          )}
        </div>

        <Link
          to={`/category/${category.toLowerCase()}`}
          className="group flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#5c4f3a] dark:text-[#c5b59a] hover:text-[#c79a2b] dark:hover:text-[#c79a2b] transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Grid of articles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayArticles.map((article) => (
          <ArticleCard key={article.id} article={article} variant="vertical" />
        ))}
      </div>
    </section>
  );
}
