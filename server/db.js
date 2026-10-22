import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'data', 'db.json');

// Ensure data folder exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initial seed categories
const DEFAULT_CATEGORIES = [
  { id: 'cat-1', name: 'Crime', slug: 'crime', color: '#dc2626', description: 'Investigative reporting, law enforcement, forensic updates, and court trials' },
  { id: 'cat-2', name: 'Politics', slug: 'politics', color: '#2563eb', description: 'National governance, election developments, policies, and parliament debates' },
  { id: 'cat-3', name: 'Technology', slug: 'technology', color: '#059669', description: 'Artificial Intelligence, cybersecurity, gadgets, software, and tech innovations' },
  { id: 'cat-4', name: 'Business', slug: 'business', color: '#d97706', description: 'Markets, corporate shifts, economy, venture capital, and startups' },
  { id: 'cat-5', name: 'Healthcare', slug: 'healthcare', color: '#0891b2', description: 'Medical research, public health policy, wellness, and biotech breakthroughs' },
  { id: 'cat-6', name: 'Sports', slug: 'sports', color: '#ea580c', description: 'Cricket, football, international tournaments, and sports analytics' },
  { id: 'cat-7', name: 'CXO View', slug: 'cxo-view', color: '#7c3aed', description: 'Executive perspectives, industry leadership, and op-eds' },
  { id: 'cat-8', name: 'World News', slug: 'world-news', color: '#475569', description: 'Geopolitics, diplomatic affairs, and global dispatches' }
];

