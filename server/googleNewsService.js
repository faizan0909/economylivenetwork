import Parser from 'rss-parser';
import { db } from './db.js';

const parser = new Parser({
  customFields: {
    item: [
      ['source', 'sourceName'],
      ['media:content', 'mediaContent']
    ]
  }
});

// Category-specific fallback images from Unsplash (high quality, royalty free)
const CATEGORY_IMAGES = {
  crime: [
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1575517111478-7f6afd0973db?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1200&q=80'
  ],
  politics: [
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1569437061241-a848be43cc82?auto=format&fit=crop&w=1200&q=80'
  ],
  technology: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=80'
  ],
  business: [
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'
  ],
  healthcare: [
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80'
  ],
  sports: [
    'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80'
  ],
  'world-news': [
    'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1200&q=80'
  ],
  'cxo-view': [
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80'
  ],
  default: [
    'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80'
  ]
};

function getRandomImageForCategory(catSlug) {
  const images = CATEGORY_IMAGES[catSlug] || CATEGORY_IMAGES.default;
  return images[Math.floor(Math.random() * images.length)];
}

// Smart keyword categorization heuristics
export function categorizeHeadline(title = '', snippet = '') {
  const text = `${title} ${snippet}`.toLowerCase();

  // Crime keywords
  if (/\b(crime|arrest|arrested|police|cbi|enforcement directorate|ed raids|fir|murder|killed|scam|fraud|smuggling|seized|busted|narcotics|drug|custody|court sentence|convicted|cybercrime|theft|robbery|gangster|investigation|encounter)\b/.test(text)) {
    return 'crime';
  }

  // Technology keywords
  if (/\b(ai|artificial intelligence|tech|technology|software|apple|google|microsoft|nvidia|semiconductor|chip|quantum|cyber|cybersecurity|crypto|gadget|smartphone|metaverse|robot|satellite|isro|nasa)\b/.test(text)) {
    return 'technology';
  }

  // Politics keywords
  if (/\b(politics|political|election|elections|parliament|lok sabha|rajya sabha|bjp|congress|minister|chief minister|pm modi|prime minister|governor|assembly|bill|constitution|supreme court|mla|mp|poll|voting|cabinet)\b/.test(text)) {
    return 'politics';
  }

  // Business keywords
  if (/\b(business|market|stocks|sensex|nifty|gdp|economy|rbi|inflation|ipo|startup|shares|banking|investor|revenue|profit|merger|acquisition|trade|tariff|capex)\b/.test(text)) {
    return 'business';
  }

  // Healthcare keywords
  if (/\b(health|healthcare|medical|hospital|doctor|vaccine|disease|cancer|pharma|pharmaceutical|aiims|who|virus|surgery|therapy|mental health)\b/.test(text)) {
    return 'healthcare';
  }

  // Sports keywords
  if (/\b(cricket|bcci|ipl|football|fifa|olympics|tennis|badminton|match|wicket|tournament|trophy|champion|world cup|stadium)\b/.test(text)) {
    return 'sports';
  }

  // World News keywords
  if (/\b(world|un|united nations|global|us|usa|china|russia|ukraine|israel|middle east|nato|diplomacy|president biden|trump|treaty|embassy)\b/.test(text)) {
    return 'world-news';
  }

  // Executive / CXO / Opinion
  if (/\b(cxo|ceo|leadership|opinion|analysis|editorial|perspective|framework|strategy)\b/.test(text)) {
    return 'cxo-view';
  }

  return 'politics'; // fallback default
}

