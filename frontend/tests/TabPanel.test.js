/**
 * Unit Tests for TabPanel Component
 * Feature: jira-style-landing-page
 * 
 * Tests the tab panel component functionality including:
 * - Tab panel rendering with ARIA attributes
 * - Feature cards display
 * - Fade transition animation (200ms)
 * - Content switching based on active state
 * 
 * Requirements: 3.2, 3.5
 */

import { render, screen, cleanup } from '@testing-library/react';
import TabPanel from '../src/components/TabPanel';

describe('TabPanel Component', () => {
  // Sample features data for testing
  const mockFeatures = [
    {
      id: 'feature1',
      title: 'Feature One',
      description: 'Description for feature one',
      icon: '🎯',
      screenshot: '/assets/feature1.png'
    },
    {
      id: 'feature2',
      title: 'Feature Two',
      description: 'Description for feature two',
      icon: '⚡',
      screenshot: '/assets/feature2.png'
    }
  ];

  const defaultProps = {
    id: 'tabpanel-test',
    tabId: 'tab-test',
    isActive: true,
    features: mockFeatures,
    title: 'Test Features'
  };

  afterEach(() => {
    cleanup();
  });

  describe('Rendering and Structure', () => {
    test('renders tab panel with role="tabpanel"', () => {
      const { container } = render(<TabPanel {...defaultProps} />);
      const tabpanel = container.querySelector('[role="tabpanel"]');
      
      expect(tabpanel).toBeInTheDocument();
    });

    test('tab panel has correct id attribute', () => {
      const { container } = render(<TabPanel {...defaultProps} />);
      const tabpanel = container.querySelector('[role="tabpanel"]');
      
      expect(tabpanel).toHaveAttribute('id', 'tabpanel-test');
    });

    test('tab panel has aria-labelledby attribute', () => {
      const { container } = render(<TabPanel {...defaultProps} />);
      const tabpanel = container.querySelector('[role="tabpanel"]');
      
      expect(tabpanel).toHaveAttribute('aria-labelledby', 'tab-test');
    });

    test('tab panel has aria-controls attribute', () => {
      const { container } = render(<TabPanel {...defaultProps} />);
      const tabpanel = container.querySelector('[role="tabpanel"]');
      
      expect(tabpanel).toHaveAttribute('aria-controls', 'tab-test');
    });

    test('renders panel title when active', () => {
      render(<TabPanel {...defaultProps} />);
      
      expect(screen.getByText('Test Features')).toBeInTheDocument();
    });

    test('renders feature cards grid', () => {
      const { container } = render(<TabPanel {...defaultProps} />);
      const grid = container.querySelector('.feature-cards-grid');
      
      expect(grid).toBeInTheDocument();
    });
  });

  describe('Feature Cards Display', () => {
    test('renders all feature cards', () => {
      const { container } = render(<TabPanel {...defaultProps} />);
      const cards = container.querySelectorAll('.feature-card');
      
      expect(cards.length).toBe(2);
    });

    test('displays feature icons', () => {
      render(<TabPanel {...defaultProps} />);
      
      expect(screen.getByText('🎯')).toBeInTheDocument();
      expect(screen.getByText('⚡')).toBeInTheDocument();
    });

    test('displays feature titles', () => {
      render(<TabPanel {...defaultProps} />);
      
      expect(screen.getByText('Feature One')).toBeInTheDocument();
      expect(screen.getByText('Feature Two')).toBeInTheDocument();
    });

    test('displays feature descriptions', () => {
      render(<TabPanel {...defaultProps} />);
      
      expect(screen.getByText('Description for feature one')).toBeInTheDocument();
      expect(screen.getByText('Description for feature two')).toBeInTheDocument();
    });

    test('renders feature screenshots with lazy loading', () => {
      const { container } = render(<TabPanel {...defaultProps} />);
      const images = container.querySelectorAll('.feature-card-screenshot img');
      
      expect(images.length).toBe(2);
      images.forEach(img => {
        expect(img).toHaveAttribute('loading', 'lazy');
      });
    });

    test('feature screenshots have proper alt text', () => {
      const { container } = render(<TabPanel {...defaultProps} />);
      const images = container.querySelectorAll('.feature-card-screenshot img');
      
      expect(images[0]).toHaveAttribute('alt', 'Feature One screenshot');
      expect(images[1]).toHaveAttribute('alt', 'Feature Two screenshot');
    });
  });

  describe('Active State Management', () => {
    test('active panel is visible', () => {
      const { container } = render(<TabPanel {...defaultProps} isActive={true} />);
      const tabpanel = container.querySelector('[role="tabpanel"]');
      
      expect(tabpanel).not.toHaveAttribute('hidden');
      expect(tabpanel).toHaveClass('tab-panel-content-active');
    });

    test('inactive panel is hidden', () => {
      const { container } = render(<TabPanel {...defaultProps} isActive={false} />);
      const tabpanel = container.querySelector('[role="tabpanel"]');
      
      expect(tabpanel).toHaveAttribute('hidden');
      expect(tabpanel).not.toHaveClass('tab-panel-content-active');
    });

    test('inactive panel does not render content', () => {
      render(<TabPanel {...defaultProps} isActive={false} />);
      
      expect(screen.queryByText('Test Features')).not.toBeInTheDocument();
      expect(screen.queryByText('Feature One')).not.toBeInTheDocument();
    });

    test('active panel renders content', () => {
      render(<TabPanel {...defaultProps} isActive={true} />);
      
      expect(screen.getByText('Test Features')).toBeInTheDocument();
      expect(screen.getByText('Feature One')).toBeInTheDocument();
    });
  });

  describe('Fade Transition Animation', () => {
    test('active panel has fade-in animation class', () => {
      const { container } = render(<TabPanel {...defaultProps} isActive={true} />);
      const tabpanel = container.querySelector('[role="tabpanel"]');
      
      expect(tabpanel).toHaveClass('tab-panel-content-active');
    });

    test('panel has transition styles applied', () => {
      const { container } = render(<TabPanel {...defaultProps} />);
      const tabpanel = container.querySelector('[role="tabpanel"]');
      
      expect(tabpanel).toHaveClass('tab-panel-content');
    });
  });

  describe('Image Error Handling', () => {
    test('handles image load errors with fallback', () => {
      const { container } = render(<TabPanel {...defaultProps} />);
      const images = container.querySelectorAll('.feature-card-screenshot img');
      
      // Simulate image error
      const firstImage = images[0];
      const errorEvent = new Event('error');
      firstImage.dispatchEvent(errorEvent);
      
      // Check that fallback SVG is set
      expect(firstImage.src).toContain('data:image/svg+xml');
    });

    test('updates alt text on image error', () => {
      const { container } = render(<TabPanel {...defaultProps} />);
      const images = container.querySelectorAll('.feature-card-screenshot img');
      
      // Simulate image error
      const firstImage = images[0];
      const errorEvent = new Event('error');
      firstImage.dispatchEvent(errorEvent);
      
      // Check that alt text is updated
      expect(firstImage.alt).toContain('unavailable');
    });
  });

  describe('Edge Cases', () => {
    test('handles empty features array', () => {
      const { container } = render(
        <TabPanel {...defaultProps} features={[]} />
      );
      const cards = container.querySelectorAll('.feature-card');
      
      expect(cards.length).toBe(0);
    });

    test('handles features without screenshots', () => {
      const featuresWithoutScreenshots = [
        {
          id: 'feature1',
          title: 'Feature One',
          description: 'Description',
          icon: '🎯'
        }
      ];
      
      const { container } = render(
        <TabPanel {...defaultProps} features={featuresWithoutScreenshots} />
      );
      const screenshots = container.querySelectorAll('.feature-card-screenshot');
      
      expect(screenshots.length).toBe(0);
    });

    test('renders single feature correctly', () => {
      const singleFeature = [mockFeatures[0]];
      const { container } = render(
        <TabPanel {...defaultProps} features={singleFeature} />
      );
      const cards = container.querySelectorAll('.feature-card');
      
      expect(cards.length).toBe(1);
      expect(screen.getByText('Feature One')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('tab panel has tabIndex for keyboard navigation', () => {
      const { container } = render(<TabPanel {...defaultProps} />);
      const tabpanel = container.querySelector('[role="tabpanel"]');
      
      expect(tabpanel).toHaveAttribute('tabIndex', '0');
    });

    test('all images have alt attributes', () => {
      const { container } = render(<TabPanel {...defaultProps} />);
      const images = container.querySelectorAll('img');
      
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
        expect(img.getAttribute('alt')).not.toBe('');
      });
    });
  });
});
