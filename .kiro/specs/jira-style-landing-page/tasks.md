# Implementation Plan: Jira-Style Landing Page

## Overview

Transform the TINCLO landing page from a simple single-screen layout into a professional, multi-section experience with scroll-based animations, tabbed navigation, and modern visual design. The implementation will enhance the existing LandingPage.jsx component while preserving contact information and maintaining design consistency with the SignupPage.

## Tasks

- [x] 1. Set up animation infrastructure and utilities
  - Create custom useScrollAnimation hook using Intersection Observer API
  - Add prefers-reduced-motion detection and fallback handling
  - Set up animation CSS classes (animate-on-scroll, animate-in)
  - _Requirements: 4.1, 4.2, 4.3, 12.6_

- [x] 1.1 Write property test for animation system
  - **Property 3: Scroll animation triggering**
  - **Validates: Requirements 4.1**

- [ ] 2. Enhance hero section with visuals and CTAs
  - [x] 2.1 Restructure hero section with two-column layout
    - Add hero-container with hero-text and hero-visual divs
    - Update headline and subheadline with new value proposition text
    - Implement responsive stacking for mobile (<768px)
    - _Requirements: 1.1, 1.2, 1.3, 7.1, 7.2_
  
  - [x] 2.2 Add hero visual with placeholder image
    - Create hero-visual section with glassmorphism styling
    - Add placeholder screenshot with proper alt text
    - Implement image error handling with fallback
    - Apply hover scale effect (1.05 transform)
    - _Requirements: 1.6, 6.1, 6.2, 6.3, 6.5, 12.1_
  
  - [x] 2.3 Update CTA buttons with action-oriented text
    - Change button text to "Get it free" and "See how it works"
    - Add aria-labels for accessibility
    - Ensure navigation to /signup on click
    - Apply hover effects with 150ms transition
    - _Requirements: 1.4, 1.5, 9.1, 9.4, 9.5, 9.6, 12.5_

- [x] 2.4 Write property tests for hero section
  - **Property 11: CTA button action-oriented text**
  - **Property 12: CTA button navigation**
  - **Property 16: CTA button accessibility labels**
  - **Validates: Requirements 9.5, 9.6, 12.5**

- [ ] 3. Implement features section with tabbed navigation
  - [x] 3.1 Create features data structure
    - Define featuresData object with three categories (job-matching, application-tracking, profile-management)
    - Add feature items with title, description, icon, and screenshot fields
    - _Requirements: 3.4_
  
  - [x] 3.2 Build TabbedNavigation component
    - Create tab list with role="tablist" and ARIA attributes
    - Implement activeTab state management
    - Add keyboard navigation (Tab, Enter, Arrow keys)
    - Apply visual indicator for active tab
    - _Requirements: 3.1, 3.3, 12.3_
  
  - [x] 3.3 Build TabPanel component with content switching
    - Implement tab panel with role="tabpanel" and aria-controls
    - Add fade transition animation (200ms) on tab switch
    - Display feature cards for active category
    - _Requirements: 3.2, 3.5_
  
  - [x] 3.4 Style features section with scroll animation
    - Add animate-on-scroll class to features section
    - Apply glassmorphism to feature cards
    - Ensure 8px border-radius on cards
    - Add lazy loading to feature screenshots
    - _Requirements: 4.1, 5.5, 5.6, 10.2, 10.3_

- [x] 3.5 Write property tests for features section
  - **Property 2: Active tab visual indication**
  - **Property 7: Card and button border radius**
  - **Property 13: Lazy loading below-fold images**
  - **Validates: Requirements 3.3, 5.6, 10.2**

