import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Moon, Sun, ShieldCheck, Menu, X, Newspaper, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function Header({ categories = [] }) {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Format today's date
  const today = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  return (
    <header className="w-full bg-[#fcfaf6] dark:bg-[#13100c] border-b border-[#e8dfcd] dark:border-[#2d261b] transition-colors">
      {/* 1. Utility Top Bar */}
      <div className="border-b border-[#efe7d6] dark:border-[#241e15] text-xs py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-[#8e7d61] dark:text-[#a89679] font-medium tracking-wide">
            {today} &bull; <span className="text-[#c79a2b] font-semibold">EDITION: DIGITAL</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex items-center gap-1.5 text-[#5c4f3a] dark:text-[#c5b59a] hover:text-[#c79a2b] dark:hover:text-[#c79a2b] transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search</span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 text-[#5c4f3a] dark:text-[#c5b59a] hover:text-[#c79a2b] dark:hover:text-[#c79a2b] transition-colors cursor-pointer"
              title="Toggle color theme"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#c79a2b]" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5" />
                  <span>Dark</span>
                </>
              )}
            </button>

            {/* Admin / Login */}
            {isAuthenticated ? (
              <Link
                to="/admin"
                className="flex items-center gap-1 font-semibold text-[#c79a2b] hover:underline"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin ({user?.name?.split(' ')[0] || 'Panel'})</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="text-[#5c4f3a] dark:text-[#c5b59a] hover:text-[#c79a2b] dark:hover:text-[#c79a2b] font-medium transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Search Drawer */}
      {searchOpen && (
        <div className="bg-[#f7f3ea] dark:bg-[#1a150f] border-b border-[#e8dfcd] dark:border-[#2d261b] py-3 px-4 sm:px-8 animate-fadeIn">
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8e7d61]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles across Crime, Politics, Technology..."
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#13100c] border border-[#d8cdb8] dark:border-[#382f22] rounded text-sm focus:outline-none focus:border-[#c79a2b] text-[#1f1a12] dark:text-[#efe5d1]"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-[#c79a2b] hover:bg-[#b08722] text-[#13100c] font-semibold text-xs uppercase tracking-wider rounded transition-colors"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="p-2 text-[#8e7d61] hover:text-[#1f1a12] dark:hover:text-[#efe5d1]"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* 2. Main Brand Masthead */}
      <div className="py-6 sm:py-8 px-4 sm:px-8 text-center border-b border-[#efe7d6] dark:border-[#241e15]">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <Link to="/" className="group inline-flex flex-col items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#c79a2b] flex items-center justify-center text-[#13100c] shadow-sm">
                <Newspaper className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-cinzel text-[#1f1a12] dark:text-[#efe5d1] group-hover:text-[#c79a2b] transition-colors">
                ECONOMYLIVE NETWORK
              </h1>
            </div>
            <p className="mt-1.5 text-xs sm:text-sm uppercase tracking-widest text-[#8e7d61] dark:text-[#a89679] font-medium">
              Independent Digital News &bull; Investigations &bull; Perspectives
            </p>
          </Link>
        </div>
      </div>

      {/* 3. Mega Navigation Bar */}
      <nav className="relative max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between">
          {/* Desktop Categories */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2 overflow-x-auto py-2.5 text-sm font-semibold tracking-wide">
            <Link
              to="/"
              className="px-3 py-1.5 rounded text-[#1f1a12] dark:text-[#efe5d1] hover:text-[#c79a2b] dark:hover:text-[#c79a2b] transition-colors"
            >
              Home
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id || cat.slug}
                to={`/category/${cat.slug}`}
                className="px-3 py-1.5 rounded text-[#4a3718] dark:text-[#dac99b] hover:text-[#c79a2b] dark:hover:text-[#c79a2b] transition-colors whitespace-nowrap"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center justify-between w-full py-2.5">
            <span className="text-xs uppercase tracking-wider font-bold text-[#8e7d61]">
              Browse Sections
            </span>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-[#1f1a12] dark:text-[#efe5d1] border border-[#d8cdb8] dark:border-[#382f22] rounded"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#efe7d6] dark:border-[#241e15] py-3 bg-[#f7f3ea] dark:bg-[#1a150f] px-2 space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded text-sm font-bold text-[#1f1a12] dark:text-[#efe5d1] hover:bg-[#efe7d6] dark:hover:bg-[#282117]"
            >
              Home
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id || cat.slug}
                to={`/category/${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded text-sm font-medium text-[#4a3718] dark:text-[#dac99b] hover:bg-[#efe7d6] dark:hover:bg-[#282117]"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
