import PropTypes from 'prop-types';
import './TabPanel.css';

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
      className={`tab-panel-content ${isActive ? 'tab-panel-content-active' : ''}`}
      tabIndex={0}
    >
      {isActive && (
        <>
          <h3 className="tab-panel-title">{title}</h3>
          <div className="feature-cards-grid">
            {features.map((feature) => (
              <div key={feature.id} className="feature-card">
                <div className="feature-card-icon">{feature.icon}</div>
                <h4 className="feature-card-title">{feature.title}</h4>
                <p className="feature-card-description">{feature.description}</p>
                {feature.screenshot && (
                  <div className="feature-card-screenshot">
                    <img
                      src={feature.screenshot}
                      alt={`${feature.title} screenshot`}
                      loading="lazy"
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
