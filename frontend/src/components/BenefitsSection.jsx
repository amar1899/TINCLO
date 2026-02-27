import useScrollAnimation from '../hooks/useScrollAnimation';
import benefitsData from '../data/benefitsData';
import './BenefitsSection.css';

/**
 * BenefitsSection Component
 * 
 * Displays the benefits section with benefit cards in a grid layout.
 * Each card shows an icon, title, description, and metric.
 * 
 * Features:
 * - 3-column grid layout (1 column on mobile)
 * - Glassmorphism styling on cards
 * - Hover effects with translateY and shadow
 * - Scroll-based animation on viewport entry
 * 
 * Requirements: 2.3, 2.5, 2.6, 4.1, 5.4, 5.5, 7.1
 */
const BenefitsSection = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section 
      ref={sectionRef}
      className={`benefits-section animate-on-scroll ${isVisible ? 'animate-in' : ''}`}
      aria-labelledby="benefits-heading"
    >
      <div className="benefits-container">
        <h2 id="benefits-heading" className="benefits-heading">
          Why Choose TINCLO?
        </h2>
        <p className="benefits-subheading">
          Streamline your job search with powerful features designed for success
        </p>
        
        <div className="benefits-grid">
          {benefitsData.map((benefit) => (
            <div key={benefit.id} className="benefit-card">
              <div className="benefit-icon">{benefit.icon}</div>
              <h3 className="benefit-title">{benefit.title}</h3>
              <p className="benefit-description">{benefit.description}</p>
              <div className="benefit-metric">{benefit.metric}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