export class GoogleNewsService {
  /**
   * Fetch RSS feed from Google News
   * @param {Object} options
   * @param {string} options.topic - crime, politics, technology, business, sports, healthcare, world
   * @param {string} options.query - Custom search query
   * @param {string} options.country - Default 'IN'
   * @param {string} options.lang - Default 'en-IN'
   */
  async fetchNews({ topic = '', query = '', country = 'IN', lang = 'en-IN' } = {}) {
    let feedUrl = '';
    const hl = lang;
    const gl = country;
    const ceid = `${country}:${lang.split('-')[0] || 'en'}`;

    if (query && query.trim()) {
      feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query.trim())}&hl=${hl}&gl=${gl}&ceid=${ceid}`;
    } else if (topic) {
      switch (topic.toLowerCase()) {
        case 'crime':
          feedUrl = `https://news.google.com/rss/search?q=crime+OR+police+OR+arrest+OR+investigation&hl=${hl}&gl=${gl}&ceid=${ceid}`;
          break;
        case 'politics':
          feedUrl = `https://news.google.com/rss/headlines/section/topic/NATION?hl=${hl}&gl=${gl}&ceid=${ceid}`;
          break;
        case 'technology':
          feedUrl = `https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=${hl}&gl=${gl}&ceid=${ceid}`;
          break;
        case 'business':
          feedUrl = `https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=${hl}&gl=${gl}&ceid=${ceid}`;
          break;
        case 'sports':
          feedUrl = `https://news.google.com/rss/headlines/section/topic/SPORTS?hl=${hl}&gl=${gl}&ceid=${ceid}`;
          break;
        case 'healthcare':
          feedUrl = `https://news.google.com/rss/headlines/section/topic/HEALTH?hl=${hl}&gl=${gl}&ceid=${ceid}`;
          break;
        case 'world':
        case 'world-news':
          feedUrl = `https://news.google.com/rss/headlines/section/topic/WORLD?hl=${hl}&gl=${gl}&ceid=${ceid}`;
          break;
        case 'entertainment':
          feedUrl = `https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?hl=${hl}&gl=${gl}&ceid=${ceid}`;
          break;
        default:
          feedUrl = `https://news.google.com/rss?hl=${hl}&gl=${gl}&ceid=${ceid}`;
      }
    } else {
      feedUrl = `https://news.google.com/rss?hl=${hl}&gl=${gl}&ceid=${ceid}`;
    }

    try {
      const feed = await parser.parseURL(feedUrl);
      const items = (feed.items || []).map((item, idx) => {
        // Parse Title and clean out source suffix (e.g. "Headline - NDTV")
        let cleanTitle = item.title || 'Untitled News';
        let extractedSource = 'Google News';

        const lastDash = cleanTitle.lastIndexOf(' - ');
        if (lastDash > -1) {
          extractedSource = cleanTitle.substring(lastDash + 3).trim();
          cleanTitle = cleanTitle.substring(0, lastDash).trim();
        }

        // Clean description HTML snippet
        let snippet = (item.contentSnippet || item.content || '').replace(/<[^>]+>/g, '').trim();
        if (snippet.length > 280) {
          snippet = snippet.slice(0, 280) + '...';
        }

        // Auto determine category
        const suggestedCategory = topic && topic !== 'all' ? topic.toLowerCase() : categorizeHeadline(cleanTitle, snippet);

        const categoryObj = db.getCategoryBySlug(suggestedCategory) || db.getCategoryBySlug('politics') || { slug: suggestedCategory, name: suggestedCategory };

        return {
          feedId: `gnews-${idx}-${Date.now()}`,
          title: cleanTitle,
          originalTitle: item.title,
          source: item.sourceName || extractedSource,
          sourceUrl: item.link || '',
          link: item.link || '',
          pubDate: item.pubDate || new Date().toISOString(),
          snippet: snippet || `Coverage on ${cleanTitle} as reported via ${extractedSource}.`,
          suggestedCategory: categoryObj.slug,
          categoryName: categoryObj.name,
          previewImage: getRandomImageForCategory(categoryObj.slug)
        };
      });

      return {
        success: true,
        topic: topic || 'top-stories',
        query: query || null,
        feedUrl,
        count: items.length,
        items
      };
    } catch (err) {
      console.error('Google News fetch error:', err.message);
      throw new Error(`Failed to fetch Google News feed: ${err.message}`);
    }
  }

  /**
   * Convert a Google News item into a stored EconomyLive Network article
   */
  importItem(itemData, targetCategory = null, status = 'published') {
    const categorySlug = targetCategory || itemData.suggestedCategory || 'politics';
    const cat = db.getCategoryBySlug(categorySlug) || { slug: categorySlug, name: categorySlug };

    const excerpt = itemData.snippet || `Latest updates and deep-dive reporting on ${itemData.title}.`;

    // Rich content formatting
    const formattedContent = `<h3>Headline Overview</h3>
<p>${excerpt}</p>
<p>According to dispatches confirmed by <strong>${itemData.source || 'wire services'}</strong>, key stakeholders and observers have highlighted developing implications surrounding this story.</p>
<blockquote>"${itemData.title} represents a major focal point in current public and industry discourse," reports indicated today.</blockquote>
<h3>Key Details & Context</h3>
<p>Further developments are currently emerging as official spokespersons and regulatory authorities coordinate updates on the situation.</p>
<p><em>Originally reported by ${itemData.source || 'Google News'}. Readers can follow live updates through official dispatches.</em></p>`;

    const newArticle = db.createArticle({
      title: itemData.title,
      category: cat.slug,
      categoryName: cat.name,
      excerpt,
      content: formattedContent,
      featuredImage: itemData.previewImage || getRandomImageForCategory(cat.slug),
      imageCaption: `${itemData.title} (Via ${itemData.source || 'Google News'})`,
      author: `${itemData.source || 'News Desk'}`,
      authorRole: 'Aggregated via Google News',
      source: itemData.source || 'Google News',
      sourceUrl: itemData.link || itemData.sourceUrl || '',
      isBreaking: Boolean(itemData.isBreaking),
      isFeatured: Boolean(itemData.isFeatured),
      status: status,
      publishedAt: itemData.pubDate ? new Date(itemData.pubDate).toISOString() : new Date().toISOString()
    });

    return newArticle;
  }

  /**
   * Batch import multiple Google News items
   */
  importBatch(items = [], targetCategory = null, status = 'published') {
    const imported = [];
    for (const item of items) {
      try {
        const article = this.importItem(item, targetCategory, status);
        imported.push(article);
      } catch (err) {
        console.error('Batch import item error:', err.message);
      }
    }
    return imported;
  }
}

export const googleNewsService = new GoogleNewsService();
