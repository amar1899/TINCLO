import { useState, useRef } from 'react';
import PropTypes from 'prop-types';

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
    <div className="w-full mx-auto">
      {/* Tab List */}
      <div
        className="flex gap-0 border-b-2 border-white/10 mb-8 overflow-x-auto [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent] [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-sm"
        role="tablist"
        aria-label="Feature categories"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={el => tabRefs.current[tab.id] = el}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            className={[
              'flex-1 min-w-[150px] px-6 py-4 bg-transparent border-none border-b-[3px] text-base font-medium cursor-pointer transition-all duration-300 relative whitespace-nowrap',
              'focus:outline-[2px] focus:outline-[#4a90e2] focus:-outline-offset-[2px] focus:z-10',
              'focus:not(:focus-visible):outline-none',
              'focus-visible:outline-[2px] focus-visible:outline-[#4a90e2] focus-visible:-outline-offset-[2px]',
              activeTab === tab.id
                ? 'text-white border-b-[#4a90e2] bg-[rgba(74,144,226,0.1)]'
                : 'text-white/60 border-b-transparent hover:text-white/90 hover:bg-white/5',
            ].join(' ')}
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
          className={[
            'py-8',
            activeTab === tab.id ? 'block animate-[fadeIn_0.2s_ease-in-out]' : '',
          ].join(' ')}
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
