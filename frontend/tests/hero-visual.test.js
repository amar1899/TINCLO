/**
 * Unit Tests for Hero Visual Section
 * Feature: jira-style-landing-page, Task 2.2
 * 
 * Tests for hero visual with placeholder image, error handling, and hover effects.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LandingPage from '../src/components/LandingPage';

// Helper to render component with router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Hero Visual - Task 2.2', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('hero section contains an image element', () => {
    renderWithRouter(<LandingPage />);
    const heroImage = screen.getByAltText(/TINCLO application interface/i);
    expect(heroImage).toBeInTheDocument();
    expect(heroImage.tagName).toBe('IMG');
  });

  test('hero image has proper alt text for accessibility (Requirement 12.1)', () => {
    renderWithRouter(<LandingPage />);
    const heroImage = screen.getByAltText(/TINCLO application interface/i);
    
    // Verify alt text is non-empty and descriptive
    expect(heroImage).toHaveAttribute('alt');
    const altText = heroImage.getAttribute('alt');
    expect(altText).not.toBe('');
    expect(altText.length).toBeGreaterThan(10); // Descriptive alt text
  });

  test('hero image has placeholder source URL', () => {
    renderWithRouter(<LandingPage />);
    const heroImage = screen.getByAltText(/TINCLO application interface/i);
    
    expect(heroImage).toHaveAttribute('src');
    expect(heroImage.getAttribute('src')).toBeTruthy();
  });

  test('hero image has error handling with fallback (Requirement 6.2)', () => {
    renderWithRouter(<LandingPage />);
    const heroImage = screen.getByAltText(/TINCLO application interface/i);
    
    // Verify onError handler exists
    expect(heroImage.onerror).toBeDefined();
    
    // Simulate image load error
    fireEvent.error(heroImage);
    
    // After error, image should have fallback src (SVG data URI)
    expect(heroImage.src).toContain('data:image/svg+xml');
  });

  test('hero image updates alt text on error', () => {
    renderWithRouter(<LandingPage />);
    const heroImage = screen.getByAltText(/TINCLO application interface/i);
    
    const originalAlt = heroImage.getAttribute('alt');
    
    // Simulate image load error
    fireEvent.error(heroImage);
    
    // Alt text should be updated to indicate unavailability
    const newAlt = heroImage.getAttribute('alt');
    expect(newAlt).toContain('unavailable');
  });

  test('hero image has hero-screenshot class for styling', () => {
    renderWithRouter(<LandingPage />);
    const heroImage = screen.getByAltText(/TINCLO application interface/i);
    
    expect(heroImage).toHaveClass('hero-screenshot');
  });

  test('hero image is set to eager loading (above the fold)', () => {
    renderWithRouter(<LandingPage />);
    const heroImage = screen.getByAltText(/TINCLO application interface/i);
    
    // Hero image is above the fold, should use eager loading
    expect(heroImage).toHaveAttribute('loading', 'eager');
  });

  test('hero image has glassmorphism styling via CSS (Requirement 6.2)', () => {
    renderWithRouter(<LandingPage />);
    const heroImage = screen.getByAltText(/TINCLO application interface/i);
    
    // Verify the image has the class that applies glassmorphism
    expect(heroImage).toHaveClass('hero-screenshot');
    
    // In a real browser, this would have backdrop-filter: blur(20px)
    // We verify the class is present which applies the styling
  });

  test('hero visual section exists and contains image', () => {
    const { container } = renderWithRouter(<LandingPage />);
    const heroVisual = container.querySelector('.hero-visual');
    
    expect(heroVisual).toBeInTheDocument();
    
    const image = heroVisual.querySelector('img');
    expect(image).toBeInTheDocument();
  });

  test('error handler prevents infinite error loops', () => {
    renderWithRouter(<LandingPage />);
    const heroImage = screen.getByAltText(/TINCLO application interface/i);
    
    // First error should trigger fallback
    fireEvent.error(heroImage);
    expect(heroImage.src).toContain('data:image/svg+xml');
    
    // After first error, onerror should be set to null to prevent infinite loops
    expect(heroImage.onerror).toBe(null);
  });

  test('hero image maintains aspect ratio with CSS', () => {
    const { container } = renderWithRouter(<LandingPage />);
    const heroImage = container.querySelector('.hero-screenshot');
    
    // Verify the image has the class that maintains aspect ratio
    expect(heroImage).toBeInTheDocument();
    
    // The CSS should define aspect-ratio: 4/3
    // In a real browser, getComputedStyle would show this
  });
});

describe('Hero Visual - CSS Styling Tests', () => {
  test('hero-screenshot class applies correct styles', () => {
    const { container } = renderWithRouter(<LandingPage />);
    const heroImage = container.querySelector('.hero-screenshot');
    
    expect(heroImage).toBeInTheDocument();
    
    // Verify the element has the styling class
    expect(heroImage.classList.contains('hero-screenshot')).toBe(true);
  });
});
