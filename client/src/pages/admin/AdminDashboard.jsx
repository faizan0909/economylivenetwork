import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStats, getArticles } from '../../api/client';
import {
  FileText,
  Eye,
  FolderTree,
  Radio,
  Flame,
  PlusCircle,
  ArrowRight,
  Clock,
  Loader2,
  TrendingUp,
  ExternalLink
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const [statsRes, articlesRes] = await Promise.all([
          getStats(),
          getArticles({ limit: 6 })
        ]);
        setStats(statsRes);
        setRecentArticles(articlesRes.items || []);
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[500px] text-[#c79a2b]">
        <Loader2 className="w-8 h-8 animate-spin mr-3" />
        <span>Loading Editorial Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#30281b]">
        <div>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
            Editorial Command Center
          </h1>
          <p className="text-xs text-[#a89679] mt-1">
            Real-time content performance, Google News syndication, and article publishing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/google-news"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#211b14] border border-[#c79a2b]/60 text-[#c79a2b] hover:bg-[#c79a2b] hover:text-[#13100c] rounded text-xs font-bold uppercase tracking-wider transition-all"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Fetch Google News</span>
          </Link>

          <Link
            to="/admin/articles/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#c79a2b] hover:bg-[#b08722] text-[#13100c] rounded text-xs font-bold uppercase tracking-wider transition-colors shadow"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Article</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1 */}
        <div className="p-5 rounded-xl bg-[#211b14] border border-[#30281b]">
          <div className="flex items-center justify-between text-[#8e7d61] mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">Published Articles</span>
            <FileText className="w-4 h-4 text-[#c79a2b]" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {stats?.publishedCount || 0}
          </div>
          <div className="text-[11px] text-[#8e7d61] mt-1">
            {stats?.draftCount || 0} drafts in queue
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-5 rounded-xl bg-[#211b14] border border-[#30281b]">
          <div className="flex items-center justify-between text-[#8e7d61] mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">Total Article Views</span>
            <Eye className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {(stats?.totalViews || 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Audience engagement live</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-5 rounded-xl bg-[#211b14] border border-[#30281b]">
          <div className="flex items-center justify-between text-[#8e7d61] mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">Active Desks</span>
            <FolderTree className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {stats?.totalCategories || 0}
          </div>
          <div className="text-[11px] text-[#8e7d61] mt-1">
            Crime, Politics, Tech, Business...
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-5 rounded-xl bg-[#211b14] border border-[#30281b]">
          <div className="flex items-center justify-between text-[#8e7d61] mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">Breaking Stories</span>
            <Flame className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {stats?.breakingCount || 0}
          </div>
          <div className="text-[11px] text-red-400 mt-1">
            Active on top marquee ticker
          </div>
        </div>
      </div>

      {/* Google News Quick Sync CTA Banner */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-[#2a2216] via-[#211b14] to-[#1a150f] border border-[#c79a2b]/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#c79a2b]/20 border border-[#c79a2b]/40 flex items-center justify-center text-[#c79a2b] shrink-0">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-cinzel text-lg font-bold text-white mb-1">
              Google News Aggregator & Category Mapper
            </h3>
            <p className="text-xs sm:text-sm text-[#d1c2a5] max-w-2xl leading-relaxed">
              Pull top breaking headlines directly from Google News RSS. Auto-detect and import them into <strong>Crime</strong>, <strong>Politics</strong>, <strong>Technology</strong>, <strong>Business</strong>, or custom desks with 1 click.
            </p>
          </div>
        </div>
        <Link
          to="/admin/google-news"
          className="px-5 py-3 bg-[#c79a2b] hover:bg-[#b08722] text-[#13100c] font-bold text-xs uppercase tracking-wider rounded transition-colors shrink-0 shadow flex items-center gap-2"
        >
          <span>Open News Fetcher</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Category Breakdown & Distribution */}
      {stats?.categoryBreakdown && (
        <div className="p-6 rounded-xl bg-[#211b14] border border-[#30281b]">
          <h3 className="font-cinzel text-base font-bold text-white mb-4 uppercase tracking-wider">
            Coverage by Desk
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.categoryBreakdown.map((cat) => (
              <Link
                key={cat.slug}
                to={`/admin/articles?category=${cat.slug}`}
                className="p-3.5 rounded bg-[#18140f] border border-[#30281b] hover:border-[#c79a2b] transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-white">{cat.name}</span>
                  <span className="text-xs font-mono font-bold text-[#c79a2b]">{cat.count}</span>
                </div>
                <div className="w-full bg-[#2a2217] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#c79a2b]"
                    style={{
                      width: `${Math.min(100, (cat.count / Math.max(1, stats.totalArticles)) * 100)}%`
                    }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Articles Table */}
      <div className="p-6 rounded-xl bg-[#211b14] border border-[#30281b]">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#30281b]">
          <h3 className="font-cinzel text-base font-bold text-white uppercase tracking-wider">
            Recent Editorial Dispatches
          </h3>
          <Link
            to="/admin/articles"
            className="text-xs text-[#c79a2b] hover:underline font-semibold flex items-center gap-1"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[#8e7d61] uppercase border-b border-[#2d251a]">
                <th className="pb-3 font-semibold">Article</th>
                <th className="pb-3 font-semibold">Desk</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Views</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d251a]">
              {recentArticles.map((article) => (
                <tr key={article.id} className="hover:bg-[#282117] transition-colors">
                  <td className="py-3 pr-4 max-w-md">
                    <div className="font-bold text-white truncate">
                      {article.title}
                    </div>
                    <div className="text-[11px] text-[#8e7d61] truncate">
                      By {article.author} &bull; {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#352c1e] text-[#c79a2b]">
                      {article.categoryName || article.category}
                    </span>
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      article.status === 'published' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 font-mono text-[#a89679]">
                    {article.views || 0}
                  </td>
                  <td className="py-3 text-right whitespace-nowrap space-x-2">
                    <Link
                      to={`/article/${article.slug}`}
                      target="_blank"
                      className="text-[#8e7d61] hover:text-[#efe5d1] p-1"
                      title="View on site"
                    >
                      <ExternalLink className="w-3.5 h-3.5 inline" />
                    </Link>
                    <Link
                      to={`/admin/articles/edit/${article.id}`}
                      className="text-[#c79a2b] hover:underline font-semibold"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
