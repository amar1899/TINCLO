import PropTypes from 'prop-types';

/**
 * TabPanel Component
 * 
 * Displays feature cards for the active tab category with fade transition animation.
 * This component is designed to work with the TabbedNavigation component.
 * 
 * Features:
 * - role="tabpanel" for accessibility
 * - aria-controls linking to tab
 * - Fade transition animation (200ms) on tab switch
 * - Feature cards display with icon, title, and description
 * 
 * Requirements: 3.2, 3.5
 */
const TabPanel = ({ id, tabId, isActive, features, title }) => {
  return (
    <div
      role="tabpanel"
      id={id}
      aria-labelledby={tabId}
      aria-controls={tabId}
      hidden={!isActive}
      className={[
        'py-8 transition-[opacity,transform] duration-200 ease-in-out',
        isActive
          ? 'opacity-100 translate-y-0 animate-fade-in-panel'
          : 'opacity-0 translate-y-[10px]',
      ].join(' ')}
      tabIndex={0}
    >
      {isActive && (
        <>
          {/* Tab Panel Title */}
          <h3 className="text-[2rem] font-semibold text-white mb-8 text-center">
            {title}
          </h3>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8 mt-8">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="feature-card bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-lg p-8 transition-all duration-300 flex flex-col gap-4 hover:-translate-y-2 hover:bg-white/[0.08] hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]"
              >
                {/* Icon */}
                <div className="text-5xl leading-none mb-2">{feature.icon}</div>

                {/* Title */}
                <h4 className="text-2xl font-semibold text-white m-0">{feature.title}</h4>

                {/* Description */}
                <p className="text-base leading-relaxed text-white/80 m-0 flex-grow">
                  {feature.description}
                </p>

                {/* Screenshot */}
                {feature.screenshot && (
                  <div className="mt-4 rounded-lg overflow-hidden bg-black/20">
                    <img
                      src={feature.screenshot}
                      alt={`${feature.title} screenshot`}
                      loading="lazy"
                      className="w-full h-auto block object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23667eea" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="%23ffffff"%3EScreenshot Unavailable%3C/text%3E%3C/svg%3E';
                        e.target.alt = `${feature.title} screenshot unavailable`;
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

TabPanel.propTypes = {
  id: PropTypes.string.isRequired,
  tabId: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  features: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      screenshot: PropTypes.string,
    })
  ).isRequired,
  title: PropTypes.string.isRequired,
};

export default TabPanel;
