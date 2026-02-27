import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for scroll-based animations using Intersection Observer API
 * 
 * @param {Object} options - Configuration options for the Intersection Observer
 * @param {number} options.threshold - Percentage of element visibility to trigger (0-1)
 * @param {string} options.rootMargin - Margin around the root element
 * @returns {Object} - { ref, isVisible } - Ref to attach to element and visibility state
 */
const useScrollAnimation = (options = {}) => {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef(null);

  // Check for prefers-reduced-motion
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const element = elementRef.current;
    
    // If user prefers reduced motion, show content immediately
    if (prefersReducedMotion.current) {
      setIsVisible(true);
      return;
    }

    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: show content immediately if not supported
      setIsVisible(true);
      return;
    }

    // Create Intersection Observer
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          // Unobserve after first trigger (animation should only happen once)
          if (observerRef.current && element) {
            observerRef.current.unobserve(element);
          }
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px 0px -100px 0px'
      }
    );

    // Start observing
    if (element) {
      observerRef.current.observe(element);
    }

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isVisible, options.threshold, options.rootMargin]);

  return { ref: elementRef, isVisible };
};

export default useScrollAnimation;