// Initial seed articles (high-quality editorial content matching EconomyLive Network tone)
const DEFAULT_ARTICLES = [
  {
    id: 'art-1',
    title: 'Supreme Court Sets Landmark Guidelines for Digital Forensics and Cyber Evidence in Criminal Trials',
    slug: 'supreme-court-sets-landmark-guidelines-digital-forensics-cyber-evidence',
    category: 'crime',
    categoryName: 'Crime',
    excerpt: 'A historic bench delivers comprehensive safeguards for electronic seizure, data integrity, and chain-of-custody protocols in major white-collar and cyber investigations.',
    content: `<h3>New Standards for Digital Integrity</h3>
<p>In a landmark judgment delivered today, the Supreme Court established rigorous pan-national guidelines governing how digital storage devices, encrypted communicators, and cloud server archives are retrieved and tendered into trial evidence.</p>
<p>The three-judge constitutional bench underscored that with criminal enterprises increasingly pivoting to encrypted networks and distributed ledger fraud, investigative agencies must maintain an unimpeachable hash record from the precise moment of physical seizure.</p>
<blockquote>"The presumption of guilt cannot bypass the scientific sanctity of chain of custody. When digital fingerprints are corrupted by procedural negligence, both the innocent and society lose," the Chief Justice noted in the majority opinion.</blockquote>
<h3>Key Directives for Law Enforcement</h3>
<p>Under the new judicial protocol:</p>
<ul>
  <li>Independent civilian witnesses must observe the write-blocking and bit-stream cryptographic duplication of all digital drives.</li>
  <li>Custodial forensics logs must be uploaded onto an immutable centralized evidence ledger within 24 hours of seizure.</li>
  <li>Defendants must receive unredacted mirror clones within forty-five days of formal chargesheet filing.</li>
</ul>
<p>Cyber law scholars have welcomed the judgment as a vital leap forward in bridging 21st-century cyber forensics with fundamental constitutional liberties.</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Supreme Court directives mandate cryptographic verification during criminal digital seizures.',
    author: 'Rajesh Mukherjee',
    authorRole: 'Legal Affairs Bureau',
    source: 'EconomyLive Investigative Desk',
    sourceUrl: '',
    isBreaking: true,
    isFeatured: true,
    status: 'published',
    views: 4890,
    readTime: '4 min read',
    publishedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    createdAt: new Date().toISOString()
  },
  {
    id: 'art-2',
    title: 'Next-Gen Quantum Microarchitectures Unveiled: Indian Tech Consortia Leap Ahead in Sub-2nm Supercomputing',
    slug: 'next-gen-quantum-microarchitectures-unveiled-sub-2nm-supercomputing',
    category: 'technology',
    categoryName: 'Technology',
    excerpt: 'Indigenous semiconductor alliances demonstrate working topological qubit nodes with record coherence lifetimes, positioning the nation in sovereign quantum computing supremacy.',
    content: `<h3>A Quantum Leap in Silicon Design</h3>
<p>A premier alliance of deep-tech engineering labs and premier tech institutes today revealed breakthrough topological qubit architectures that exhibit thermal stability three orders of magnitude superior to legacy superconducting qubits.</p>
<p>The consortium demonstrated real-time error-mitigated mathematical modeling executed on a hybrid 64-qubit crystalline coprocessor, designed completely within national research laboratories.</p>
<h3>Strategic Industrial Impact</h3>
<p>The breakthrough holds immense strategic value for cryptography, high-efficiency battery chemistry simulation, and distributed algorithmic trading. Commercial scale foundry deployment is scheduled to commence at specialized semiconductor hubs by late 2027.</p>
<p>Dr. Arvind Swaminathan, Lead Research Director, remarked that the platform sidesteps cryogenic dilution dependencies, permitting edge-deployment in specialized data centers.</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Next-generation quantum coprocessor microarchitectures running topological error correction.',
    author: 'Sunita Rao',
    authorRole: 'Technology Correspondent',
    source: 'EconomyLive Tech Bureau',
    sourceUrl: '',
    isBreaking: false,
    isFeatured: true,
    status: 'published',
    views: 3420,
    readTime: '5 min read',
    publishedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    createdAt: new Date().toISOString()
  },
  {
    id: 'art-3',
    title: 'Electoral Reform Bill Sparks Fiery Debate on Campaign Finance Transparency and Digital Ads',
    slug: 'electoral-reform-bill-sparks-fiery-debate-campaign-finance-digital-ads',
    category: 'politics',
    categoryName: 'Politics',
    excerpt: 'Lawmakers engage in intense parliamentary deliberations over mandatory real-time reporting of political donations and AI-generated campaign advertising disclosures.',
    content: `<h3>High-Stakes Deliberations in the House</h3>
<p>A heated debate unfolded on the floor of the legislature this morning as lawmakers scrutinized the omnibus Representation and Transparency Bill.</p>
<p>At the center of contention is a mandate requiring all registered political parties to maintain an algorithmic public register of digital advertising expenditures, micro-targeting parameters, and donor declarations updated every seventy-two hours during active campaign cycles.</p>
<h3>Cross-Party Perspectives</h3>
<p>Proponents maintain that deepfake technology and opaque dark-money digital spending represent existential threats to genuine voter franchise. Conversely, opposition benches argued that instantaneous expenditure tracking introduces onerous logistical hurdles for regional grassroot candidates.</p>
<p>The parliamentary standing committee has been granted an additional fortnight to reconcile disputed clauses prior to a final vote.</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Parliamentary deliberations over the Electoral Transparency and Digital Campaigning Bill.',
    author: 'Vikram Sengupta',
    authorRole: 'Chief Political Editor',
    source: 'National Bureau',
    sourceUrl: '',
    isBreaking: true,
    isFeatured: true,
    status: 'published',
    views: 2980,
    readTime: '6 min read',
    publishedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: 'art-4',
    title: 'Central Enforcement Directorate Busts Multi-State Crypto Laundering Syndicate Operating via Fake Invoicing',
    slug: 'ed-busts-multi-state-crypto-laundering-syndicate-fake-invoicing',
    category: 'crime',
    categoryName: 'Crime',
    excerpt: 'Coordinated raids across twenty-two locations uncover an illicit remittance network that funneled over 1,400 crores through shell export corporations and decentralized mixers.',
    content: `<h3>Synchronized Pan-India Raids</h3>
<p>In a pre-dawn operation spanning seven metropolises, federal financial crime investigators dismantled an elaborate illicit remittance conduit that laundered illicit proceeds through cryptocurrency mixers and fabricated trade invoices.</p>
<p>Officials seized over four hundred mobile handsets, hardware cold wallets containing millions in stablecoins, and stamp registers belonging to forty-eight non-operational export entities.</p>
<h3>Modus Operandi Unveiled</h3>
<p>According to probe officers, the network utilized fictitious freight forwarders to generate over-invoiced trade bills, simultaneously converting physical cash deposits into anonymous cross-border tokens routed through non-KYC peer-to-peer accounts.</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Financial crime enforcement teams execute coordinated raids on illicit crypto remittance hubs.',
    author: 'Ananya Sharma',
    authorRole: 'Crime & Security Desk',
    source: 'EconomyLive Crime Desk',
    sourceUrl: '',
    isBreaking: false,
    isFeatured: false,
    status: 'published',
    views: 2150,
    readTime: '4 min read',
    publishedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: 'art-5',
    title: 'RBI Signals Cautious Rate Trajectory Amid Resilient Capital Goods Growth and Global Energy Fluctuations',
    slug: 'rbi-signals-cautious-rate-trajectory-resilient-capital-goods-growth',
    category: 'business',
    categoryName: 'Business',
    excerpt: 'Monetary policy committee maintains benchmark repo rates while projecting robust 7.2% annual GDP momentum backed by private infrastructure capex.',
    content: `<h3>Monetary Policy Consensus</h3>
<p>The Reserve Bank monetary committee concluded its bi-monthly review today by keeping policy rates steady, emphasizing that domestic economic resilience provides strategic breathing room amidst volatile crude imports.</p>
<p>Governor highlighted sustained double-digit expansion across core infrastructure segments, manufacturing credit disbursements, and freight turnover metrics.</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Central bank monetary policy statement charts path for fiscal balance and investment stimulus.',
    author: 'Pradeep Mehra',
    authorRole: 'Senior Economics Analyst',
    source: 'Financial Markets Desk',
    sourceUrl: '',
    isBreaking: false,
    isFeatured: false,
    status: 'published',
    views: 1870,
    readTime: '3 min read',
    publishedAt: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: 'art-6',
    title: 'Precision Healthcare in India Depends on Smarter Medical Equipment Management: CXO Viewpoint',
    slug: 'precision-healthcare-india-depends-smarter-medical-equipment-management',
    category: 'healthcare',
    categoryName: 'Healthcare',
    excerpt: 'Hospital leaders and biomedical directors analyze how IoT sensor integration and AI-driven maintenance prevent critical ICU equipment downtimes.',
    content: `<h3>The Lifeline of Modern Critical Care</h3>
<p>Modern clinical outcomes depend critically on the uninterrupted calibration of diagnostic scanners, extracorporeal oxygenators, and neonatal monitoring arrays.</p>
<p>Leading hospital executives share insights on how adopting predictive maintenance and standardized asset traceability systems is saving lives while slashing operational expenses across tier-2 and tier-3 healthcare networks.</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Advanced diagnostic suites leveraging IoT diagnostics for medical equipment uptime.',
    author: 'Dr. Debabrata Roy',
    authorRole: 'Healthcare Contributor',
    source: 'EconomyLive Healthcare',
    sourceUrl: '',
    isBreaking: false,
    isFeatured: false,
    status: 'published',
    views: 1540,
    readTime: '5 min read',
    publishedAt: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
    createdAt: new Date().toISOString()
  }
];