- [ ] 4. Create benefits section with cards
  - [~] 4.1 Define benefits data structure
    - Create benefitsData array with three benefits (save-time, better-matches, stay-organized)
    - Include icon, title, description, and metric for each benefit
    - _Requirements: 2.3_
  
  - [~] 4.2 Implement benefits section layout
    - Create 3-column grid (1 column on mobile)
    - Build benefit cards with icon, headline, and description
    - Apply glassmorphism background to cards
    - Add hover effect with translateY(-8px) and shadow increase
    - _Requirements: 2.3, 5.5, 7.1_
  
  - [~] 4.3 Add scroll animation to benefits section
    - Apply animate-on-scroll class to section and cards
    - Ensure 80px vertical padding on section
    - Maintain 60px spacing from previous section
    - _Requirements: 2.5, 2.6, 4.1, 5.4_

- [~] 4.4 Write property tests for benefits section
  - **Property 1: Section spacing consistency**
  - **Property 5: Section vertical padding**
  - **Property 6: Glassmorphism on transparent elements**
  - **Validates: Requirements 2.6, 5.4, 5.5**

- [ ] 5. Implement use cases section
  - [~] 5.1 Create use cases data structure
    - Define useCasesData array with three scenarios (recent-graduates, career-changers, active-job-seekers)
    - Include title, headline, description, image, and features for each
    - _Requirements: 2.4_
  
  - [~] 5.2 Build use cases section with alternating layout
    - Implement left-right alternating layout for use case cards
    - Add screenshot + text pairs for each use case
    - Apply responsive stacking on mobile
    - Add scroll animation to each use case card
    - _Requirements: 2.4, 4.1, 7.1_
  
  - [~] 5.3 Style use case images with professional effects
    - Add shadows and borders to screenshots
    - Implement hover scale effect (1.05)
    - Ensure proper aspect ratio preservation
    - Add lazy loading and alt text to all images
    - _Requirements: 6.2, 6.5, 7.4, 10.2, 12.1_

- [~] 5.4 Write property tests for use cases section
  - **Property 8: Screenshot hover scale effect**
  - **Property 9: Image aspect ratio preservation**
  - **Property 14: Image alt text presence**
  - **Validates: Requirements 6.5, 7.4, 12.1**

- [~] 6. Add final CTA section
  - Create final call-to-action section before footer
  - Add prominent CTA button with "Start now" or "Sign up" text
  - Apply scroll animation to section
  - Ensure button navigates to /signup
  - _Requirements: 9.2, 9.3, 9.5, 9.6_

- [~] 7. Checkpoint - Verify structure and animations
  - Ensure all sections render in correct order
  - Test scroll animations trigger correctly
  - Verify tab navigation works with keyboard and mouse
  - Check that all CTAs navigate to /signup
  - Ensure all tests pass, ask the user if questions arise

- [ ] 8. Implement responsive design and mobile optimization
  - [~] 8.1 Add mobile breakpoint styles (<768px)
    - Stack hero section vertically on mobile
    - Adjust font sizes for readability (hero: 32px, sections: 24px)
    - Ensure tab navigation remains functional on mobile
    - Stack benefit cards and use case cards vertically
    - _Requirements: 7.1, 7.2, 7.3_
  
  - [~] 8.2 Optimize layout reflow and transitions
    - Add CSS transitions for viewport changes (300ms)
    - Ensure images maintain aspect ratios across viewports
    - Test contact information visibility at all viewport sizes
    - _Requirements: 7.4, 7.5, 8.4_

- [~] 8.3 Write property test for responsive behavior
  - **Property 10: Contact information visibility**
  - **Validates: Requirements 8.4**

- [ ] 9. Apply professional visual design system
  - [~] 9.1 Implement color scheme and typography
    - Define CSS custom properties for primary, secondary, accent colors
    - Set up typography scale (14px to 48px) with two font weights
    - Ensure color contrast ratio of 4.5:1 for all text
    - Match color palette with SignupPage for consistency
    - _Requirements: 5.1, 5.2, 5.3, 11.2, 12.2_
  
  - [~] 9.2 Apply glassmorphism and visual effects
    - Add backdrop-filter: blur(20px) to transparent elements
    - Ensure all cards and buttons have 8px border-radius
    - Add consistent shadows to elevated elements
    - Apply whitespace with 80px section padding
    - _Requirements: 5.4, 5.5, 5.6, 11.1_
  
  - [~] 9.3 Ensure design pattern consistency
    - Match button styling with other TINCLO components
    - Use same animation timing functions as SignupPage
    - Apply same font family across all sections
    - _Requirements: 11.3, 11.4, 11.5_

