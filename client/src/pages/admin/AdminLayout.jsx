import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  FolderTree,
  Radio,
  Settings,
  LogOut,
  ExternalLink,
  Newspaper,
  User,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#18140f] flex items-center justify-center text-[#c79a2b]">
        Loading Admin Session...
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate('/admin/login');
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Articles', path: '/admin/articles', icon: FileText },
    { name: 'Write Article', path: '/admin/articles/new', icon: PlusCircle },
    { name: 'Categories', path: '/admin/categories', icon: FolderTree },
    { name: 'Google News Fetcher', path: '/admin/google-news', icon: Radio, highlight: true },
    { name: 'Site Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#18140f] text-[#efe5d1] flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#211b14] border-b border-[#30281b]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#c79a2b] flex items-center justify-center text-[#13100c]">
            <Newspaper className="w-5 h-5" />
          </div>
          <span className="font-cinzel font-bold text-sm text-white">
            ECONOMYLIVE ADMIN
          </span>
        </div>
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-1.5 text-[#efe5d1] border border-[#3d3222] rounded"
        >
          {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        ${mobileNavOpen ? 'block' : 'hidden'} md:block
        w-full md:w-64 bg-[#211b14] border-r border-[#30281b] flex flex-col shrink-0 md:min-h-screen
      `}>
        {/* Brand */}
        <div className="p-6 border-b border-[#30281b]">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full bg-[#c79a2b] flex items-center justify-center text-[#13100c] shadow">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <span className="font-cinzel text-sm font-extrabold tracking-wider text-white block group-hover:text-[#c79a2b] transition-colors">
                ECONOMYLIVE
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#c79a2b] font-bold block">
                Editorial Suite
              </span>
            </div>
          </Link>

          <Link
            to="/"
            target="_blank"
            className="mt-4 flex items-center justify-between text-xs text-[#a89679] hover:text-[#c79a2b] bg-[#18140f] border border-[#30281b] px-3 py-1.5 rounded transition-colors"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 flex-1 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path || (link.path !== '/admin' && location.pathname.startsWith(link.path) && link.path !== '/admin/articles/new');

            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileNavOpen(false)}
                className={`
                  flex items-center justify-between px-3.5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider transition-all
                  ${isActive
                    ? 'bg-[#c79a2b] text-[#13100c] shadow-md font-bold'
                    : 'text-[#c5b59a] hover:bg-[#2b2319] hover:text-[#efe5d1]'
                  }
                  ${link.highlight && !isActive ? 'border border-[#c79a2b]/40 text-[#c79a2b]' : ''}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </div>
                {link.highlight && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase ${isActive ? 'bg-[#13100c] text-[#c79a2b]' : 'bg-[#c79a2b] text-[#13100c]'}`}>
                    Live
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Current User & Logout */}
        <div className="p-4 border-t border-[#30281b] bg-[#1c1610]">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#382f22] border border-[#524430] flex items-center justify-center text-[#c79a2b]">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-white block truncate">
                {user?.name || 'Administrator'}
              </span>
              <span className="text-[10px] text-[#8e7d61] block truncate">
                {user?.email || 'admin'}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded border border-red-900/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-[#18140f] overflow-y-auto min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
