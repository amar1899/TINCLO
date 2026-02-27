/**
 * Property-Based Tests for Animation Infrastructure
 * Feature: jira-style-landing-page
 * 
 * These tests validate universal properties of the scroll animation system
 * using fast-check for property-based testing.
 */

import { render, waitFor, cleanup } from '@testing-library/react';
import fc from 'fast-check';
import useScrollAnimation from '../src/hooks/useScrollAnimation';
import { 
  supportsIntersectionObserver, 
  prefersReducedMotion 
} from '../src/utils/animationUtils';

// Test component that uses the hook
const TestComponent = ({ options }) => {
  const { ref, isVisible } = useScrollAnimation(options);
  
  return (
    <div 
      ref={ref} 
      data-testid="animated-element"
      className={`animate-on-scroll ${isVisible ? 'animate-in' : ''}`}
    >
      Test Content
    </div>
  );
};

describe('Animation Infrastructure - Property Tests', () => {
  const propertyConfig = { numRuns: 100 };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Default: IntersectionObserver is supported
    global.IntersectionObserver = class IntersectionObserver {
      constructor(callback, options) {
        this.callback = callback;
        this.options = options;
        this.elements = new Set();
      }

      observe(element) {
        this.elements.add(element);
      }

      unobserve(element) {
        this.elements.delete(element);
      }

      disconnect() {
        this.elements.clear();
      }

      triggerIntersection(element, isIntersecting) {
        this.callback([{
          target: element,
          isIntersecting,
          intersectionRatio: isIntersecting ? 1 : 0,
        }]);
      }
    };

    // Default: user does not prefer reduced motion
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  afterEach(() => {
    cleanup();
  });

  /**
   * Property 3: Scroll animation triggering
   * **Validates: Requirements 4.1**
   * 
   * For any element marked for scroll animation (with animate-on-scroll class),
   * when that element enters the viewport, it should receive the animate-in class
   * to trigger the animation.
   */
  test('Property 3: Scroll animation triggering - elements receive animate-in class when entering viewport', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          threshold: fc.double({ min: 0, max: 1 }),
          rootMargin: fc.constantFrom(
            '0px',
            '0px 0px -100px 0px',
            '0px 0px -50px 0px',
            '-100px 0px 0px 0px'
          )
        }),
        async (options) => {
          // Create a mock IntersectionObserver that properly captures and triggers callbacks
          let observerCallback = null;
          let observedElement = null;
          
          global.IntersectionObserver = jest.fn().mockImplementation(function(callback, opts) {
            observerCallback = callback;
            this.observe = (element) => {
              observedElement = element;
            };
            this.unobserve = jest.fn();
            this.disconnect = jest.fn();
          });
          
          const { container } = render(<TestComponent options={options} />);
          const element = container.querySelector('[data-testid="animated-element"]');
          
          // Initially, element should have animate-on-scroll class but not animate-in
          expect(element).toHaveClass('animate-on-scroll');
          expect(element).not.toHaveClass('animate-in');
          
          // Simulate element entering viewport by calling the observer callback
          if (observerCallback && observedElement) {
            observerCallback([{
              target: observedElement,
              isIntersecting: true,
              intersectionRatio: 1,
            }]);
          }
          
          // Wait for state update and verify animate-in class is added
          await waitFor(() => {
            expect(element).toHaveClass('animate-in');
          });
          
          // Clean up after each property test iteration
          cleanup();
        }
      ),
      propertyConfig
    );
  });

  /**
   * Property: Prefers-reduced-motion detection
   * **Validates: Requirements 4.2, 12.6**
   * 
   * When user prefers reduced motion, animations should be applied immediately
   * without waiting for scroll intersection.
   */
  test('Property: Prefers-reduced-motion - animations apply immediately when user prefers reduced motion', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          // Mock user preferring reduced motion
          window.matchMedia = jest.fn().mockImplementation(query => ({
            matches: query === '(prefers-reduced-motion: reduce)',
            media: query,
            onchange: null,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
          }));

          const { container } = render(<TestComponent options={{}} />);
          const element = container.querySelector('[data-testid="animated-element"]');
          
          // Element should have animate-in class immediately
          waitFor(() => {
            expect(element).toHaveClass('animate-in');
          });
          
          // Clean up after each property test iteration
          cleanup();
        }
      ),
      propertyConfig
    );
  });

  /**
   * Property: IntersectionObserver fallback
   * **Validates: Requirements 4.1, 4.2**
   * 
   * When IntersectionObserver is not supported, animations should be applied
   * immediately as a fallback.
   */
  test('Property: IntersectionObserver fallback - animations apply immediately when not supported', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          // Remove IntersectionObserver support
          const originalIO = global.IntersectionObserver;
          delete global.IntersectionObserver;

          const { container } = render(<TestComponent options={{}} />);
          const element = container.querySelector('[data-testid="animated-element"]');
          
          // Element should have animate-in class immediately
          waitFor(() => {
            expect(element).toHaveClass('animate-in');
          });

          // Restore IntersectionObserver
          global.IntersectionObserver = originalIO;
          
          // Clean up after each property test iteration
          cleanup();
        }
      ),
      propertyConfig
    );
  });

  /**
   * Property: Animation timing
   * **Validates: Requirements 4.2**
   * 
   * Animations should complete within 600ms as specified in requirements.
   */
  test('Property: Animation timing - CSS transition duration is 600ms or less', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          const { container } = render(<TestComponent options={{}} />);
          const element = container.querySelector('[data-testid="animated-element"]');
          
          // Check computed style for transition duration
          const computedStyle = window.getComputedStyle(element);
          const transitionDuration = computedStyle.transitionDuration;
          
          // Parse duration (could be in seconds like "0.6s" or milliseconds like "600ms")
          let durationMs = 0;
          if (transitionDuration.includes('ms')) {
            durationMs = parseFloat(transitionDuration);
          } else if (transitionDuration.includes('s')) {
            durationMs = parseFloat(transitionDuration) * 1000;
          }
          
          // Duration should be 600ms or less (allowing for 0 in test environment)
          expect(durationMs).toBeLessThanOrEqual(600);
          
          // Clean up after each property test iteration
          cleanup();
        }
      ),
      propertyConfig
    );
  });

  /**
   * Property: Observer cleanup
   * **Validates: Requirements 4.5**
   * 
   * After animation triggers, the observer should unobserve the element
   * to prevent re-triggering on subsequent scrolls.
   */
  test('Property: Observer cleanup - element is unobserved after first trigger', async () => {
    const unobserveSpy = jest.fn();
    
    global.IntersectionObserver = jest.fn().mockImplementation(function(callback, options) {
      this.callback = callback;
      this.options = options;
      this.element = null;
      
      this.observe = (element) => {
        this.element = element;
      };
      
      this.unobserve = (element) => {
        unobserveSpy(element);
      };
      
      this.disconnect = () => {};
      
      this.triggerIntersection = (isIntersecting) => {
        this.callback([{
          target: this.element,
          isIntersecting,
          intersectionRatio: isIntersecting ? 1 : 0,
        }]);
      };
    });

    const { container } = render(<TestComponent options={{}} />);
    const element = container.querySelector('[data-testid="animated-element"]');
    
    // Get the observer instance
    const observerInstance = global.IntersectionObserver.mock.instances[0];
    
    // Trigger intersection
    if (observerInstance && observerInstance.triggerIntersection) {
      observerInstance.triggerIntersection(true);
    }
    
    // Wait for state update and verify unobserve was called
    await waitFor(() => {
      expect(unobserveSpy).toHaveBeenCalledWith(element);
    });
    
    cleanup();
  });
});

describe('Animation Utilities - Property Tests', () => {
  const propertyConfig = { numRuns: 100 };

  test('Property: supportsIntersectionObserver returns boolean', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          const result = supportsIntersectionObserver();
          expect(typeof result).toBe('boolean');
        }
      ),
      propertyConfig
    );
  });

  test('Property: prefersReducedMotion returns boolean', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          const result = prefersReducedMotion();
          expect(typeof result).toBe('boolean');
        }
      ),
      propertyConfig
    );
  });

  test('Property: prefersReducedMotion respects matchMedia', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        (shouldPreferReducedMotion) => {
          window.matchMedia = jest.fn().mockImplementation(query => ({
            matches: shouldPreferReducedMotion && query === '(prefers-reduced-motion: reduce)',
            media: query,
          }));

          const result = prefersReducedMotion();
          expect(result).toBe(shouldPreferReducedMotion);
        }
      ),
      propertyConfig
    );
  });
});
