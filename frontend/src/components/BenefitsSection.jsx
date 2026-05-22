import useScrollAnimation from '../hooks/useScrollAnimation';
import benefitsData from '../data/benefitsData';

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
      className={`py-20 px-12 mt-[60px] bg-white/5 md:py-[60px] md:px-6 md:mt-10 animate-on-scroll ${isVisible ? 'animate-in' : ''}`}
      aria-labelledby="benefits-heading"
    >
      <div className="max-w-[1200px] mx-auto">
        <h2
          id="benefits-heading"
          className="text-[2.5rem] font-bold text-center mb-4 text-white md:text-[2rem]"
        >
          Why Choose TINCLO?
        </h2>
        <p className="text-[1.2rem] text-center mb-12 opacity-90 text-white md:text-base">
          Streamline your job search with powerful features designed for success
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[900px] mx-auto md:gap-6 md:max-w-[620px] lg:max-w-[900px]">
          {benefitsData.map((benefit) => (
            <div
              key={benefit.id}
              className="bg-white/15 backdrop-blur-[20px] border border-white/30 rounded-2xl p-10 text-center transition-transform duration-300 ease-in-out shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-2 hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] md:p-8"
            >
              <div className="text-[4rem] mb-6 md:text-[3rem]">{benefit.icon}</div>
              <h3 className="text-2xl font-semibold mb-4 text-white md:text-xl">{benefit.title}</h3>
              <p className="text-base leading-relaxed opacity-90 text-white">{benefit.description}</p>
              {benefit.metric && (
                <div className="mt-4 inline-block px-4 py-1.5 bg-white/20 rounded-full text-sm font-bold text-white">
                  {benefit.metric}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
