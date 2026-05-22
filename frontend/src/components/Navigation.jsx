import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Notifications from './Notifications';
import Chat from './Chat';

const STORAGE_KEY = 'tinclo_notifications';

const getUnreadCount = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored).filter(n => !n.read).length;
  } catch (e) { /* ignore */ }
  return 2;
};

export const Navigation = ({ currentView, matchCount, onNavigate, currentUser, onLogout }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [unreadCount, setUnreadCount] = useState(getUnreadCount);

  const handleCloseNotifications = useCallback(() => {
    setShowNotifications(false);
    setUnreadCount(getUnreadCount());
  }, []);

  useEffect(() => {
    const onStorage = (e) => { if (e.key === STORAGE_KEY) setUnreadCount(getUnreadCount()); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const isAdmin = currentUser?.role === 'admin' || localStorage.getItem('tinclo_admin_session') === 'true';

  const navBtnBase = "flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-full border-2 border-white/20 bg-white/15 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/25 hover:border-white/40 hover:-translate-y-0.5 hover:shadow-md";
  const navBtnActive = "bg-white text-indigo-500 border-transparent shadow-md font-bold hover:bg-white hover:text-indigo-500";

  return (
    <>
      <nav className="sticky top-0 z-[100] text-white shadow-[0_4px_20px_rgba(102,126,234,0.4)]"
        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' }}>
        <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center h-[68px] gap-8">
          {/* Logo */}
          <Link to="/" className="text-2xl font-black tracking-wide text-white no-underline transition-transform hover:scale-105"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
            💼 TINCLO
          </Link>

          {/* Nav links */}
          <div className="flex gap-2 flex-1 justify-center">
            <button className={`${navBtnBase} ${currentView === 'browser' ? navBtnActive : ''}`} onClick={() => onNavigate('browser')}>
              Browse Jobs
            </button>
            <button className={`${navBtnBase} ${currentView === 'matches' ? navBtnActive : ''}`} onClick={() => onNavigate('matches')}>
              Matches
              {matchCount > 0 && (
                <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full min-w-[20px] text-center text-white shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)' }}>
                  {matchCount}
                </span>
              )}
            </button>
          </div>

          {/* User area */}
          <div className="flex items-center gap-2.5">
            {currentUser ? (
              <>
                {/* Chat */}
                <button onClick={() => setShowChat(!showChat)} aria-label="Messages" title="Messages"
                  className="relative w-[38px] h-[38px] rounded-full bg-white/15 border border-white/25 text-white text-base flex items-center justify-center transition-all hover:bg-white/25 hover:scale-110">
                  💬
                </button>
                {/* Bell */}
                <button onClick={() => setShowNotifications(!showNotifications)} aria-label="Notifications" title="Notifications"
                  className="relative w-[38px] h-[38px] rounded-full bg-white/15 border border-white/25 text-white text-base flex items-center justify-center transition-all hover:bg-white/25 hover:scale-110">
                  🔔
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-red-400 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {/* Profile */}
                <Link to="/profile" title="View Profile"
                  className="text-sm font-bold text-white px-4 py-2 bg-white/20 rounded-full border border-white/30 backdrop-blur-sm no-underline">
                  👤 {currentUser.name}
                </Link>
                {/* Analytics */}
                <Link to="/analytics" title="Analytics"
                  className="text-sm font-semibold text-white px-4 py-2 rounded-full bg-white/15 border border-white/25 no-underline transition-all hover:bg-white/25 hover:-translate-y-0.5">
                  📈
                </Link>
                {/* Admin */}
                {isAdmin && (
                  <Link to="/admin" title="Admin Panel"
                    className="text-xs font-bold text-gray-900 px-3.5 py-2 rounded-full no-underline transition-all hover:-translate-y-0.5 shadow-[0_2px_8px_rgba(255,107,107,0.3)] hover:shadow-[0_6px_16px_rgba(255,107,107,0.4)]"
                    style={{ background: 'linear-gradient(135deg, #ffd89b, #ff6b6b)' }}>
                    ⚙️ Admin
                  </Link>
                )}
                {/* Logout */}
                <button onClick={onLogout}
                  className="bg-white/95 text-purple-700 px-5 py-2 text-sm font-bold rounded-full border-none cursor-pointer transition-all hover:bg-white hover:-translate-y-0.5 shadow-md hover:shadow-lg">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login"
                  className="text-sm font-semibold text-white px-4 py-2 rounded-full bg-white/15 border border-white/25 no-underline transition-all hover:bg-white/25 hover:-translate-y-0.5">
                  Login
                </Link>
                <Link to="/signup"
                  className="text-sm font-bold text-purple-700 bg-white px-5 py-2 rounded-full no-underline transition-all hover:bg-purple-50 hover:-translate-y-0.5 shadow-md hover:shadow-lg">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {showNotifications && <Notifications onClose={handleCloseNotifications} />}
      {showChat && <Chat onClose={() => setShowChat(false)} currentUser={currentUser} />}
    </>
  );
};
