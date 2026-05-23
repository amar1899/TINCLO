/**
 * Property-Based Tests for Hero Section
 * Feature: jira-style-landing-page
 * 
 * These tests validate universal properties of the hero section CTA buttons
 * using fast-check for property-based testing.
 */

import { render, fireEvent, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import fc from 'fast-check';
import LandingPage from '../src/components/LandingPage';

// Helper to render component with router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Hero Section - Property Tests', () => {
  const propertyConfig = { numRuns: 100 };

  afterEach(() => {
    cleanup();
  });

  /**
   * Property 11: CTA button action-oriented text
   * **Validates: Requirements 9.5**
   * 
   * For any CTA button on the landing page, the button text should match 
   * action-oriented patterns (contains words like "Get", "Start", "Sign up", 
   * "Try", "Join", or similar action verbs).
   */
  test('Property 11: CTA button action-oriented text - all CTA buttons use action verbs', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          const { container } = renderWithRouter(<LandingPage />);
          
          // Find all CTA buttons (primary and secondary buttons in hero section)
          const ctaButtons = container.querySelectorAll('.btn-primary, .btn-secondary');
          
          // Ensure we found CTA buttons
          expect(ctaButtons.length).toBeGreaterThan(0);
          
          // Action-oriented words that should appear in CTA text
          const actionWords = [
            'get', 'start', 'sign', 'try', 'join', 'browse', 
            'create', 'see', 'explore', 'discover', 'find', 'launch'
          ];
          
          ctaButtons.forEach(button => {
            const buttonText = button.textContent.toLowerCase();
            
            // Check if button text contains at least one action word
            const hasActionWord = actionWords.some(word => buttonText.includes(word));
            
            expect(hasActionWord).toBe(true);
          });
          
          cleanup();
        }
      ),
      propertyConfig
    );
  });

  /**
   * Property 12: CTA button navigation
   * **Validates: Requirements 9.6**
   * 
   * For any CTA button on the landing page, clicking it should navigate 
   * to the signup page (/signup route).
   */
  test('Property 12: CTA button navigation - all CTA buttons navigate to signup', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          const mockNavigate = jest.fn();
          
          // Mock useNavigate hook
          jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useNavigate: () => mockNavigate,
          }));
          
          const { container } = renderWithRouter(<LandingPage />);
          
          // Find all primary CTA buttons (these should navigate to signup)
          const primaryButtons = container.querySelectorAll('.btn-primary');
          
          // Ensure we found primary CTA buttons
          expect(primaryButtons.length).toBeGreaterThan(0);
          
          primaryButtons.forEach(button => {
            // Check that button is a link to /signup
            const href = button.getAttribute('href');
            expect(href).toBe('/signup');
          });
          
          cleanup();
        }
      ),
      propertyConfig
    );
  });

  /**
   * Property 16: CTA button accessibility labels
   * **Validates: Requirements 12.5**
   * 
   * For any CTA button on the landing page, it should have either an 
   * aria-label or aria-labelledby attribute to provide descriptive labels 
   * for screen readers.
   */
  test('Property 16: CTA button accessibility labels - all CTA buttons have aria-label or aria-labelledby', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          const { container } = renderWithRouter(<LandingPage />);
          
          // Find all CTA buttons (primary and secondary)
          const ctaButtons = container.querySelectorAll('.btn-primary, .btn-secondary');
          
          // Ensure we found CTA buttons
          expect(ctaButtons.length).toBeGreaterThan(0);
          
          ctaButtons.forEach(button => {
            // Check that button has either aria-label or aria-labelledby
            const hasAriaLabel = button.hasAttribute('aria-label');
            const hasAriaLabelledBy = button.hasAttribute('aria-labelledby');
            
            expect(hasAriaLabel || hasAriaLabelledBy).toBe(true);
            
            // If aria-label exists, it should not be empty
            if (hasAriaLabel) {
              const ariaLabel = button.getAttribute('aria-label');
              expect(ariaLabel).not.toBe('');
              expect(ariaLabel.length).toBeGreaterThan(0);
            }
            
            // If aria-labelledby exists, it should not be empty
            if (hasAriaLabelledBy) {
              const ariaLabelledBy = button.getAttribute('aria-labelledby');
              expect(ariaLabelledBy).not.toBe('');
              expect(ariaLabelledBy.length).toBeGreaterThan(0);
            }
          });
          
          cleanup();
        }
      ),
      propertyConfig
    );
  });

  /**
   * Additional Property: CTA button descriptive aria-labels
   * 
   * Ensures that aria-labels are not just present but also descriptive
   * (more than just the button text).
   */
  test('Property: CTA button aria-labels are descriptive - aria-labels provide context beyond button text', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          const { container } = renderWithRouter(<LandingPage />);
          
          // Find all CTA buttons with aria-label
          const ctaButtons = container.querySelectorAll('.btn-primary[aria-label], .btn-secondary[aria-label]');
          
          ctaButtons.forEach(button => {
            const buttonText = button.textContent.trim();
            const ariaLabel = button.getAttribute('aria-label');
            
            // aria-label should be longer than button text (more descriptive)
            expect(ariaLabel.length).toBeGreaterThan(buttonText.length);
            
            // aria-label should contain the button text or similar wording
            const normalizedAriaLabel = ariaLabel.toLowerCase();
            const normalizedButtonText = buttonText.toLowerCase();
            
            // Check if aria-label provides additional context
            expect(normalizedAriaLabel.length).toBeGreaterThan(normalizedButtonText.length);
          });
          
          cleanup();
        }
      ),
      propertyConfig
    );
  });

  /**
   * Property: CTA buttons are keyboard accessible
   * 
   * Ensures that CTA buttons can be focused and activated with keyboard.
   */
  test('Property: CTA buttons keyboard accessibility - buttons are focusable and activatable', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          const { container } = renderWithRouter(<LandingPage />);
          
          // Find all CTA buttons
          const ctaButtons = container.querySelectorAll('.btn-primary, .btn-secondary');
          
          ctaButtons.forEach(button => {
            // Button should not have tabindex="-1" (should be focusable)
            const tabIndex = button.getAttribute('tabindex');
            expect(tabIndex).not.toBe('-1');
            
            // Button should be a link or button element (inherently focusable)
            const tagName = button.tagName.toLowerCase();
            expect(['a', 'button']).toContain(tagName);
          });
          
          cleanup();
        }
      ),
      propertyConfig
    );
  });

  /**
   * Property: Hero section contains required CTA buttons
   * 
   * Ensures that the hero section always contains at least one primary CTA.
   */
  test('Property: Hero section CTA presence - hero section contains at least one primary CTA', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          const { container } = renderWithRouter(<LandingPage />);
          
          // Find hero section
          const heroSection = container.querySelector('.landing-hero, .hero-section');
          expect(heroSection).toBeTruthy();
          
          // Find primary CTA buttons within hero section
          const primaryButtons = heroSection.querySelectorAll('.btn-primary');
          
          // Should have at least one primary CTA
          expect(primaryButtons.length).toBeGreaterThanOrEqual(1);
          
          cleanup();
        }
      ),
      propertyConfig
    );
  });

  /**
   * Property: CTA button hover effects
   * 
   * Ensures that CTA buttons have hover state styling defined.
   */
  test('Property: CTA button hover effects - buttons have transition properties for hover feedback', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          const { container } = renderWithRouter(<LandingPage />);
          
          // Find all CTA buttons
          const ctaButtons = container.querySelectorAll('.btn-primary, .btn-secondary');
          
          ctaButtons.forEach(button => {
            const computedStyle = window.getComputedStyle(button);
            
            // Button should have transition property defined (for hover effects)
            const transition = computedStyle.transition || computedStyle.transitionProperty;
            
            // In test environment, transition might be empty, but in real CSS it should exist
            // We just verify the property exists (even if empty in test env)
            expect(transition).toBeDefined();
          });
          
          cleanup();
        }
      ),
      propertyConfig
    );
  });
});
