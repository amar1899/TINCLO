
import React from "react";
import "./LandingPage.css";
import { Link } from "react-router-dom";
import NavigationLanding from "./NavigationLanding";


const LandingPage = () => (
  <>
    <NavigationLanding />
    <div className="landing-container">
      <h1>Welcome to TINCLO!</h1>
      <p>Find your dream job by swiping right.</p>
      <div className="landing-actions">
        <Link to="/signup" className="landing-btn">Sign Up</Link>
        <Link to="/jobs" className="landing-btn">Browse Jobs</Link>
      </div>
    </div>
  </>
);

export default LandingPage;
