import useScrollAnimation from '../hooks/useScrollAnimation';
import useCasesData from '../data/useCasesData';
import './UseCasesSection.css';

/**
 * UseCasesSection Component
 * 
 * Displays use case scenarios with alternating left-right layout.
 * Each use case includes an image, headline, description, and feature list.
 * 
 * Features:
 * - Alternating left-right layout for visual interest
 * - Professional image styling with shadows and borders
 * - Hover scale effects on images
 * - Scroll-based animation on viewport entry
 * - Responsive stacking on mobile
 * 
 * Requirements: 2.4, 4.1, 6.2, 6.5, 7.1, 7.4, 10.2, 12.1
 */
const UseCasesSection = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section 
      ref={sectionRef}
      className={`usecases-section animate-on-scroll ${isVisible ? 'animate-in' : ''}`}
      aria-labelledby="usecases-heading"
    >
      <div className="usecases-container">
        <h2 id="usecases-heading" className="usecases-heading">
          Built for Every Job Seeker
        </h2>
        <p className="usecases-subheading">
          Whether you're starting out or making a change, TINCLO adapts to your needs
        </p>
        
        <div className="usecases-list">
          {useCasesData.map((useCase, index) => (
            <div 
              key={useCase.id} 
              className={`usecase-card ${index % 2 === 1 ? 'usecase-card-reverse' : ''}`}
            >
              <div className="usecase-image-container">
                <img 
                  src={useCase.image}
                  alt={`${useCase.title} - ${useCase.headline}`}
                  className="usecase-image"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"%3E%3Crect fill="%23667eea" width="600" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="%23ffffff"%3EImage Unavailable%3C/text%3E%3C/svg%3E';
                    e.target.alt = `Screenshot unavailable - ${useCase.title}`;
                  }}
                />
              </div>
              
              <div className="usecase-content">
                <div className="usecase-label">{useCase.title}</div>
                <h3 className="usecase-headline">{useCase.headline}</h3>
                <p className="usecase-description">{useCase.description}</p>
                
                <ul className="usecase-features">
                  {useCase.features.map((feature, idx) => (
                    <li key={idx} className="usecase-feature">
                      <span className="feature-checkmark">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
