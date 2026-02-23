
import React from "react";
import "./LandingPage.css";
import NavigationLanding from "./NavigationLanding";


const LandingPage = () => (
  <>
       <NavigationLanding />
    <div className="landing-container">
      <h1>Welcome to Job Tinder!</h1>
      <p>Find your dream job by swiping right.</p>
      
      <div className="landing-actions">
         <nav className="navigation nav-flex">
    <div className="nav-logo-container">
      <Link to="/signup" className="nav-logo">💼 TINCLO</Link>
    </div>

    <div className="nav-links">
      <Link to="/signup" className="nav-link-item">Sign Up</Link>
      <Link to="/jobs" className="nav-link-item">Browse Jobs</Link>
    </div>
  </nav>    

      </div>
    </div>
  </>
);

export default LandingPage;
