import React from "react";
import { Link } from "react-router-dom";
import "./Navigation.css";


const NavigationLanding = () => (
  <nav className="navigation">
    <Link to="/" className="nav-logo" style={{ textDecoration: 'none', color: 'inherit' }}>TINCLO</Link>
    <div className="nav-links">
    </div>
  </nav>
);
export default NavigationLanding;
