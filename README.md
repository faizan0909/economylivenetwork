# ECONOMYLIVE NETWORK &bull; Digital News Platform

An independent digital news portal and media management system for **EconomyLive Network**. The platform includes a news frontpage, an editorial admin CMS, and a real-time **Google News Syndication Engine** with automated categorization (Crime, Politics, Technology, Business, Sports, Healthcare, World News, etc.).

---

## 🌟 Highlights & Key Features

### 1. Audience Portal (Frontpage & Reader Mode)
- **Classic Editorial Masthead & Typography**: Styled with warm gold accents (`#c79a2b`), deep ink sepia (`#1f1a12`), cream parchment tones, and serif headline fonts.
- **Top Utility Bar**: Displays current date (`Edition: Digital`), fast search launcher, **Dark / Light theme switcher**, and Admin login link.
- **Breaking News Marquee Ticker**: Continuous animated ticker track with red breaking beacon and live headline dispatches.
- **Spotlight Hero Grid**: Flagship featured story display paired with a 3-article mosaic stack.
- **Categorized News Feed & Showcases**: Dedicated sections for:
  - **Crime & Investigative Desk**
  - **Technology, AI & Quantum Innovations**
  - **Politics & National Governance**
  - **Business, Markets & Economy**
  - **Healthcare & Biomedical**
- **Sidebar**:
  - Trending / Most Read ranking (01 to 05)
  - Google News Live Aggregator widget
  - Category Desks topic cloud
  - Newsletter subscription box
- **Article Reader Page**:
  - **Sticky Reading Progress Bar** along the top of the browser
  - Breadcrumbs navigation
  - Large headline, standfirst excerpt, author byline, read time, and view count
  - Social share buttons (WhatsApp, Twitter/X, LinkedIn, Copy Link)
  - Hero image with editorial caption
  - Rich HTML article typography with quotes, section headings, and bullet points
  - Original source attribution badge
  - Related coverage grid
- **Category Archive Pages**: Dedicated URLs (e.g. `/category/crime`, `/category/technology`, `/category/politics`) with sort toggle (Latest vs Most Viewed).
- **Archive Search**: Real-time keyword search across headlines, excerpts, and content.

---

### 2. Editorial Admin Panel
- **Secure Authentication**: Protected dashboard routes with token verification.
- **Default Admin Credentials**:
  - **Email**: `admin@economylivenetwork.com`
  - **Password**: `admin123`
  - *(Auto-fill shortcut available on the login screen)*
- **Command Center Dashboard**:
  - Real-time statistics: Total published articles, drafts in queue, overall views, active categories, breaking alerts.
  - Desk distribution breakdown with visual progress bars.
  - Recent articles table with quick actions.
- **Article Manager**:
  - Filter by category desk, publication status (Published / Draft), or keyword.
  - One-click toggles for "Breaking News" and "Published / Draft".
  - Edit and delete actions.
- **Rich Article Composer**:
  - Headline input with auto-generated URL slugs.
  - Category desk selector.
  - Excerpt / standfirst field.
  - Featured image URL with live preview + **One-click high-res photo presets** for Crime, Politics, Tech, Business, and Healthcare.
  - Rich formatting toolbar: H2, H3, Bold, Italic, Blockquote, Bullet list, Paragraphs.
  - Broadcast toggles: "Mark as Breaking News" (appears on top ticker) & "Feature in Spotlight Hero".
- **Category Desk Manager**:
  - View all existing beats with color badges and live article counts.
  - Create new categories on the fly with custom colors and descriptions.
  - Edit or remove categories.
- **Portal & Security Settings**:
  - Modify site name, tagline, and default author byline.
  - Enable or disable the breaking news ticker.
  - Update admin password.

---

### 3. Google News Real-Time Syndication Engine
- **Predefined Beat Selectors**:
  - **Crime Desk**: Pulls dispatches regarding law enforcement, cyber crime, court trials, and investigations.
  - **Politics & Nation**: Pulls parliamentary debates, elections, and national policies.
  - **Technology & AI**: Pulls artificial intelligence, semiconductors, quantum computing, and cybersecurity stories.
  - **Business & Economy**: Pulls markets, GDP, and financial updates.
  - **Healthcare & Science**: Pulls medical breakthroughs and public health news.
  - **Sports Arena**: Pulls international tournament and sports updates.
  - **World Geopolitics**: Pulls global headlines and diplomatic dispatches.
  - **Custom Search**: Enter any keyword (e.g. *"Artificial Intelligence"*, *"Kolkata"*, *"SpaceX"*).
- **Auto-Categorization**: Intelligent heuristic analyzes story titles and summaries to automatically recommend the correct desk.
- **Desk Re-assignment**: Admin can reassign any story to Crime, Politics, Technology, etc. using a simple dropdown.
- **1-Click Import**:
  - "Publish" imports the story immediately as a live article with high-resolution imagery and formatted sections.
  - "Draft" saves it to the queue for further editorial review.
- **Batch Ingestion**: One button imports the top 10 Google News stories directly into your chosen category desk.

---

## 🚀 Getting Started

### 1. Run the Full Application (Single Command)
From the project root (`e:\News Hai`):

```bash
npm start
```

This starts the unified Express backend and serves the frontend on:
👉 **`http://localhost:5000`**

- **Public Audience Frontpage**: `http://localhost:5000/`
- **Admin Login**: `http://localhost:5000/admin/login`
- **Google News Ingestion Engine**: `http://localhost:5000/admin/google-news`

---

### 2. Run in Development Mode (Hot Reload)
If you wish to run the client and backend separately with Vite hot module replacement (HMR):

**Terminal 1 (Backend Server):**
```bash
cd server
npm start
```
*(Runs on `http://localhost:5000`)*

**Terminal 2 (Client with Vite HMR):**
```bash
cd client
npm run dev
```
*(Runs on `http://localhost:5173` with automatic API proxying to port 5000)*

---

### 3. Rebuilding the Frontend
If you make UI changes to the React frontend:

```bash
npm run build
```
*(Generates optimized assets into `client/dist/` in ~7 seconds)*

---

## 🗄️ Database & Storage
- Data is safely stored in atomic file storage at `server/data/db.json`.
- Zero configuration, zero external database setup required, and completely portable across any OS.
- Pre-seeded with realistic articles across Crime, Politics, Technology, Business, and Healthcare.
