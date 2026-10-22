import React, { useEffect, useState } from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import BreakingTicker from '../../components/common/BreakingTicker';
import SpotlightHero from '../../components/news/SpotlightHero';
import ArticleCard from '../../components/news/ArticleCard';
import Sidebar from '../../components/news/Sidebar';
import CategoryShowcase from '../../components/news/CategoryShowcase';
import { getArticles, getCategories } from '../../api/client';
import { Newspaper, Loader2, Sparkles } from 'lucide-react';

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [breakingArticles, setBreakingArticles] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [latestArticles, setLatestArticles] = useState([]);
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [catsRes, breakingRes, featuredRes, latestRes, trendingRes] = await Promise.all([
          getCategories(),
          getArticles({ isBreaking: true, limit: 10 }),
          getArticles({ isFeatured: true, limit: 6 }),
          getArticles({ limit: 12 }),
          getArticles({ sort: 'views', limit: 8 })
        ]);

        setCategories(catsRes || []);
        setBreakingArticles(breakingRes.items || []);
        setFeaturedArticles(featuredRes.items && featuredRes.items.length > 0 ? featuredRes.items : (latestRes.items || []).slice(0, 4));
        setLatestArticles(latestRes.items || []);
        setTrendingArticles(trendingRes.items || []);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Filter articles for category showcases
  const crimeArticles = latestArticles.filter(a => (a.category || '').toLowerCase() === 'crime');
  const techArticles = latestArticles.filter(a => (a.category || '').toLowerCase() === 'technology');
  const politicsArticles = latestArticles.filter(a => (a.category || '').toLowerCase() === 'politics');

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfaf6] dark:bg-[#13100c] text-[#1f1a12] dark:text-[#efe5d1]">
      {/* Header */}
      <Header categories={categories} />

      {/* Breaking Ticker */}
      <BreakingTicker items={breakingArticles.length > 0 ? breakingArticles : latestArticles.slice(0, 5)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-[#8e7d61]">
            <Loader2 className="w-8 h-8 animate-spin text-[#c79a2b] mb-3" />
            <span className="text-sm uppercase tracking-widest font-semibold">
              Loading EconomyLive Dispatches...
            </span>
          </div>
        ) : (
          <>
            {/* 1. Spotlight Hero Grid */}
            <SpotlightHero articles={featuredArticles} />

            {/* 2. Main News Layout: 2/3 Content Feed + 1/3 Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
              {/* Left Column: Fresh Feed & Categorized Desks (Spans 8 cols) */}
              <div className="lg:col-span-8">
                {/* Fresh Feed Header */}
                <div className="flex items-center justify-between pb-3 mb-6 border-b-2 border-[#1f1a12] dark:border-[#efe5d1]">
                  <div className="flex items-center gap-2">
                    <Newspaper className="w-4 h-4 text-[#c79a2b]" />
                    <h2 className="font-cinzel text-lg sm:text-xl font-bold tracking-wider uppercase">
                      Fresh Dispatches &bull; Latest Wire
                    </h2>
                  </div>
                  <span className="text-xs uppercase tracking-widest text-[#8e7d61] font-semibold">
                    Real-Time Feed
                  </span>
                </div>

                {/* Latest Articles List (Horizontal cards) */}
                <div className="space-y-6 mb-12">
                  {latestArticles.slice(0, 6).map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      variant="horizontal"
                      showExcerpt={true}
                    />
                  ))}
                </div>

                {/* Crime Showcase */}
                {crimeArticles.length > 0 && (
                  <CategoryShowcase
                    category="crime"
                    title="Crime & Investigative Desk"
                    description="Forensics, high-profile white-collar investigations, law enforcement raids, and legal rulings"
                    articles={crimeArticles}
                    maxItems={4}
                  />
                )}

                {/* Technology Showcase */}
                {techArticles.length > 0 && (
                  <CategoryShowcase
                    category="technology"
                    title="Technology, AI & Innovation"
                    description="Quantum computing, artificial intelligence, enterprise cybersecurity, and digital infrastructure"
                    articles={techArticles}
                    maxItems={4}
                  />
                )}

                {/* Politics Showcase */}
                {politicsArticles.length > 0 && (
                  <CategoryShowcase
                    category="politics"
                    title="Politics & National Governance"
                    description="Parliamentary legislation, policy shifts, electoral dynamics, and constitutional jurisprudence"
                    articles={politicsArticles}
                    maxItems={4}
                  />
                )}
              </div>

              {/* Right Column: Sidebar (Spans 4 cols) */}
              <div className="lg:col-span-4">
                <Sidebar
                  trendingArticles={trendingArticles.length > 0 ? trendingArticles : latestArticles}
                  categories={categories}
                />
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <Footer categories={categories} />
    </div>
  );
}
