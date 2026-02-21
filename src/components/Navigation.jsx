// Navigation Component - Handles view switching

import React from 'react';
import './Navigation.css';

export const Navigation = ({ currentView, matchCount, onNavigate }) => {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <h1 className="nav-logo">💼 Job Swipe Matcher</h1>
        
        <div className="nav-buttons">
          <button
            className={`nav-btn ${currentView === 'browser' ? 'active' : ''}`}
            onClick={() => onNavigate('browser')}
            aria-label="Browse jobs"
          >
            Browse Jobs
          </button>
          
          <button
            className={`nav-btn ${currentView === 'matches' ? 'active' : ''}`}
            onClick={() => onNavigate('matches')}
            aria-label="View matches"
          >
            Matches
            {matchCount > 0 && (
              <span className="match-badge">{matchCount}</span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};
