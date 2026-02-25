
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LandingPage.css";


const LandingPage = () => {
  const navigate = useNavigate();

  const handleSignupClick = (e) => {
    e.preventDefault();
    console.log('Signup clicked');
    navigate('/signup');
  };

  const handleJobsClick = (e) => {
    e.preventDefault();
    console.log('Jobs clicked');
    navigate('/jobs');
  };

  return (
  <div className="landing-page">
    <nav className="landing-nav">
      <div className="nav-logo">💼 TINCLO</div>
      <div className="nav-links">
        <Link to="/signup" className="nav-link" onClick={handleSignupClick}>Sign Up</Link>
        <Link to="/jobs" className="nav-link-primary" onClick={handleJobsClick}>Browse Jobs</Link>
      </div>
    </nav>

    <div className="landing-hero">
      <div className="hero-content">
        <h1 className="hero-title">Find Your Dream Job</h1>
        <p className="hero-subtitle">Swipe right on opportunities that match your career goals</p>
        <div className="hero-actions">
          <Link to="/jobs" className="btn-primary" onClick={handleJobsClick}>Start Browsing</Link>
          <Link to="/signup" className="btn-secondary" onClick={handleSignupClick}>Create Account</Link>
        </div>
      </div>
    </div>

    <div className="landing-features">
      <div className="feature">
        <div className="feature-icon">👍</div>
        <h3>Swipe to Match</h3>
        <p>Browse jobs with a simple swipe interface</p>
      </div>
      <div className="feature">
        <div className="feature-icon">💼</div>
        <h3>Save Favorites</h3>
        <p>Keep track of jobs you're interested in</p>
      </div>
      <div className="feature">
        <div className="feature-icon">🚀</div>
        <h3>Quick Apply</h3>
        <p>Apply to multiple positions with ease</p>
      </div>
    </div>
  </div>
);
};

export default LandingPage;
