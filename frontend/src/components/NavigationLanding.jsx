import React from "react";
import { Link } from "react-router-dom";
import "./Navigation.css";


const NavigationLanding = () => (
  <nav className="navigation">
    <Link to="/signup" className="nav-logo">Job Tinder</Link>
    <div className="nav-links">
      <Link to="/signup" className="nav-link-item">Sign Up</Link>
      <Link to="/jobs" className="nav-link-item">Browse Jobs</Link>
    </div>
  </nav>
);
  <nav className="navigation nav-flex">
    <div className="nav-logo-container">
      <Link to="/signup" className="nav-logo">Job Tinder</Link>
    </div>

    <div className="nav-links">
      <Link to="/signup" className="nav-link-item">Sign Up</Link>
      <Link to="/jobs" className="nav-link-item">Browse Jobs</Link>
    </div>
  </nav>    
export default NavigationLanding;
