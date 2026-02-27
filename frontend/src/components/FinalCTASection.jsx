import { useNavigate } from 'react-router-dom';
import useScrollAnimation from '../hooks/useScrollAnimation';
import './FinalCTASection.css';

/**
 * FinalCTASection Component
 * 
 * Displays a final call-to-action section before the footer.
 * Encourages users to sign up with a prominent CTA button.
 * 
 * Features:
 * - Prominent CTA button with action-oriented text
 * - Scroll-based animation on viewport entry
 * - Navigation to signup page on click
 * - Glassmorphism styling
 * 
 * Requirements: 9.2, 9.3, 9.5, 9.6
 */
const FinalCTASection = () => {
  const navigate = useNavigate();
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const handleSignupClick = (e) => {
    e.preventDefault();
    navigate('/signup');
  };

  return (
    <section 
      ref={sectionRef}
      className={`final-cta-section animate-on-scroll ${isVisible ? 'animate-in' : ''}`}
      aria-labelledby="final-cta-heading"
    >
      <div className="final-cta-container">
        <h2 id="final-cta-heading" className="final-cta-heading">
          Ready to Find Your Dream Job?
        </h2>
        <p className="final-cta-description">
          Join thousands of job seekers who are already using TINCLO to accelerate their career journey
        </p>
        <button 
          className="final-cta-button"
          onClick={handleSignupClick}
          aria-label="Start now - Sign up for TINCLO and begin your job search journey"
        >
          Start now
        </button>
      </div>
    </section>
  );
};

export default FinalCTASection;
