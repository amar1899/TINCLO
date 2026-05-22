import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NavigationLanding = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('tinclo_current_user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('tinclo_current_user');
    localStorage.removeItem('tinclo_token');
    localStorage.removeItem('tinclo_admin_session');
    navigate('/');
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[200] flex justify-between items-center px-8 py-4 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.15)]"
      style={{ background: 'linear-gradient(135deg, rgba(102,126,234,0.95) 0%, rgba(118,75,162,0.95) 100%)' }}
    >
      <Link
        to="/"
        className="text-xl font-black text-white no-underline tracking-wide hover:opacity-90 transition-opacity"
      >
        💼 TINCLO
      </Link>

      <div className="flex items-center gap-3">
        {currentUser ? (
          <>
            <Link
              to="/jobs"
              className="text-sm font-semibold text-white px-4 py-2 rounded-full bg-white/15 border border-white/25 no-underline transition-all hover:bg-white/25 hover:-translate-y-0.5"
            >
              Browse Jobs
            </Link>
            <Link
              to="/profile"
              className="text-sm font-semibold text-white px-4 py-2 rounded-full bg-white/15 border border-white/25 no-underline transition-all hover:bg-white/25 hover:-translate-y-0.5"
            >
              👤 {currentUser.name}
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm font-bold text-purple-700 bg-white px-5 py-2 rounded-full border-none cursor-pointer transition-all hover:bg-purple-50 hover:-translate-y-0.5 shadow-md"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm font-semibold text-white px-4 py-2 rounded-full bg-white/15 border border-white/25 no-underline transition-all hover:bg-white/25 hover:-translate-y-0.5"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-sm font-bold text-purple-700 bg-white px-5 py-2 rounded-full no-underline transition-all hover:bg-purple-50 hover:-translate-y-0.5 shadow-md"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavigationLanding;
