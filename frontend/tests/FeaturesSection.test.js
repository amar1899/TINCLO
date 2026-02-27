/**
 * Unit Tests for FeaturesSection Component
 * Feature: jira-style-landing-page
 * 
 * Tests the features section component functionality including:
 * - Section rendering with tabs and panels
 * - Tab switching and content display
 * - Integration with TabPanel component
 * - Keyboard navigation
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
 */

import { render, fireEvent, screen, cleanup } from '@testing-library/react';
import FeaturesSection from '../src/components/FeaturesSection';

describe('FeaturesSection Component', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Rendering and Structure', () => {
    test('renders features section with heading', () => {
      render(<FeaturesSection />);
      
      expect(screen.getByText('Powerful Features to Accelerate Your Job Search')).toBeInTheDocument();
    });

    test('renders tab list with role="tablist"', () => {
      const { container } = render(<FeaturesSection />);
      const tablist = container.querySelector('[role="tablist"]');
      
      expect(tablist).toBeInTheDocument();
      expect(tablist).toHaveAttribute('aria-label', 'Feature categories');
    });

    test('renders all three tabs', () => {
      render(<FeaturesSection />);
      
      expect(screen.getByText('Job Matching')).toBeInTheDocument();
      expect(screen.getByText('Application Tracking')).toBeInTheDocument();
      expect(screen.getByText('Profile Management')).toBeInTheDocument();
    });

    test('each tab has role="tab" attribute', () => {
      const { container } = render(<FeaturesSection />);
      const tabs = container.querySelectorAll('[role="tab"]');
      
      expect(tabs.length).toBe(3);
    });

    test('renders tab panels container', () => {
      const { container } = render(<FeaturesSection />);
      const panelsContainer = container.querySelector('.features-tab-panels');
      
      expect(panelsContainer).toBeInTheDocument();
    });
  });

  describe('Tab State Management', () => {
    test('first tab (Job Matching) is active by default', () => {
      const { container } = render(<FeaturesSection />);
      const firstTab = container.querySelector('#tab-job-matching');
      
      expect(firstTab).toHaveAttribute('aria-selected', 'true');
      expect(firstTab).toHaveClass('features-tab-active');
    });

    test('only one tab has aria-selected="true" at a time', () => {
      const { container } = render(<FeaturesSection />);
      const selectedTabs = container.querySelectorAll('[aria-selected="true"]');
      
      expect(selectedTabs.length).toBe(1);
    });

    test('active tab has features-tab-active class', () => {
      const { container } = render(<FeaturesSection />);
      const activeTabs = container.querySelectorAll('.features-tab-active');
      
      expect(activeTabs.length).toBe(1);
    });
  });

  describe('Tab Switching', () => {
    test('clicking a tab makes it active', () => {
      const { container } = render(<FeaturesSection />);
      const secondTab = container.querySelector('#tab-application-tracking');
      
      fireEvent.click(secondTab);
      
      expect(secondTab).toHaveAttribute('aria-selected', 'true');
      expect(secondTab).toHaveClass('features-tab-active');
    });

    test('clicking a tab displays its content', () => {
      render(<FeaturesSection />);
      const secondTab = screen.getByText('Application Tracking');
      
      fireEvent.click(secondTab);
      
      // Check for content from application tracking features
      expect(screen.getByText('Application Management')).toBeInTheDocument();
    });

    test('switching tabs updates visual indicator', () => {
      const { container } = render(<FeaturesSection />);
      const firstTab = container.querySelector('#tab-job-matching');
      const secondTab = container.querySelector('#tab-application-tracking');
      
      expect(firstTab).toHaveClass('features-tab-active');
      expect(secondTab).not.toHaveClass('features-tab-active');
      
      fireEvent.click(secondTab);
      
      expect(firstTab).not.toHaveClass('features-tab-active');
      expect(secondTab).toHaveClass('features-tab-active');
    });

    test('switching tabs shows correct panel content', () => {
      render(<FeaturesSection />);
      
      // Default: Job Matching content
      expect(screen.getByText('Smart Job Matching')).toBeInTheDocument();
      
      // Switch to Application Tracking
      const secondTab = screen.getByText('Application Tracking');
      fireEvent.click(secondTab);
      
      expect(screen.getByText('Application Management')).toBeInTheDocument();
      
      // Switch to Profile Management
      const thirdTab = screen.getByText('Profile Management');
      fireEvent.click(thirdTab);
      
      expect(screen.getByText('Profile & Preferences')).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    test('Enter key activates a tab', () => {
      const { container } = render(<FeaturesSection />);
      const secondTab = container.querySelector('#tab-application-tracking');
      
      secondTab.focus();
      fireEvent.keyDown(secondTab, { key: 'Enter' });
      
      expect(secondTab).toHaveAttribute('aria-selected', 'true');
    });

    test('Space key activates a tab', () => {
      const { container } = render(<FeaturesSection />);
      const secondTab = container.querySelector('#tab-application-tracking');
      
      secondTab.focus();
      fireEvent.keyDown(secondTab, { key: ' ' });
      
      expect(secondTab).toHaveAttribute('aria-selected', 'true');
    });

    test('ArrowRight moves to next tab', () => {
      const { container } = render(<FeaturesSection />);
      const firstTab = container.querySelector('#tab-job-matching');
      const secondTab = container.querySelector('#tab-application-tracking');
      
      firstTab.focus();
      fireEvent.keyDown(firstTab, { key: 'ArrowRight' });
      
      expect(secondTab).toHaveAttribute('aria-selected', 'true');
    });

    test('ArrowLeft moves to previous tab', () => {
      const { container } = render(<FeaturesSection />);
      const firstTab = container.querySelector('#tab-job-matching');
      const secondTab = container.querySelector('#tab-application-tracking');
      
      // First activate second tab
      fireEvent.click(secondTab);
      
      secondTab.focus();
      fireEvent.keyDown(secondTab, { key: 'ArrowLeft' });
      
      expect(firstTab).toHaveAttribute('aria-selected', 'true');
    });

    test('ArrowRight wraps from last tab to first tab', () => {
      const { container } = render(<FeaturesSection />);
      const firstTab = container.querySelector('#tab-job-matching');
      const thirdTab = container.querySelector('#tab-profile-management');
      
      // Activate third tab
      fireEvent.click(thirdTab);
      
      thirdTab.focus();
      fireEvent.keyDown(thirdTab, { key: 'ArrowRight' });
      
      expect(firstTab).toHaveAttribute('aria-selected', 'true');
    });

    test('ArrowLeft wraps from first tab to last tab', () => {
      const { container } = render(<FeaturesSection />);
      const firstTab = container.querySelector('#tab-job-matching');
      const thirdTab = container.querySelector('#tab-profile-management');
      
      firstTab.focus();
      fireEvent.keyDown(firstTab, { key: 'ArrowLeft' });
      
      expect(thirdTab).toHaveAttribute('aria-selected', 'true');
    });

    test('Home key moves to first tab', () => {
      const { container } = render(<FeaturesSection />);
      const firstTab = container.querySelector('#tab-job-matching');
      const thirdTab = container.querySelector('#tab-profile-management');
      
      // Activate third tab
      fireEvent.click(thirdTab);
      
      thirdTab.focus();
      fireEvent.keyDown(thirdTab, { key: 'Home' });
      
      expect(firstTab).toHaveAttribute('aria-selected', 'true');
    });

    test('End key moves to last tab', () => {
      const { container } = render(<FeaturesSection />);
      const firstTab = container.querySelector('#tab-job-matching');
      const thirdTab = container.querySelector('#tab-profile-management');
      
      firstTab.focus();
      fireEvent.keyDown(firstTab, { key: 'End' });
      
      expect(thirdTab).toHaveAttribute('aria-selected', 'true');
    });

    test('active tab has tabIndex 0, inactive tabs have tabIndex -1', () => {
      const { container } = render(<FeaturesSection />);
      const firstTab = container.querySelector('#tab-job-matching');
      const secondTab = container.querySelector('#tab-application-tracking');
      
      expect(firstTab).toHaveAttribute('tabIndex', '0');
      expect(secondTab).toHaveAttribute('tabIndex', '-1');
    });
  });

  describe('Content Display', () => {
    test('displays feature cards for active tab', () => {
      const { container } = render(<FeaturesSection />);
      const featureCards = container.querySelectorAll('.feature-card');
      
      // Job Matching has 3 features
      expect(featureCards.length).toBeGreaterThan(0);
    });

    test('tab panel has correct ARIA attributes', () => {
      const { container } = render(<FeaturesSection />);
      const firstPanel = container.querySelector('#tabpanel-job-matching');
      
      expect(firstPanel).toHaveAttribute('role', 'tabpanel');
      expect(firstPanel).toHaveAttribute('aria-labelledby', 'tab-job-matching');
      expect(firstPanel).toHaveAttribute('aria-controls', 'tab-job-matching');
    });

    test('only active panel is visible', () => {
      const { container } = render(<FeaturesSection />);
      const firstPanel = container.querySelector('#tabpanel-job-matching');
      const secondPanel = container.querySelector('#tabpanel-application-tracking');
      
      expect(firstPanel).not.toHaveAttribute('hidden');
      expect(secondPanel).toHaveAttribute('hidden');
    });
  });

  describe('Integration with TabPanel', () => {
    test('renders TabPanel components for each tab', () => {
      const { container } = render(<FeaturesSection />);
      const tabpanels = container.querySelectorAll('[role="tabpanel"]');
      
      expect(tabpanels.length).toBe(3);
    });

    test('TabPanel receives correct features data', () => {
      render(<FeaturesSection />);
      
      // Check for Job Matching features
      expect(screen.getByText('Intuitive Swipe Interface')).toBeInTheDocument();
      expect(screen.getByText('AI-Powered Recommendations')).toBeInTheDocument();
    });

    test('TabPanel displays feature icons', () => {
      render(<FeaturesSection />);
      
      // Check for icons from Job Matching features
      expect(screen.getByText('👍')).toBeInTheDocument();
      expect(screen.getByText('🎯')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('section has aria-labelledby attribute', () => {
      const { container } = render(<FeaturesSection />);
      const section = container.querySelector('.features-section');
      
      expect(section).toHaveAttribute('aria-labelledby', 'features-heading');
    });

    test('heading has correct id for aria-labelledby', () => {
      const { container } = render(<FeaturesSection />);
      const heading = container.querySelector('#features-heading');
      
      expect(heading).toBeInTheDocument();
      expect(heading.textContent).toBe('Powerful Features to Accelerate Your Job Search');
    });

    test('all tabs have proper ARIA attributes', () => {
      const { container } = render(<FeaturesSection />);
      const tabs = container.querySelectorAll('[role="tab"]');
      
      tabs.forEach(tab => {
        expect(tab).toHaveAttribute('id');
        expect(tab).toHaveAttribute('aria-selected');
        expect(tab).toHaveAttribute('aria-controls');
        expect(tab).toHaveAttribute('tabIndex');
      });
    });
  });
});
