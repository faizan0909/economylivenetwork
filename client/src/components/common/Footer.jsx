import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Send, CheckCircle2 } from 'lucide-react';

export default function Footer({ categories = [] }) {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#18140f] text-[#efe5d1] border-t-4 border-[#c79a2b] mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand & About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#c79a2b] flex items-center justify-center text-[#13100c]">
                <Newspaper className="w-5 h-5" />
              </div>
              <span className="font-cinzel text-xl font-bold tracking-wider text-white">
                ECONOMYLIVE NETWORK
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#a89679] leading-relaxed">
              Delivering fearless independent journalism, real-time breaking dispatches, high-impact legal analyses, and technological intelligence.
            </p>
            <div className="pt-2 text-xs text-[#786a52]">
              Standard of Excellence in Digital Reporting &bull; Updated 24/7
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h3 className="font-cinzel text-sm font-bold tracking-wider uppercase text-[#c79a2b] mb-4">
              News Desks
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              {categories.slice(0, 7).map((cat) => (
                <li key={cat.id || cat.slug}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="text-[#c5b59a] hover:text-[#c79a2b] transition-colors flex items-center justify-between"
                  >
                    <span>{cat.name}</span>
                    {cat.articleCount !== undefined && (
                      <span className="text-[10px] text-[#786a52]">({cat.articleCount})</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h3 className="font-cinzel text-sm font-bold tracking-wider uppercase text-[#c79a2b] mb-4">
              Information
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#c5b59a]">
              <li>
                <Link to="/about" className="hover:text-[#c79a2b] transition-colors">
                  About EconomyLive Network
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-[#c79a2b] transition-colors">
                  Search Archives
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#c79a2b] transition-colors">
                  Editorial Admin Panel
                </Link>
              </li>
              <li>
                <span className="text-[#786a52] cursor-not-allowed">Privacy Policy</span>
              </li>
              <li>
                <span className="text-[#786a52] cursor-not-allowed">Terms of Service</span>
              </li>
              <li>
                <span className="text-[#786a52] cursor-not-allowed">Google News Syndication</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h3 className="font-cinzel text-sm font-bold tracking-wider uppercase text-[#c79a2b] mb-4">
              Editorial Dispatch
            </h3>
            <p className="text-xs text-[#a89679] mb-3 leading-relaxed">
              Receive top investigative stories, technology breakthroughs, and national bulletins directly in your inbox.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs text-green-400 bg-green-950/40 p-3 rounded border border-green-800">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Thank you! You are subscribed to our daily dispatch.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full px-3 py-2 bg-[#241e16] border border-[#3d3222] text-xs text-white rounded focus:outline-none focus:border-[#c79a2b]"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-[#c79a2b] hover:bg-[#b08722] text-[#13100c] text-xs uppercase font-bold tracking-wider rounded transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Subscribe Free</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#262015] flex flex-col sm:flex-row items-center justify-between text-xs text-[#8e7d61] gap-4">
          <div>
            &copy; {new Date().getFullYear()} ECONOMYLIVE NETWORK. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/admin/login" className="hover:text-[#c79a2b] transition-colors">
              Staff Login
            </Link>
            <span>&bull;</span>
            <span className="text-[#5c4f3a]">Real-Time Google News Integrated</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