// Initial default settings
const DEFAULT_SETTINGS = {
  siteName: 'ECONOMYLIVE NETWORK',
  siteTagline: 'Independent Digital News & Media',
  breakingTickerEnabled: true,
  breakingTickerCustomText: '',
  logoText: 'ECONOMYLIVE NETWORK',
  logoIcon: 'newspaper',
  accentColor: '#c79a2b',
  primaryColor: '#1f1a12',
  defaultAuthor: 'Editorial Desk',
  googleNewsCountry: 'IN',
  googleNewsLanguage: 'en-IN',
  autoSyncGoogleNews: false
};

// Initial admin credentials (password: admin123)
const salt = bcrypt.genSaltSync(10);
const DEFAULT_USERS = [
  {
    id: 'user-admin',
    username: 'admin',
    email: 'admin@economylivenetwork.com',
    passwordHash: bcrypt.hashSync('admin123', salt),
    name: 'Chief Editor',
    role: 'superadmin',
    createdAt: new Date().toISOString()
  }
];

class Database {
  constructor() {
    this.data = {
      users: DEFAULT_USERS,
      categories: DEFAULT_CATEGORIES,
      articles: DEFAULT_ARTICLES,
      settings: DEFAULT_SETTINGS,
      googleNewsHistory: []
    };
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data = {
          users: parsed.users || DEFAULT_USERS,
          categories: parsed.categories || DEFAULT_CATEGORIES,
          articles: parsed.articles || DEFAULT_ARTICLES,
          settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
          googleNewsHistory: parsed.googleNewsHistory || []
        };
      } else {
        this.save();
      }
    } catch (err) {
      console.error('Error loading DB file, reinitializing with defaults:', err.message);
      this.save();
    }
  }

  save() {
    try {
      const tempPath = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('Failed to save DB file:', err.message);
    }
  }

  // --- Article Methods ---
  getArticles({ category, status, search, limit = 50, page = 1, isFeatured, isBreaking, sort = 'publishedAt' } = {}) {
    let result = [...this.data.articles];

    if (category && category !== 'all') {
      const catLower = category.toLowerCase();
      result = result.filter(a => (a.category && a.category.toLowerCase() === catLower) || (a.categoryName && a.categoryName.toLowerCase() === catLower));
    }

    if (status) {
      result = result.filter(a => a.status === status);
    }

    if (isFeatured !== undefined) {
      result = result.filter(a => a.isFeatured === (isFeatured === 'true' || isFeatured === true));
    }

    if (isBreaking !== undefined) {
      result = result.filter(a => a.isBreaking === (isBreaking === 'true' || isBreaking === true));
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(a => 
        (a.title && a.title.toLowerCase().includes(q)) ||
        (a.excerpt && a.excerpt.toLowerCase().includes(q)) ||
        (a.content && a.content.toLowerCase().includes(q)) ||
        (a.author && a.author.toLowerCase().includes(q))
      );
    }

    // Sort by publishedAt or views descending
    result.sort((a, b) => {
      if (sort === 'views') {
        return (b.views || 0) - (a.views || 0);
      }
      return new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt);
    });

    const total = result.length;
    const startIndex = (page - 1) * limit;
    const items = result.slice(startIndex, startIndex + limit);

    return { items, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) };
  }

  getArticleBySlug(slug) {
    return this.data.articles.find(a => a.slug === slug);
  }

  getArticleById(id) {
    return this.data.articles.find(a => a.id === id);
  }

  createArticle(data) {
    const slugBase = (data.slug || data.title || 'news-article')
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    let slug = slugBase;
    let counter = 1;
    while (this.data.articles.some(a => a.slug === slug)) {
      slug = `${slugBase}-${counter++}`;
    }

    const matchedCategory = this.data.categories.find(c => c.slug === (data.category || '').toLowerCase() || c.name.toLowerCase() === (data.category || '').toLowerCase());

    const article = {
      id: `art-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: data.title || 'Untitled Article',
      slug,
      category: matchedCategory ? matchedCategory.slug : (data.category || 'news').toLowerCase(),
      categoryName: matchedCategory ? matchedCategory.name : (data.categoryName || data.category || 'News'),
      excerpt: data.excerpt || '',
      content: data.content || '',
      featuredImage: data.featuredImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
      imageCaption: data.imageCaption || '',
      author: data.author || this.data.settings.defaultAuthor || 'Editorial Desk',
      authorRole: data.authorRole || 'Editorial Contributor',
      source: data.source || 'EconomyLive Network',
      sourceUrl: data.sourceUrl || '',
      isBreaking: Boolean(data.isBreaking),
      isFeatured: Boolean(data.isFeatured),
      status: data.status || 'published',
      views: data.views || 0,
      readTime: data.readTime || `${Math.max(1, Math.round(((data.content || '').split(/\s+/).length) / 200))} min read`,
      publishedAt: data.status === 'published' ? (data.publishedAt || new Date().toISOString()) : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data.articles.unshift(article);
    this.save();
    return article;
  }

  updateArticle(id, updates) {
    const index = this.data.articles.findIndex(a => a.id === id);
    if (index === -1) return null;

    const existing = this.data.articles[index];

    let category = existing.category;
    let categoryName = existing.categoryName;
    if (updates.category) {
      const matched = this.data.categories.find(c => c.slug === updates.category.toLowerCase() || c.name.toLowerCase() === updates.category.toLowerCase());
      if (matched) {
        category = matched.slug;
        categoryName = matched.name;
      } else {
        category = updates.category.toLowerCase();
        categoryName = updates.categoryName || updates.category;
      }
    }

    const updated = {
      ...existing,
      ...updates,
      category,
      categoryName,
      updatedAt: new Date().toISOString()
    };

    // If changing from draft to published and publishedAt is null
    if (updates.status === 'published' && !existing.publishedAt) {
      updated.publishedAt = new Date().toISOString();
    }

    this.data.articles[index] = updated;
    this.save();
    return updated;
  }

  deleteArticle(id) {
    const prevLen = this.data.articles.length;
    this.data.articles = this.data.articles.filter(a => a.id !== id);
    if (this.data.articles.length !== prevLen) {
      this.save();
      return true;
    }
    return false;
  }

  incrementViews(id) {
    const article = this.data.articles.find(a => a.id === id || a.slug === id);
    if (article) {
      article.views = (article.views || 0) + 1;
      this.save();
      return article.views;
    }
    return 0;
  }

  // --- Category Methods ---
  getCategories() {
    // Add count of articles for each category
    return this.data.categories.map(cat => {
      const count = this.data.articles.filter(a => a.category === cat.slug && a.status === 'published').length;
      return { ...cat, articleCount: count };
    });
  }

  getCategoryBySlug(slug) {
    return this.data.categories.find(c => c.slug === slug.toLowerCase());
  }

  createCategory(data) {
    const slug = (data.slug || data.name || '')
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (this.data.categories.some(c => c.slug === slug)) {
      throw new Error(`Category with slug '${slug}' already exists`);
    }

    const category = {
      id: `cat-${Date.now()}`,
      name: data.name.trim(),
      slug,
      color: data.color || '#c79a2b',
      description: data.description || ''
    };

    this.data.categories.push(category);
    this.save();
    return category;
  }

  updateCategory(id, updates) {
    const index = this.data.categories.findIndex(c => c.id === id || c.slug === id);
    if (index === -1) return null;

    const existing = this.data.categories[index];
    const updated = {
      ...existing,
      ...updates,
      id: existing.id
    };

    this.data.categories[index] = updated;
    this.save();
    return updated;
  }

  deleteCategory(id) {
    const prevLen = this.data.categories.length;
    this.data.categories = this.data.categories.filter(c => c.id !== id && c.slug !== id);
    if (this.data.categories.length !== prevLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- User / Auth Methods ---
  getUserByEmail(email) {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase() || u.username.toLowerCase() === email.toLowerCase());
  }

  getUserById(id) {
    return this.data.users.find(u => u.id === id);
  }

  updateUserPassword(id, newPassword) {
    const user = this.data.users.find(u => u.id === id);
    if (!user) return false;
    const salt = bcrypt.genSaltSync(10);
    user.passwordHash = bcrypt.hashSync(newPassword, salt);
    this.save();
    return true;
  }

  updateUserProfile(id, updates) {
    const user = this.data.users.find(u => u.id === id);
    if (!user) return null;
    if (updates.name) user.name = updates.name;
    if (updates.email) user.email = updates.email;
    if (updates.username) user.username = updates.username;
    this.save();
    return user;
  }

  // --- Settings Methods ---
  getSettings() {
    return this.data.settings;
  }

  updateSettings(updates) {
    this.data.settings = { ...this.data.settings, ...updates };
    this.save();
    return this.data.settings;
  }

  // --- Stats ---
  getStats() {
    const totalArticles = this.data.articles.length;
    const publishedCount = this.data.articles.filter(a => a.status === 'published').length;
    const draftCount = this.data.articles.filter(a => a.status === 'draft').length;
    const breakingCount = this.data.articles.filter(a => a.isBreaking && a.status === 'published').length;
    const totalViews = this.data.articles.reduce((acc, a) => acc + (a.views || 0), 0);

    const categoryBreakdown = this.data.categories.map(cat => ({
      name: cat.name,
      slug: cat.slug,
      color: cat.color,
      count: this.data.articles.filter(a => a.category === cat.slug).length
    }));

    return {
      totalArticles,
      publishedCount,
      draftCount,
      breakingCount,
      totalViews,
      totalCategories: this.data.categories.length,
      categoryBreakdown
    };
  }
}

export const db = new Database();
