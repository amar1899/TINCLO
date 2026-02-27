/**
 * Unit Tests for TabbedNavigation Component
 * Feature: jira-style-landing-page
 * 
 * Tests the tabbed navigation component functionality including:
 * - Tab list rendering with ARIA attributes
 * - Active tab state management
 * - Keyboard navigation (Tab, Enter, Arrow keys)
 * - Visual indicator for active tab
 * 
 * Requirements: 3.1, 3.3, 12.3
 */

import { render, fireEvent, screen, cleanup } from '@testing-library/react';
import TabbedNavigation from '../src/components/TabbedNavigation';

describe('TabbedNavigation Component', () => {
  // Sample tabs data for testing
  const mockTabs = [
    {
      id: 'tab1',
      label: 'Tab One',
      content: <div>Content for Tab One</div>
    },
    {
      id: 'tab2',
      label: 'Tab Two',
      content: <div>Content for Tab Two</div>
    },
    {
      id: 'tab3',
      label: 'Tab Three',
      content: <div>Content for Tab Three</div>
    }
  ];

  afterEach(() => {
    cleanup();
  });

  describe('Rendering and Structure', () => {
    test('renders tab list with role="tablist"', () => {
      const { container } = render(<TabbedNavigation tabs={mockTabs} />);
      const tablist = container.querySelector('[role="tablist"]');
      
      expect(tablist).toBeInTheDocument();
      expect(tablist).toHaveAttribute('aria-label', 'Feature categories');
    });

    test('renders all tabs with correct labels', () => {
      render(<TabbedNavigation tabs={mockTabs} />);
      
      expect(screen.getByText('Tab One')).toBeInTheDocument();
      expect(screen.getByText('Tab Two')).toBeInTheDocument();
      expect(screen.getByText('Tab Three')).toBeInTheDocument();
    });

    test('each tab has role="tab" attribute', () => {
      const { container } = render(<TabbedNavigation tabs={mockTabs} />);
      const tabs = container.querySelectorAll('[role="tab"]');
      
      expect(tabs.length).toBe(3);
    });

    test('each tab has proper ARIA attributes', () => {
      const { container } = render(<TabbedNavigation tabs={mockTabs} />);
      const firstTab = container.querySelector('[role="tab"]');
      
      expect(firstTab).toHaveAttribute('id');
      expect(firstTab).toHaveAttribute('aria-selected');
      expect(firstTab).toHaveAttribute('aria-controls');
    });

    test('renders tab panels with role="tabpanel"', () => {
      const { container } = render(<TabbedNavigation tabs={mockTabs} />);
      const tabpanels = container.querySelectorAll('[role="tabpanel"]');
      
      expect(tabpanels.length).toBe(3);
    });
  });

  describe('Active Tab State Management', () => {
    test('first tab is active by default', () => {
      const { container } = render(<TabbedNavigation tabs={mockTabs} />);
      const firstTab = container.querySelector('[role="tab"]');
      
      expect(firstTab).toHaveAttribute('aria-selected', 'true');
      expect(firstTab).toHaveClass('tab-active');
    });

    test('specified defaultTab is active on mount', () => {
      const { container } = render(
        <TabbedNavigation tabs={mockTabs} defaultTab="tab2" />
      );
      const secondTab = container.querySelector('#tab-tab2');
      
      expect(secondTab).toHaveAttribute('aria-selected', 'true');
      expect(secondTab).toHaveClass('tab-active');
    });

    test('only one tab has aria-selected="true" at a time', () => {
      const { container } = render(<TabbedNavigation tabs={mockTabs} />);
      const selectedTabs = container.querySelectorAll('[aria-selected="true"]');
      
      expect(selectedTabs.length).toBe(1);
    });

    test('active tab has tab-active class', () => {
      const { container } = render(<TabbedNavigation tabs={mockTabs} />);
      const activeTabs = container.querySelectorAll('.tab-active');
      
      expect(activeTabs.length).toBe(1);
    });

    test('inactive tabs do not have tab-active class', () => {
      const { container } = render(<TabbedNavigation tabs={mockTabs} />);
      const allTabs = container.querySelectorAll('[role="tab"]');
      const inactiveTabs = Array.from(allTabs).filter(
        tab => tab.getAttribute('aria-selected') === 'false'
      );
      
      inactiveTabs.forEach(tab => {
        expect(tab).not.toHaveClass('tab-active');
      });
    });
  });

  describe('Tab Switching', () => {
    test('clicking a tab makes it active', () => {
      const { container } = render(<TabbedNavigation tabs={mockTabs} />);
      const secondTab = container.querySelector('#tab-tab2');
      
      fireEvent.click(secondTab);
      
      expect(secondTab).toHaveAttribute('aria-selected', 'true');
      expect(secondTab).toHaveClass('tab-active');
    });

    test('clicking a tab displays its content', () => {
      render(<TabbedNavigation tabs={mockTabs} />);
      const secondTab = screen.getByText('Tab Two');
      
      fireEvent.click(secondTab);
      
      expect(screen.getByText('Content for Tab Two')).toBeVisible();
    });

    test('clicking a tab hides other tab content', () => {
      const { container } = render(<TabbedNavigation tabs={mockTabs} />);
      const secondTab = screen.getByText('Tab Two');
      
      fireEvent.click(secondTab);
      
      const firstPanel = container.querySelector('#tabpanel-tab1');
      expect(firstPanel).toHaveAttribute('hidden');
    });

    test('onTabChange callback is called when tab is clicked', () => {
      const mockCallback = jest.fn();
      render(
        <TabbedNavigation tabs={mockTabs} onTabChange={mockCallback} />
      );
      const secondTab = screen.getByText('Tab Two');
      
      fireEvent.click(secondTab);
      
      expect(mockCallback).toHaveBeenCalledWith('tab2');
    });
  });

  describe('Keyboard Navigation', () => {
    test('Enter key activates a tab', () => {
      const { container } = render(<TabbedNavigation tabs={mockTabs} />);
      const secondTab = container.querySelector('#tab-tab2');
      
      secondTab.focus();
      fireEvent.keyDown(secondTab, { key: 'Enter' });
      
      expect(secondTab).toHaveAttribute('aria-selected', 'true');
    });

    test('Space key activates a tab', () => {
      const { container } = render(<TabbedNavigation tabs={mockTabs} />);
      const secondTab = container.querySelector('#tab-tab2');
      
      secondTab.focus();
      fireEvent.keyDown(secondTab, { key: ' ' });
      
      expect(secondTab).toHaveAttribute('aria-selected', 'true');
    });

    test('ArrowRight moves focus to next tab', () => {
      const { container } = render(<TabbedNavigation tabs={mockTabs} />);
      const firstTab = container.querySelector('#tab-tab1');
      const secondTab = container.querySelector('#tab-tab2');
      
      firstTab.focus();
      fireEvent.keyDown(firstTab, { key: 'ArrowRight' });
      
      expect(secondTab).toHaveAttribute('aria-selected', 'true');
    });

    test('ArrowLeft moves focus to previous tab', () => {
      const { container } = render(
        <TabbedNavigation tabs={mockTabs} defaultTab="tab2" />
      );
      const firstTab = container.querySelector('#tab-tab1');
      const secondTab = container.querySelector('#tab-tab2');
      
      secondTab.focus();
      fireEvent.keyDown(secondTab, { key: 'ArrowLeft' });
      
      expect(firstTab).toHaveAttribute('aria-selected', 'true');
    });

    test('ArrowRight wraps from last tab to first tab', () => {
      const { container } = render(
        <TabbedNavigation tabs={mockTabs} defaultTab="tab3" />
      );
      const firstTab = container.querySelector('#tab-tab1');
      const thirdTab = container.querySelector('#tab-tab3');
      
      thirdTab.focus();
      fireEvent.keyDown(thirdTab, { key: 'ArrowRight' });
      
      expect(firstTab).toHaveAttribute('aria-selected', 'true');
    });

    test('ArrowLeft wraps from first tab to last tab', () => {
      const { container } = render(<TabbedNavigation tabs={mockTabs} />);
      const firstTab = container.querySelector('#tab-tab1');
      const thirdTab = container.querySelector('#tab-tab3');
      
      firstTab.focus();
      fireEvent.keyDown(firstTab, { key: 'ArrowLeft' });
      
      expect(thirdTab).toHaveAttribute('aria-selected', 'true');
    });

    test('Home key moves to first tab', () => {
      const { container } = render(
        <TabbedNavigation tabs={mockTabs} defaultTab="tab3" />
      );
      const firstTab = container.querySelector('#tab-tab1');
      const thirdTab = container.querySelector('#tab-tab3');
      
      thirdTab.focus();
      fireEvent.keyDown(thirdTab, { key: 'Home' });
      
      expect(firstTab).toHaveAttribute('aria-selected', 'true');
    });

    test('End key moves to last tab', () => {
      const { container } = render(<TabbedNavigation tabs={mockTabs} />);
      const firstTab = container.querySelector('#tab-tab1');
      const thirdTab = container.querySelector('#tab-tab3');
      
      firstTab.focus();
      fireEvent.keyDown(firstTab, { key: 'End' });
      
      expect(thirdTab).toHaveAttribute('aria-selected', 'true');
    });

    test('active tab has tabIndex 0, inactive tabs have tabIndex -1', () => {
      const { container } = render(<TabbedNavigation tabs={mockTabs} />);
      const firstTab = container.querySelector('#tab-tab1');
      const secondTab = container.querySelector('#tab-tab2');
      
      expect(firstTab).toHaveAttribute('tabIndex', '0');
      expect(secondTab).toHaveAttribute('tabIndex', '-1');
    });
  });

  describe('Visual Indicators', () => {
    test('active tab has visual indicator class', () => {
      const { container } = render(<TabbedNavigation tabs={mockTabs} />);
      const firstTab = container.querySelector('#tab-tab1');
      
      expect(firstTab).toHaveClass('tab-active');
    });

    test('switching tabs updates visual indicator', () => {
      const { container } = render(<TabbedNavigation tabs={mockTabs} />);
      const firstTab = container.querySelector('#tab-tab1');
      const secondTab = container.querySelector('#tab-tab2');
      
      expect(firstTab).toHaveClass('tab-active');
      expect(secondTab).not.toHaveClass('tab-active');
      
      fireEvent.click(secondTab);
      
      expect(firstTab).not.toHaveClass('tab-active');
      expect(secondTab).toHaveClass('tab-active');
    });
  });

  describe('Content Display', () => {
    test('only active tab panel is visible', () => {
      const { container } = render(<TabbedNavigation tabs={mockTabs} />);
      const firstPanel = container.querySelector('#tabpanel-tab1');
      const secondPanel = container.querySelector('#tabpanel-tab2');
      
      expect(firstPanel).not.toHaveAttribute('hidden');
      expect(secondPanel).toHaveAttribute('hidden');
    });

    test('tab panel has correct aria-labelledby', () => {
      const { container } = render(<TabbedNavigation tabs={mockTabs} />);
      const firstPanel = container.querySelector('#tabpanel-tab1');
      
      expect(firstPanel).toHaveAttribute('aria-labelledby', 'tab-tab1');
    });

    test('tab has correct aria-controls', () => {
      const { container } = render(<TabbedNavigation tabs={mockTabs} />);
      const firstTab = container.querySelector('#tab-tab1');
      
      expect(firstTab).toHaveAttribute('aria-controls', 'tabpanel-tab1');
    });

    test('switching tabs shows correct content', () => {
      render(<TabbedNavigation tabs={mockTabs} />);
      
      expect(screen.getByText('Content for Tab One')).toBeVisible();
      
      const secondTab = screen.getByText('Tab Two');
      fireEvent.click(secondTab);
      
      expect(screen.getByText('Content for Tab Two')).toBeVisible();
    });
  });

  describe('Edge Cases', () => {
    test('handles empty tabs array gracefully', () => {
      const { container } = render(<TabbedNavigation tabs={[]} />);
      const tablist = container.querySelector('[role="tablist"]');
      
      expect(tablist).toBeInTheDocument();
      expect(tablist.children.length).toBe(0);
    });

    test('handles single tab', () => {
      const singleTab = [mockTabs[0]];
      const { container } = render(<TabbedNavigation tabs={singleTab} />);
      const tabs = container.querySelectorAll('[role="tab"]');
      
      expect(tabs.length).toBe(1);
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    });

    test('handles invalid defaultTab by selecting first tab', () => {
      const { container } = render(
        <TabbedNavigation tabs={mockTabs} defaultTab="invalid-tab" />
      );
      const firstTab = container.querySelector('#tab-tab1');
      
      // Should fall back to first tab
      expect(firstTab).toHaveAttribute('aria-selected', 'true');
    });
  });
});
