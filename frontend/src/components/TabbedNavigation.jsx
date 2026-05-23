import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import './TabbedNavigation.css';

/**
 * TabbedNavigation Component
 * 
 * A fully accessible tabbed navigation component with keyboard support.
 * Allows users to switch between different feature categories.
 * 
 * Features:
 * - ARIA attributes for accessibility (role="tablist", role="tab", role="tabpanel")
 * - Keyboard navigation (Tab, Enter, ArrowLeft, ArrowRight)
 * - Visual indicator for active tab
 * - Smooth content transitions
 * 
 * Requirements: 3.1, 3.3, 12.3
 */
const TabbedNavigation = ({ tabs, defaultTab, onTabChange }) => {
  // Validate defaultTab and fall back to first tab if invalid
  const getInitialTab = () => {
    if (tabs.length === 0) return null;
    if (defaultTab && tabs.some(tab => tab.id === defaultTab)) {
      return defaultTab;
    }
    return tabs[0].id;
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab());
  const tabRefs = useRef({});

  // Handle tab click
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  // Handle keyboard navigation
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

    // Focus the new tab if arrow keys were pressed
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Home' || e.key === 'End') {
      const newTabId = tabs[newIndex].id;
      if (tabRefs.current[newTabId]) {
        tabRefs.current[newTabId].focus();
        handleTabClick(newTabId);
      }
    }
  };

  return (
    <div className="tabbed-navigation">
      {/* Tab List */}
      <div className="tab-list" role="tablist" aria-label="Feature categories">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={el => tabRefs.current[tab.id] = el}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            className={`tab ${activeTab === tab.id ? 'tab-active' : ''}`}
            onClick={() => handleTabClick(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, tab.id, index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`tabpanel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={activeTab !== tab.id}
          className={`tab-panel ${activeTab === tab.id ? 'tab-panel-active' : ''}`}
          tabIndex={0}
        >
          {activeTab === tab.id && tab.content}
        </div>
      ))}
    </div>
  );
};

TabbedNavigation.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
    })
  ).isRequired,
  defaultTab: PropTypes.string,
  onTabChange: PropTypes.func,
};

export default TabbedNavigation;