- [~] 9.4 Write property test for visual design
  - **Property 15: Text color contrast ratio**
  - **Validates: Requirements 12.2**

- [ ] 10. Optimize performance and loading
  - [~] 10.1 Implement image optimization
    - Add lazy loading (loading="lazy") to all below-fold images
    - Optimize image file sizes to <500KB per image
    - Add image error handling with placeholder fallbacks
    - _Requirements: 10.2, 10.3_
  
  - [~] 10.2 Optimize animations for 60fps
    - Use CSS animations instead of JavaScript where possible
    - Ensure scroll animations complete within 600ms
    - Add will-change hints for animated elements
    - Test animation performance with Chrome DevTools
    - _Requirements: 4.2, 10.4, 10.5_
  
  - [~] 10.3 Implement performance best practices
    - Ensure initial viewport renders within 2 seconds
    - Minimize JavaScript bundle size
    - Use CSS transforms for animations (not position/margin)
    - _Requirements: 10.1, 10.4_

- [ ] 11. Implement accessibility features
  - [~] 11.1 Add ARIA attributes and semantic HTML
    - Use semantic HTML elements (section, nav, footer, article)
    - Add aria-labels to all CTA buttons
    - Implement proper heading hierarchy (h1, h2, h3)
    - Add role attributes to tabbed navigation
    - _Requirements: 12.3, 12.4, 12.5_
  
  - [~] 11.2 Ensure keyboard navigation
    - Test tab navigation through all interactive elements
    - Implement Enter key activation for tabs
    - Add focus indicators to all focusable elements
    - _Requirements: 12.3_
  
  - [~] 11.3 Add accessibility safeguards
    - Implement prefers-reduced-motion media query
    - Ensure all images have descriptive alt text
    - Verify color contrast ratios meet WCAG AA standards
    - Test with screen reader (VoiceOver or NVDA)
    - _Requirements: 12.1, 12.2, 12.6_

- [~] 11.4 Write property test for accessibility
  - **Property 4: Single animation trigger**
  - **Validates: Requirements 4.5**

- [ ] 12. Final integration and polish
  - [x] 12.1 Wire all sections together
    - Ensure smooth scrolling between sections
    - Verify all animations trigger at correct scroll positions
    - Test all CTA buttons navigate correctly
    - Confirm contact information preserved in footer
    - _Requirements: 2.5, 8.1, 8.2, 8.3, 9.6_
  
  - [~] 12.2 Cross-browser testing
    - Test in Chrome, Firefox, Safari, Edge
    - Verify Intersection Observer fallback works
    - Check glassmorphism effects render correctly
    - Test on iOS and Android devices
    - _Requirements: 10.1, 10.5_

- [~] 12.3 Write integration tests
  - Test complete user journey from hero to signup
  - Verify scroll animations trigger in sequence
  - Test tab switching and content display
  - Validate responsive behavior at breakpoints
  - _Requirements: 2.5, 3.2, 7.1, 7.5_

- [x] 13. Final checkpoint - Complete testing and validation
  - Run all unit tests and property tests
  - Verify all 12 requirements are met
  - Check accessibility with automated tools (axe, Lighthouse)
  - Ensure performance metrics meet targets (>90 performance score)
  - Ensure all tests pass, ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- The implementation builds incrementally: infrastructure → sections → polish
- Property tests validate universal correctness properties from the design
- Existing contact information (voddulaamar@gmail.com, +91 7981954727) must be preserved
- Design consistency with SignupPage is critical for brand cohesion
- Performance optimization is essential for good user experience
