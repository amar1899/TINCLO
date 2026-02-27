/**
 * Animation utility functions for the landing page
 */

/**
 * Check if the browser supports Intersection Observer API
 * @returns {boolean} - True if supported, false otherwise
 */
export const supportsIntersectionObserver = () => {
  return typeof window !== 'undefined' && 'IntersectionObserver' in window;
};

/**
 * Check if user prefers reduced motion
 * @returns {boolean} - True if user prefers reduced motion
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches;
};

/**
 * Apply animation class to element when it enters viewport
 * @param {HTMLElement} element - The element to animate
 * @param {string} animationClass - The CSS class to add (default: 'animate-in')
 */
export const applyScrollAnimation = (element, animationClass = 'animate-in') => {
  if (!element) return;
  
  // If user prefers reduced motion, apply class immediately
  if (prefersReducedMotion()) {
    element.classList.add(animationClass);
    return;
  }
  
  // If Intersection Observer is not supported, apply class immediately
  if (!supportsIntersectionObserver()) {
    element.classList.add(animationClass);
    return;
  }
  
  // Otherwise, the hook will handle it
  element.classList.add(animationClass);
};

/**
 * Fallback function to apply animations to all elements immediately
 * Used when Intersection Observer is not supported or user prefers reduced motion
 */
export const applyImmediateAnimations = () => {
  if (typeof document === 'undefined') return;
  
  const elements = document.querySelectorAll('.animate-on-scroll');
  elements.forEach(el => {
    el.classList.add('animate-in');
  });
};
