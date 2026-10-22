import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Newspaper, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickFill = () => {
    setEmail('admin@economylivenetwork.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-[#18140f] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background subtle watermark */}
      <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
        <Newspaper className="w-[600px] h-[600px] text-white" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-3 group">
            <div className="w-10 h-10 rounded-full bg-[#c79a2b] flex items-center justify-center text-[#13100c] shadow-lg">
              <Newspaper className="w-6 h-6" />
            </div>
            <span className="font-cinzel text-xl sm:text-2xl font-bold tracking-wider text-white group-hover:text-[#c79a2b] transition-colors">
              ECONOMYLIVE NETWORK
            </span>
          </Link>
          <div className="flex items-center justify-center gap-1.5 text-xs uppercase font-extrabold tracking-widest text-[#c79a2b]">
            <ShieldCheck className="w-4 h-4" />
            <span>Editorial Admin Portal</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-[#211b14] border border-[#3d3222] rounded-xl p-6 sm:p-8 shadow-2xl">
          <h2 className="font-cinzel text-xl font-bold text-white mb-1">
            Sign In
          </h2>
          <p className="text-xs text-[#a89679] mb-6">
            Enter your credentials to write articles, curate desks, and sync Google News.
          </p>

          {error && (
            <div className="mb-5 p-3 rounded bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-[#c5b59a] mb-1.5">
                Email or Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#786a52]" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@economylivenetwork.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#18140f] border border-[#3d3222] rounded text-sm text-white placeholder-[#5c4f3a] focus:outline-none focus:border-[#c79a2b]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-[#c5b59a] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#786a52]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#18140f] border border-[#3d3222] rounded text-sm text-white placeholder-[#5c4f3a] focus:outline-none focus:border-[#c79a2b]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-[#c79a2b] hover:bg-[#b08722] disabled:opacity-50 text-[#13100c] font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 shadow-md mt-2"
            >
              <span>{submitting ? 'Authenticating...' : 'Sign In to Admin Panel'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Default Credentials Hint */}
          <div className="mt-6 pt-5 border-t border-[#30281b] text-center">
            <p className="text-[11px] text-[#8e7d61] mb-2">
              Default credentials configured:
            </p>
            <div className="inline-block bg-[#18140f] border border-[#30281b] rounded px-3 py-1.5 text-xs text-[#c5b59a] font-mono mb-3">
              admin@economylivenetwork.com / admin123
            </div>
            <br />
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-xs text-[#c79a2b] hover:underline font-semibold"
            >
              Auto-fill credentials
            </button>
          </div>
        </div>

        {/* Back to Public Site */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-xs text-[#8e7d61] hover:text-[#c79a2b] transition-colors"
          >
            &larr; Back to Public News Frontpage
          </Link>
        </div>
      </div>
    </div>
  );
}
