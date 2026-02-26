// Navigation Component - Handles view switching

import React from 'react';
import './Navigation.css';
import { Link } from 'react-router-dom';

export const Navigation = ({ currentView, matchCount, onNavigate, currentUser, onLogout }) => {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <h1 className="nav-logo">💼 TINCLO</h1>
        
        <div className="nav-links">
          <button
            className={`nav-button ${currentView === 'browser' ? 'active' : ''}`}
            onClick={() => onNavigate('browser')}
          >
            Browse Jobs
          </button>
          <button
            className={`nav-button ${currentView === 'matches' ? 'active' : ''}`}
            onClick={() => onNavigate('matches')}
          >
            Matches {matchCount > 0 && <span className="badge">{matchCount}</span>}
          </button>
        </div>

        <div className="nav-user">
          {currentUser ? (
            <>
              <span className="user-name">👤 {currentUser.name}</span>
              <button className="logout-button" onClick={onLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link-item">Login</Link>
              <Link to="/signup" className="nav-link-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
