import useScrollAnimation from '../hooks/useScrollAnimation';
import './BuiltForJobSeekersSection.css';

const BuiltForJobSeekersSection = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const benefits = [
    'No more endless scrolling — see only relevant jobs',
    'Apply in seconds with pre-filled profiles',
    'Get notified instantly when employers respond',
    'Compare offers side by side with smart analytics',
    '100% free for job seekers, forever'
  ];

  return (
    <section 
      ref={sectionRef}
      className={`built-for-section animate-on-scroll ${isVisible ? 'animate-in' : ''}`}
      aria-labelledby="built-for-heading"
    >
      <div className="built-for-container">
        <h2 id="built-for-heading" className="built-for-heading">
          Built for Job Seekers
        </h2>
        <ul className="built-for-list">
          {benefits.map((benefit, index) => (
            <li key={index} className="built-for-item">
              {benefit}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default BuiltForJobSeekersSection;
