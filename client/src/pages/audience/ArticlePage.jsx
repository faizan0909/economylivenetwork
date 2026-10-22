import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import ReadingProgress from '../../components/common/ReadingProgress';
import ArticleCard from '../../components/news/ArticleCard';
import { getArticle, getCategories } from '../../api/client';
import { Clock, Eye, Share2, MessageCircle, Twitter, Linkedin, Check, ChevronRight, Loader2, ArrowLeft, ExternalLink } from 'lucide-react';

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    async function loadArticleData() {
      try {
        setLoading(true);
        const [articleRes, catsRes] = await Promise.all([
          getArticle(slug),
          getCategories()
        ]);
        setArticle(articleRes.article);
        setRelated(articleRes.related || []);
        setCategories(catsRes || []);
      } catch (err) {
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadArticleData();
    }
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(article?.title || 'EconomyLive Network Article');

  const formattedDate = article?.publishedAt
    ? new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }).format(new Date(article.publishedAt))
    : '';

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fcfaf6] dark:bg-[#13100c]">
        <Header categories={categories} />
        <div className="flex-1 flex flex-col items-center justify-center py-32 text-[#8e7d61]">
          <Loader2 className="w-8 h-8 animate-spin text-[#c79a2b] mb-3" />
          <span className="text-sm uppercase tracking-widest font-semibold">
            Loading Article Dispatch...
          </span>
        </div>
        <Footer categories={categories} />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fcfaf6] dark:bg-[#13100c]">
        <Header categories={categories} />
        <div className="flex-1 max-w-3xl mx-auto px-4 py-20 text-center">
          <h2 className="font-cinzel text-3xl font-bold mb-4">Article Not Found</h2>
          <p className="text-[#8e7d61] mb-6">
            The article dispatch you are requesting may have been moved or updated.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#c79a2b] text-[#13100c] font-bold text-sm uppercase rounded"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Front Page
          </Link>
        </div>
        <Footer categories={categories} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfaf6] dark:bg-[#13100c] text-[#1f1a12] dark:text-[#efe5d1]">
      {/* Top Reading Progress Bar */}
      <ReadingProgress />

      <Header categories={categories} />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-8 py-8 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#8e7d61] dark:text-[#a89679] mb-6 overflow-hidden">
          <Link to="/" className="hover:text-[#c79a2b] transition-colors shrink-0">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <Link
            to={`/category/${article.category}`}
            className="hover:text-[#c79a2b] uppercase font-semibold transition-colors shrink-0"
          >
            {article.categoryName || article.category}
          </Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="truncate">{article.title}</span>
        </nav>

        {/* Category Pill */}
        <div className="mb-4">
          <Link
            to={`/category/${article.category}`}
            className="inline-block px-3 py-1 bg-[#c79a2b] text-[#13100c] text-xs font-extrabold uppercase tracking-widest rounded"
          >
            {article.categoryName || article.category}
          </Link>
        </div>

        {/* Title */}
        <h1 className="font-serif-headline text-2xl sm:text-4xl md:text-5xl font-black leading-tight sm:leading-tight mb-4 text-[#1a150e] dark:text-[#f7eedc]">
          {article.title}
        </h1>

        {/* Subtitle / Excerpt */}
        {article.excerpt && (
          <p className="text-base sm:text-xl text-[#5c4f3a] dark:text-[#c5b59a] font-normal leading-relaxed mb-6 font-serif-headline">
            {article.excerpt}
          </p>
        )}

        {/* Author / Date / Share Bar */}
        <div className="py-4 border-y border-[#e8dfcd] dark:border-[#2a2216] mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="font-bold text-sm text-[#1f1a12] dark:text-[#efe5d1]">
              By {article.author || 'Editorial Staff'}
            </div>
            <div className="text-xs text-[#8e7d61] dark:text-[#a89679] flex items-center gap-3 mt-0.5">
              <span>{formattedDate}</span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {article.readTime || '4 min read'}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {article.views || 0} views
              </span>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-semibold text-[#8e7d61] mr-1 hidden sm:inline">
              Share:
            </span>
            <a
              href={`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded bg-[#25D366] text-white hover:opacity-90 transition-opacity"
              title="Share on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded bg-black text-white hover:opacity-90 transition-opacity"
              title="Share on X / Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded bg-[#0077b5] text-white hover:opacity-90 transition-opacity"
              title="Share on LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1 px-3 py-2 rounded bg-[#efe7d6] dark:bg-[#282117] text-[#1f1a12] dark:text-[#efe5d1] text-xs font-semibold hover:bg-[#c79a2b] hover:text-[#13100c] transition-colors"
              title="Copy Article Link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Link'}</span>
            </button>
          </div>
        </div>

        {/* Featured Cover Image */}
        {article.featuredImage && (
          <figure className="mb-8 rounded-lg overflow-hidden border border-[#e8dfcd] dark:border-[#2a2216]">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full max-h-[500px] object-cover"
            />
            {article.imageCaption && (
              <figcaption className="p-3 bg-[#f7f3ea] dark:bg-[#1a150f] text-xs text-[#8e7d61] dark:text-[#a89679] italic border-t border-[#e8dfcd] dark:border-[#2a2216]">
                {article.imageCaption}
              </figcaption>
            )}
          </figure>
        )}

        {/* Formatted Content */}
        <div
          className="article-content font-editorial-body"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Source Attribution Box */}
        {(article.source || article.sourceUrl) && (
          <div className="mt-10 p-4 bg-[#f7f3ea] dark:bg-[#1a150f] rounded border border-[#e8dfcd] dark:border-[#2a2216] flex items-center justify-between text-xs text-[#8e7d61] dark:text-[#a89679]">
            <div>
              <span className="font-bold text-[#1f1a12] dark:text-[#efe5d1]">Source: </span>
              <span>{article.source || 'Google News Syndication'}</span>
            </div>
            {article.sourceUrl && (
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[#c79a2b] hover:underline font-semibold"
              >
                <span>Original Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}

        {/* Related Articles Section */}
        {related && related.length > 0 && (
          <div className="mt-16 pt-8 border-t-2 border-[#1f1a12] dark:border-[#efe5d1]">
            <h3 className="font-cinzel text-xl font-bold uppercase tracking-wider mb-6">
              Related Coverage &bull; {article.categoryName || article.category}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((item) => (
                <ArticleCard key={item.id} article={item} variant="vertical" showExcerpt={false} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer categories={categories} />
    </div>
  );
}
