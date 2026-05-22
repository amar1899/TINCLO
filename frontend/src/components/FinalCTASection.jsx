import { useNavigate } from 'react-router-dom';
import useScrollAnimation from '../hooks/useScrollAnimation';

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
      className={`animate-on-scroll ${isVisible ? 'animate-in' : ''} py-[100px] px-12 mt-[60px] bg-white/10 backdrop-blur-xl max-md:py-[60px] max-md:px-6 max-md:mt-10`}
      aria-labelledby="final-cta-heading"
    >
      <div className="max-w-[800px] mx-auto text-center">
        <h2
          id="final-cta-heading"
          className="text-5xl font-bold mb-6 text-white leading-tight max-md:text-4xl"
        >
          Ready to Find Your Dream Job?
        </h2>
        <p className="text-[1.3rem] leading-relaxed mb-10 opacity-90 text-white max-md:text-[1.1rem]">
          Join thousands of job seekers who are already using TINCLO to accelerate their career journey
        </p>
        <button 
          className="bg-[#2d9b83] text-white py-5 px-12 border-0 rounded-[30px] font-semibold text-[1.2rem] cursor-pointer transition-[transform,box-shadow] duration-150 ease-in shadow-[0_6px_24px_rgba(0,0,0,0.15)] hover:-translate-y-[3px] hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] active:-translate-y-[1px] max-md:py-4 max-md:px-10 max-md:text-[1.1rem]"
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
