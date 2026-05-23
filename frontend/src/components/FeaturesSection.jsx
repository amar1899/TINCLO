import { useState } from 'react';
import TabPanel from './TabPanel';
import featuresData from '../data/featuresData';
import useScrollAnimation from '../hooks/useScrollAnimation';
import './FeaturesSection.css';

/**
 * FeaturesSection Component
 * 
 * Displays the features section with tabbed navigation and feature cards.
 * Integrates TabbedNavigation with TabPanel components to show different
 * feature categories.
 * 
 * Features:
 * - Tabbed navigation for feature categories
 * - Tab panels with feature cards
 * - Smooth content switching with fade transitions
 * - Keyboard accessible
 * - Scroll-based animation on viewport entry
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.1
 */
const FeaturesSection = () => {
  const [activeTab, setActiveTab] = useState('job-matching');
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const tabs = [
    { id: 'job-matching', label: 'Job Matching' },
    { id: 'application-tracking', label: 'Application Tracking' },
    { id: 'profile-management', label: 'Profile Management' }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const handleKeyDown = (e, tabId, index) => {
    let newIndex = index;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleTabClick(tabId);
        break;
      
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = index > 0 ? index - 1 : tabs.length - 1;
        break;
      
      case 'ArrowRight':
        e.preventDefault();
        newIndex = index < tabs.length - 1 ? index + 1 : 0;
        break;
      
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      
      case 'End':
        e.preventDefault();
        newIndex = tabs.length - 1;
        break;
      
      default:
        return;
    }

    // Focus and activate the new tab if arrow keys were pressed
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Home' || e.key === 'End') {
      const newTabId = tabs[newIndex].id;
      handleTabClick(newTabId);
      // Focus will be handled by the button ref
      document.getElementById(`tab-${newTabId}`)?.focus();
    }
  };

  return (
    <section 
      ref={sectionRef}
      className={`features-section animate-on-scroll ${isVisible ? 'animate-in' : ''}`}
      aria-labelledby="features-heading"
    >
      <div className="features-container">
        <h2 id="features-heading" className="features-heading">
          Powerful Features to Accelerate Your Job Search
        </h2>
        
        {/* Tab List */}
        <div className="features-tab-list" role="tablist" aria-label="Feature categories">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              className={`features-tab ${activeTab === tab.id ? 'features-tab-active' : ''}`}
              onClick={() => handleTabClick(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, tab.id, index)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Panels */}
        <div className="features-tab-panels">
          {tabs.map((tab) => (
            <TabPanel
              key={tab.id}
              id={`tabpanel-${tab.id}`}
              tabId={`tab-${tab.id}`}
              isActive={activeTab === tab.id}
              features={featuresData[tab.id].items}
              title={featuresData[tab.id].title}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
