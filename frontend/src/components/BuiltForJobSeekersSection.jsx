import useScrollAnimation from '../hooks/useScrollAnimation';

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
      className={`py-20 px-12 mt-[60px] bg-white/[0.08] animate-on-scroll ${isVisible ? 'animate-in' : ''} md:py-[60px] md:px-6 md:mt-10`}
      aria-labelledby="built-for-heading"
    >
      <div className="max-w-[800px] mx-auto text-center">
        <h2 id="built-for-heading" className="text-[2.5rem] font-bold mb-12 text-white md:text-[2rem]">
          Built for Job Seekers
        </h2>
        <ul className="list-none p-0 m-0 flex flex-col gap-6">
          {benefits.map((benefit, index) => (
            <li key={index} className="text-[1.2rem] leading-relaxed text-white opacity-95 py-2 md:text-base">
              {benefit}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default BuiltForJobSeekersSection;
