import React, { useEffect, useState } from 'react';
import { getSettings, updateSettings, changePassword } from '../../api/client';
import {
  Settings,
  Lock,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sliders,
  ShieldAlert
} from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: 'ECONOMYLIVE NETWORK',
    siteTagline: 'Independent Digital News & Media',
    breakingTickerEnabled: true,
    breakingTickerCustomText: '',
    defaultAuthor: 'Editorial Desk',
    googleNewsCountry: 'IN'
  });

  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState('');

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    getSettings()
      .then(res => setSettings(prev => ({ ...prev, ...res })))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsMessage('');
    try {
      await updateSettings(settings);
      setSettingsMessage('Site configuration saved successfully!');
      setTimeout(() => setSettingsMessage(''), 3000);
    } catch (err) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setSavingSettings(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    setChangingPassword(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setPasswordMessage('Admin password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMessage(''), 3000);
    } catch (err) {
      setPasswordError(err.message || 'Password update failed');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-[#c79a2b] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[#30281b]">
        <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
          Portal & Editorial Settings
        </h1>
        <p className="text-xs text-[#a89679] mt-1">
          Customize masthead branding, ticker broadcasts, and admin security credentials.
        </p>
      </div>

      {/* Site Identity Settings */}
      <div className="bg-[#211b14] border border-[#30281b] p-6 rounded-xl">
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-[#30281b]">
          <Sliders className="w-4 h-4 text-[#c79a2b]" />
          <h2 className="font-cinzel text-base font-bold text-white uppercase tracking-wider">
            Site Branding & Broadcasts
          </h2>
        </div>

        {settingsMessage && (
          <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{settingsMessage}</span>
          </div>
        )}

        <form onSubmit={handleSettingsSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase font-bold text-[#c5b59a] mb-1">
                Portal Masthead Name
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-3 py-2 bg-[#18140f] border border-[#3d3222] rounded text-xs text-white focus:outline-none focus:border-[#c79a2b]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-[#c5b59a] mb-1">
                Site Tagline
              </label>
              <input
                type="text"
                value={settings.siteTagline}
                onChange={(e) => setSettings({ ...settings, siteTagline: e.target.value })}
                className="w-full px-3 py-2 bg-[#18140f] border border-[#3d3222] rounded text-xs text-white focus:outline-none focus:border-[#c79a2b]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-[#c5b59a] mb-1">
              Default Article Byline
            </label>
            <input
              type="text"
              value={settings.defaultAuthor}
              onChange={(e) => setSettings({ ...settings, defaultAuthor: e.target.value })}
              className="w-full px-3 py-2 bg-[#18140f] border border-[#3d3222] rounded text-xs text-white focus:outline-none focus:border-[#c79a2b]"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={settings.breakingTickerEnabled}
                onChange={(e) => setSettings({ ...settings, breakingTickerEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-[#c79a2b] bg-[#18140f] border-[#3d3222]"
              />
              <span className="text-xs font-bold text-white uppercase">
                Enable Top Breaking News Marquee Ticker
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={savingSettings}
            className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-[#c79a2b] hover:bg-[#b08722] disabled:opacity-50 text-[#13100c] rounded text-xs font-bold uppercase tracking-wider transition-colors shadow"
          >
            {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Configuration</span>
          </button>
        </form>
      </div>

      {/* Admin Security Settings */}
      <div className="bg-[#211b14] border border-[#30281b] p-6 rounded-xl">
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-[#30281b]">
          <Lock className="w-4 h-4 text-[#c79a2b]" />
          <h2 className="font-cinzel text-base font-bold text-white uppercase tracking-wider">
            Admin Security & Password
          </h2>
        </div>

        {passwordMessage && (
          <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{passwordMessage}</span>
          </div>
        )}

        {passwordError && (
          <div className="mb-4 p-3 bg-red-950/80 border border-red-800 text-red-300 rounded text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs uppercase font-bold text-[#c5b59a] mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-[#18140f] border border-[#3d3222] rounded text-xs text-white focus:outline-none focus:border-[#c79a2b]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase font-bold text-[#c5b59a] mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 chars"
                className="w-full px-3 py-2 bg-[#18140f] border border-[#3d3222] rounded text-xs text-white focus:outline-none focus:border-[#c79a2b]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-[#c5b59a] mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="w-full px-3 py-2 bg-[#18140f] border border-[#3d3222] rounded text-xs text-white focus:outline-none focus:border-[#c79a2b]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={changingPassword}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#c79a2b] hover:bg-[#b08722] disabled:opacity-50 text-[#13100c] rounded text-xs font-bold uppercase tracking-wider transition-colors shadow"
          >
            {changingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            <span>Update Password</span>
          </button>
        </form>
      </div>
    </div>
  );
}
