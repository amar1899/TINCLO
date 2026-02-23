// Navigation Component - Handles view switching

import React from 'react';
import './Navigation.css';
import { Link } from 'react-router-dom';

export const Navigation = ({ currentView, matchCount, onNavigate }) => {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <h1 className="nav-logo">💼 TINCLO</h1>
        <Link to="/signup" className="nav-link-item">Sign Up</Link>
        <Link to="/jobs" className="nav-link-item">Browse Jobs</Link>  
      </div>
    </nav>
  );
};
