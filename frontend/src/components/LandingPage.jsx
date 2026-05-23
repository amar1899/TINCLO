import { Link, useNavigate } from "react-router-dom";
import FeaturesSection from "./FeaturesSection";
import BenefitsSection from "./BenefitsSection";
import UseCasesSection from "./UseCasesSection";
import FinalCTASection from "./FinalCTASection";
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
      <Link to="/" className="nav-logo" style={{ textDecoration: 'none', color: 'inherit' }}>💼 TINCLO</Link>
      <div className="nav-links">
        <Link to="/jobs" className="nav-link-primary" onClick={handleJobsClick}>Browse Jobs</Link>
        <Link to="/signup" className="nav-link" onClick={handleSignupClick}>Sign Up</Link>
      </div>
    </nav>

    <div className="landing-hero">
      <div className="hero-container">
        <div className="hero-text">
          <h1 className="hero-title">Find Your Dream Job with Smart Matching</h1>
          <p className="hero-subtitle">Swipe through opportunities tailored to your skills and preferences. Track applications, save favorites, and land your perfect role faster.</p>
          <div className="hero-actions">
            <Link 
              to="/signup" 
              className="btn-primary" 
              onClick={handleSignupClick}
              aria-label="Get TINCLO for free - Sign up now to start matching with your dream job"
            >
              Get it free
            </Link>
            <Link 
              to="/jobs" 
              className="btn-secondary" 
              onClick={handleJobsClick}
              aria-label="See how TINCLO works - Browse available jobs and explore the platform"
            >
              See how it works
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <img 
            src="/assets/hero-screenshot.svg"
            alt="TINCLO application interface showing job matching swipe feature and application tracking dashboard"
            className="hero-screenshot"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"%3E%3Crect fill="%23667eea" width="800" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" fill="%23ffffff"%3EImage Unavailable%3C/text%3E%3C/svg%3E';
              e.target.alt = 'Screenshot unavailable - TINCLO job matching platform';
            }}
            loading="eager"
          />
        </div>
      </div>
    </div>

    <FeaturesSection />

    <BenefitsSection />

    <UseCasesSection />

    <FinalCTASection />

    <footer className="landing-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">💼 TINCLO</h3>
          <p className="footer-description">
            Your smart job matching platform. Find your dream career with just a swipe.
          </p>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/jobs" onClick={handleJobsClick}>Browse Jobs</Link></li>
            <li><Link to="/signup" onClick={handleSignupClick}>Sign Up</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Contact Developer</h4>
          <div className="footer-contact">
            <a href="mailto:voddulaamar@gmail.com" className="contact-item">
              <svg className="contact-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>voddulaamar@gmail.com</span>
            </a>
            <a href="tel:+917981954727" className="contact-item">
              <svg className="contact-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.095 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.5953 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04207 3.23945 9.10999 3.72C9.23662 4.68007 9.47144 5.62273 9.80999 6.53C9.94454 6.88792 9.97366 7.27691 9.8939 7.65088C9.81415 8.02485 9.62886 8.36811 9.35999 8.64L8.08999 9.91C9.51355 12.4135 11.5864 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>+91 7981954727</span>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} TINCLO. All rights reserved.</p>
        <p className="footer-tagline">Built with ❤️ for job seekers</p>
      </div>
    </footer>
  </div>
);
};

export default LandingPage;
