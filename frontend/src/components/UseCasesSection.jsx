import useScrollAnimation from '../hooks/useScrollAnimation';
import useCasesData from '../data/useCasesData';

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
      className={`animate-on-scroll ${isVisible ? 'animate-in' : ''} py-20 px-12 mt-[60px] max-sm:py-[60px] max-sm:px-6 max-sm:mt-10`}
      aria-labelledby="usecases-heading"
    >
      <div className="max-w-[1200px] mx-auto">
        <h2
          id="usecases-heading"
          className="text-[2.5rem] font-bold text-center mb-4 text-white max-sm:text-[2rem]"
        >
          Built for Every Job Seeker
        </h2>
        <p className="text-[1.2rem] text-center mb-16 opacity-90 text-white max-sm:text-base max-sm:mb-10">
          Whether you're starting out or making a change, TINCLO adapts to your needs
        </p>

        <div className="flex flex-col gap-16 max-sm:gap-12">
          {useCasesData.map((useCase, index) => (
            <div
              key={useCase.id}
              className={`grid grid-cols-2 gap-12 items-center max-sm:grid-cols-1 max-sm:gap-6 ${
                index % 2 === 1 ? '[direction:rtl] max-sm:[direction:ltr]' : ''
              }`}
            >
              {/* Image container — reset direction so content inside is always LTR */}
              <div className={`relative overflow-hidden rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] ${index % 2 === 1 ? '[direction:ltr]' : ''}`}>
                <img
                  src={useCase.image}
                  alt={`${useCase.title} - ${useCase.headline}`}
                  className="w-full h-auto aspect-[3/2] object-cover rounded-2xl border-2 border-white/20 transition-[transform,box-shadow] duration-300 ease-in-out hover:scale-105 hover:shadow-[0_12px_48px_rgba(0,0,0,0.25)]"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"%3E%3Crect fill="%23667eea" width="600" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="%23ffffff"%3EImage Unavailable%3C/text%3E%3C/svg%3E';
                    e.target.alt = `Screenshot unavailable - ${useCase.title}`;
                  }}
                />
              </div>

              {/* Content — always LTR */}
              <div className={`p-4 ${index % 2 === 1 ? '[direction:ltr]' : ''}`}>
                <div className="inline-block text-[0.9rem] font-semibold uppercase tracking-[1px] text-white/80 bg-white/15 px-4 py-2 rounded-full mb-4">
                  {useCase.title}
                </div>
                <h3 className="text-[2rem] font-bold mb-4 text-white leading-[1.3] max-sm:text-2xl">
                  {useCase.headline}
                </h3>
                <p className="text-[1.1rem] leading-[1.7] mb-6 opacity-90 text-white max-sm:text-base">
                  {useCase.description}
                </p>

                <ul className="list-none p-0 m-0 flex flex-col gap-3">
                  {useCase.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-base text-white">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-white/20 rounded-full font-bold shrink-0">
                        ✓
                      </span>
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
