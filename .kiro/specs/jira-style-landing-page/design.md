# Design Document: Jira-Style Landing Page

## Overview

This design transforms the TINCLO landing page from a simple single-screen layout into a professional, multi-section experience inspired by modern SaaS landing pages like Jira. The redesign maintains the existing brand identity (gradient backgrounds, glassmorphism effects) while introducing sophisticated features including scroll-based animations, tabbed navigation, multiple content sections, and professional visual hierarchy.

### Design Goals

1. Create an engaging, professional first impression that builds trust
2. Showcase TINCLO features through organized, scannable sections
3. Provide multiple conversion opportunities with strategically placed CTAs
4. Maintain design consistency with existing SignupPage patterns
5. Ensure accessibility and responsive behavior across all devices
6. Optimize performance with lazy loading and CSS-based animations

### Key Design Decisions

**Animation Library Selection**: We will use the Intersection Observer API for scroll-based animations rather than heavy libraries like AOS or ScrollReveal. This provides:
- Native browser support with excellent performance
- Fine-grained control over animation triggers
- Minimal bundle size impact (zero external dependencies)
- Better accessibility support (respects prefers-reduced-motion)

**Tabbed Navigation Implementation**: Custom React component using state management rather than third-party tab libraries. This ensures:
- Full control over styling to match TINCLO design system
- Keyboard navigation support (Tab, Enter, Arrow keys)
- Smooth transitions using CSS transforms
- Minimal JavaScript overhead

**Image Strategy**: Use placeholder images initially with clear aspect ratios, allowing for future replacement with actual screenshots. Images will be:
- Lazy-loaded below the fold using native loading="lazy"
- Optimized to <500KB per image
- Served in modern formats (WebP with JPEG fallback)
- Styled with shadows and borders for professional presentation

## Architecture

### Component Structure

```
LandingPage (Container)
├── Navigation (Existing, preserved)
├── HeroSection (Enhanced)
│   ├── HeroContent
│   ├── HeroVisual (New - screenshot/graphic)
│   └── PrimaryCTA
├── FeaturesSection (New)
│   ├── TabbedNavigation
│   │   ├── Tab (multiple instances)
│   │   └── TabPanel (multiple instances)
│   └── FeatureCards
├── BenefitsSection (New)
│   └── BenefitCards
├── UseCasesSection (New)
│   └── UseCaseCards
├── TestimonialsSection (New - Optional)
│   └── TestimonialCards
├── FinalCTASection (New)
│   └── SecondaryCTA
└── Footer (Existing, enhanced)
    └── ContactInformation (Preserved)
```

### State Management

The landing page will use minimal React state:

```javascript
// Scroll animation state
const [visibleSections, setVisibleSections] = useState(new Set());

// Tabbed navigation state
const [activeTab, setActiveTab] = useState('job-matching');

// Performance optimization
const observerRef = useRef(null);
```

### Animation System

**Intersection Observer Setup**:
```javascript
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target); // Trigger only once
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
  );
  
  // Observe all animatable elements
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
  
  return () => observer.disconnect();
}, []);
```

## Components and Interfaces

### HeroSection Component

**Purpose**: Create immediate impact with clear value proposition and primary CTA.

**Props**: None (self-contained)

**Structure**:
```jsx
<section className="hero-section">
  <div className="hero-container">
    <div className="hero-text">
      <h1>Find Your Dream Job with Smart Matching</h1>
      <p>Swipe through opportunities tailored to your skills...</p>
      <div className="hero-ctas">
        <button className="cta-primary">Get it free</button>
        <button className="cta-secondary">See how it works</button>
      </div>
    </div>
    <div className="hero-visual">
      <img src="/assets/app-screenshot.png" alt="TINCLO app interface" />
    </div>
  </div>
</section>
```

**Styling Approach**:
- Two-column layout (60/40 split) on desktop
- Stack vertically on mobile (<768px)
- Hero text: 48px headline, 20px subheadline
- Glassmorphism card for visual with backdrop-filter: blur(20px)
- Gradient background consistent with SignupPage

### FeaturesSection Component

**Purpose**: Showcase key features through organized tabbed interface.

**Props**:
```typescript
interface FeaturesSectionProps {
  features: {
    category: string;
    items: Array<{
      title: string;
      description: string;
      icon: string;
      screenshot?: string;
    }>;
  }[];
}
```

**Tab Categories**:
1. Job Matching - Swipe interface, smart recommendations
2. Application Tracking - Status management, saved jobs
3. Profile Management - Skills, preferences, resume

**Interaction Flow**:
1. User clicks tab → activeTab state updates
2. Tab panel fades out (200ms) → content switches → fades in (200ms)
3. Active tab receives visual indicator (underline + color change)
4. Keyboard users can Tab to navigation, use Arrow keys to switch tabs

**Accessibility**:
- ARIA roles: role="tablist", role="tab", role="tabpanel"
- aria-selected for active tab
- aria-controls linking tabs to panels
- Keyboard navigation with ArrowLeft/ArrowRight

### BenefitsSection Component

**Purpose**: Communicate user advantages with visual hierarchy.

**Structure**: 3-column grid (1 column on mobile) with benefit cards

**Content**:
1. Save Time - "Find relevant jobs 10x faster"
2. Better Matches - "AI-powered recommendations"
3. Stay Organized - "Track all applications in one place"

**Card Design**:
- Icon (emoji or SVG) at top
- Bold headline (24px)
- Description text (16px)
- Glassmorphism background
- Hover effect: translateY(-8px) with shadow increase

### UseCasesSection Component

**Purpose**: Demonstrate practical applications through scenarios.

**Use Cases**:
1. Recent Graduates - "Launch your career with confidence"
2. Career Changers - "Discover new opportunities in your field"
3. Active Job Seekers - "Manage multiple applications effortlessly"

**Layout**: Alternating left-right layout with screenshot + text pairs

### ScrollAnimation Hook

**Custom Hook**: `useScrollAnimation`

```javascript
const useScrollAnimation = (ref, options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px 0px -100px 0px'
      }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, [ref, isVisible, options]);
  
  return isVisible;
};
```

## Data Models

### Feature Data Structure

```javascript
const featuresData = {
  'job-matching': {
    title: 'Smart Job Matching',
    items: [
      {
        id: 'swipe-interface',
        title: 'Intuitive Swipe Interface',
        description: 'Browse jobs with familiar swipe gestures...',
        icon: '👍',
        screenshot: '/assets/swipe-demo.png'
      },
      // ... more items
    ]
  },
  'application-tracking': {
    title: 'Application Management',
    items: [
      // ... items
    ]
  },
  'profile-management': {
    title: 'Profile & Preferences',
    items: [
      // ... items
    ]
  }
};
```

### Benefits Data Structure

```javascript
const benefitsData = [
  {
    id: 'save-time',
    icon: '⚡',
    title: 'Save Time',
    description: 'Find relevant jobs 10x faster with smart filtering',
    metric: '10x faster'
  },
  {
    id: 'better-matches',
    icon: '🎯',
    title: 'Better Matches',
    description: 'AI-powered recommendations based on your profile',
    metric: '95% match rate'
  },
  {
    id: 'stay-organized',
    icon: '📊',
    title: 'Stay Organized',
    description: 'Track all applications in one centralized dashboard',
    metric: 'All in one place'
  }
];
```

### Use Cases Data Structure

```javascript
const useCasesData = [
  {
    id: 'recent-graduates',
    title: 'Recent Graduates',
    headline: 'Launch Your Career with Confidence',
    description: 'Navigate the job market with tools designed for first-time job seekers...',
    image: '/assets/graduate-usecase.png',
    features: ['Resume builder', 'Interview prep', 'Entry-level focus']
  },
  // ... more use cases
];
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Section Spacing Consistency

*For any* pair of adjacent content sections on the landing page, the vertical spacing between them should be at least 60 pixels.

**Validates: Requirements 2.6**

### Property 2: Active Tab Visual Indication

*For any* tab in the tabbed navigation that is currently active, that tab should have a visual indicator (active class or aria-selected="true" attribute).

**Validates: Requirements 3.3**

### Property 3: Scroll Animation Triggering

*For any* element marked for scroll animation (with animate-on-scroll class), when that element enters the viewport, it should receive the animate-in class to trigger the animation.

**Validates: Requirements 4.1**

### Property 4: Single Animation Trigger

*For any* element with scroll animation, scrolling past that element multiple times should only trigger the animation on the first pass (animation class should not be removed and re-added).

**Validates: Requirements 4.5**

### Property 5: Section Vertical Padding

*For any* major content section (features, benefits, use cases), the vertical padding should be at least 80 pixels.

**Validates: Requirements 5.4**

### Property 6: Glassmorphism on Transparent Elements

*For any* design element that uses transparency (rgba or opacity), that element should also apply glassmorphism styling with backdrop-filter blur effect.

**Validates: Requirements 5.5**

### Property 7: Card and Button Border Radius

*For any* card or button element on the landing page, the border-radius should be at least 8 pixels.

**Validates: Requirements 5.6**

### Property 8: Screenshot Hover Scale Effect

*For any* screenshot or application mockup image, hovering over it should apply a scale transformation of 1.05.

**Validates: Requirements 6.5**

### Property 9: Image Aspect Ratio Preservation

*For any* image on the landing page at any viewport size, the aspect ratio should be preserved (no distortion or stretching).

**Validates: Requirements 7.4**

### Property 10: Contact Information Visibility

*For any* viewport size (from 320px to 1920px width), the contact information in the footer should remain visible (not hidden with display:none or visibility:hidden).

**Validates: Requirements 8.4**

### Property 11: CTA Button Action-Oriented Text

*For any* CTA button on the landing page, the button text should match action-oriented patterns (contains words like "Get", "Start", "Sign up", "Try", "Join", or similar action verbs).

**Validates: Requirements 9.5**

### Property 12: CTA Button Navigation

*For any* CTA button on the landing page, clicking it should navigate to the signup page (/signup route).

**Validates: Requirements 9.6**

### Property 13: Lazy Loading Below-Fold Images

*For any* image that is not in the initial viewport (below the fold), that image should have the loading="lazy" attribute to enable lazy loading.

**Validates: Requirements 10.2**

### Property 14: Image Alt Text Presence

*For any* img element on the landing page, it should have a non-empty alt attribute for accessibility.

**Validates: Requirements 12.1**

### Property 15: Text Color Contrast Ratio

*For any* text element on the landing page, the color contrast ratio between the text and its background should be at least 4.5:1 to meet WCAG AA standards.

**Validates: Requirements 12.2**

### Property 16: CTA Button Accessibility Labels

*For any* CTA button on the landing page, it should have either an aria-label or aria-labelledby attribute to provide descriptive labels for screen readers.

**Validates: Requirements 12.5**

## Error Handling

### Animation Errors

**Intersection Observer Not Supported**:
- Detection: Check for `'IntersectionObserver' in window`
- Fallback: Apply all animation classes immediately (no scroll-based animation)
- User Impact: Page still functional, just without scroll animations

```javascript
if (!('IntersectionObserver' in window)) {
  // Fallback: add animate-in class to all elements immediately
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    el.classList.add('animate-in');
  });
}
```

### Image Loading Errors

**Screenshot Fails to Load**:
- Detection: img.onerror event
- Fallback: Display placeholder with icon and "Image unavailable" text
- User Impact: Layout preserved, user aware of missing content

```javascript
<img 
  src={screenshot} 
  alt={altText}
  onError={(e) => {
    e.target.src = '/assets/placeholder.svg';
    e.target.alt = 'Screenshot unavailable';
  }}
/>
```

### Responsive Layout Errors

**Viewport Detection Issues**:
- Detection: window.matchMedia failures
- Fallback: Use mobile-first CSS (mobile styles as default)
- User Impact: Mobile layout on all devices (functional but not optimal)

### Accessibility Errors

**Reduced Motion Preference**:
- Detection: `prefers-reduced-motion: reduce` media query
- Handling: Disable all animations, use instant transitions
- User Impact: Respects user preference, maintains functionality

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Navigation Errors

**Tab State Corruption**:
- Detection: activeTab not in valid tab list
- Fallback: Reset to first tab
- User Impact: Tab resets but remains functional

```javascript
useEffect(() => {
  const validTabs = ['job-matching', 'application-tracking', 'profile-management'];
  if (!validTabs.includes(activeTab)) {
    setActiveTab(validTabs[0]);
  }
}, [activeTab]);
```

## Testing Strategy

### Dual Testing Approach

This feature will employ both unit testing and property-based testing to ensure comprehensive coverage:

**Unit Tests** will focus on:
- Specific examples of component rendering (hero section exists, footer contains contact info)
- Edge cases (empty data, missing images)
- User interactions (tab clicks, button clicks)
- Responsive breakpoints (layout at 768px, 480px)
- Accessibility features (keyboard navigation, ARIA attributes)

**Property-Based Tests** will focus on:
- Universal properties that hold across all inputs (all images have alt text, all CTAs navigate correctly)
- Styling consistency (spacing, padding, border-radius across all elements)
- Animation behavior (all animatable elements trigger correctly)
- Accessibility compliance (contrast ratios, visibility across viewports)

Together, these approaches provide comprehensive coverage where unit tests catch concrete bugs in specific scenarios, and property tests verify general correctness across all possible inputs.

### Testing Framework Selection

**Unit Testing**:
- Framework: Jest + React Testing Library
- Rationale: Industry standard for React, excellent DOM testing utilities, built-in mocking

**Property-Based Testing**:
- Framework: fast-check (JavaScript property-based testing library)
- Rationale: Mature library, excellent TypeScript support, integrates with Jest
- Configuration: Minimum 100 iterations per property test
- Each property test will include a comment tag: **Feature: jira-style-landing-page, Property {number}: {property_text}**

### Unit Test Coverage

**Component Rendering Tests**:
```javascript
describe('LandingPage - Structure', () => {
  test('renders hero section at top of page', () => {
    render(<LandingPage />);
    const hero = screen.getByRole('banner') || screen.getByTestId('hero-section');
    expect(hero).toBeInTheDocument();
  });

  test('displays at least four content sections', () => {
    render(<LandingPage />);
    const sections = screen.getAllByRole('region');
    expect(sections.length).toBeGreaterThanOrEqual(4);
  });

  test('preserves contact information in footer', () => {
    render(<LandingPage />);
    expect(screen.getByText('voddulaamar@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('+91 7981954727')).toBeInTheDocument();
  });
});
```

**Interaction Tests**:
```javascript
describe('LandingPage - Interactions', () => {
  test('tab click switches content within features section', () => {
    render(<LandingPage />);
    const secondTab = screen.getByRole('tab', { name: /application tracking/i });
    fireEvent.click(secondTab);
    expect(secondTab).toHaveAttribute('aria-selected', 'true');
  });

  test('CTA buttons navigate to signup page', () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate
    }));
    
    render(<LandingPage />);
    const ctaButton = screen.getByRole('button', { name: /get it free/i });
    fireEvent.click(ctaButton);
    expect(mockNavigate).toHaveBeenCalledWith('/signup');
  });
});
```

**Responsive Tests**:
```javascript
describe('LandingPage - Responsive', () => {
  test('stacks sections vertically on mobile viewport', () => {
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));
    
    render(<LandingPage />);
    const heroContainer = screen.getByTestId('hero-container');
    expect(heroContainer).toHaveStyle({ flexDirection: 'column' });
  });
});
```

**Accessibility Tests**:
```javascript
describe('LandingPage - Accessibility', () => {
  test('all images have alt text', () => {
    const { container } = render(<LandingPage />);
    const images = container.querySelectorAll('img');
    images.forEach(img => {
      expect(img).toHaveAttribute('alt');
      expect(img.getAttribute('alt')).not.toBe('');
    });
  });

  test('keyboard navigation works for tabs', () => {
    render(<LandingPage />);
    const firstTab = screen.getAllByRole('tab')[0];
    firstTab.focus();
    fireEvent.keyDown(firstTab, { key: 'Enter' });
    expect(firstTab).toHaveAttribute('aria-selected', 'true');
  });

  test('respects prefers-reduced-motion', () => {
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));
    
    render(<LandingPage />);
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => {
      expect(el).toHaveClass('animate-in'); // Applied immediately
    });
  });
});
```

### Property-Based Test Coverage

**Property Test Configuration**:
```javascript
import fc from 'fast-check';

// Configure for minimum 100 iterations
const propertyConfig = { numRuns: 100 };
```

**Styling Properties**:
```javascript
describe('LandingPage - Property Tests', () => {
  test('Property 1: Section spacing consistency', () => {
    /**
     * Feature: jira-style-landing-page, Property 1: 
     * For any pair of adjacent content sections, spacing >= 60px
     */
    fc.assert(
      fc.property(fc.constantFrom('features', 'benefits', 'usecases', 'testimonials'), (sectionType) => {
        const { container } = render(<LandingPage />);
        const sections = container.querySelectorAll('section');
        
        for (let i = 0; i < sections.length - 1; i++) {
          const currentBottom = sections[i].getBoundingClientRect().bottom;
          const nextTop = sections[i + 1].getBoundingClientRect().top;
          const spacing = nextTop - currentBottom;
          expect(spacing).toBeGreaterThanOrEqual(60);
        }
      }),
      propertyConfig
    );
  });

  test('Property 7: Card and button border radius', () => {
    /**
     * Feature: jira-style-landing-page, Property 7:
     * For any card or button element, border-radius >= 8px
     */
    fc.assert(
      fc.property(fc.constantFrom('card', 'button'), (elementType) => {
        const { container } = render(<LandingPage />);
        const selector = elementType === 'card' ? '.feature, .benefit-card, .usecase-card' : 'button, .btn-primary, .btn-secondary';
        const elements = container.querySelectorAll(selector);
        
        elements.forEach(el => {
          const borderRadius = window.getComputedStyle(el).borderRadius;
          const radiusValue = parseInt(borderRadius);
          expect(radiusValue).toBeGreaterThanOrEqual(8);
        });
      }),
      propertyConfig
    );
  });

  test('Property 9: Image aspect ratio preservation', () => {
    /**
     * Feature: jira-style-landing-page, Property 9:
     * For any image at any viewport size, aspect ratio is preserved
     */
    fc.assert(
      fc.property(fc.integer({ min: 320, max: 1920 }), (viewportWidth) => {
        global.innerWidth = viewportWidth;
        global.dispatchEvent(new Event('resize'));
        
        const { container } = render(<LandingPage />);
        const images = container.querySelectorAll('img');
        
        images.forEach(img => {
          const computedStyle = window.getComputedStyle(img);
          // Check that object-fit is set to preserve aspect ratio
          expect(['contain', 'cover', 'scale-down', '']).toContain(computedStyle.objectFit);
        });
      }),
      propertyConfig
    );
  });

  test('Property 10: Contact information visibility', () => {
    /**
     * Feature: jira-style-landing-page, Property 10:
     * For any viewport size, contact information remains visible
     */
    fc.assert(
      fc.property(fc.integer({ min: 320, max: 1920 }), (viewportWidth) => {
        global.innerWidth = viewportWidth;
        global.dispatchEvent(new Event('resize'));
        
        render(<LandingPage />);
        const email = screen.getByText('voddulaamar@gmail.com');
        const phone = screen.getByText('+91 7981954727');
        
        expect(email).toBeVisible();
        expect(phone).toBeVisible();
      }),
      propertyConfig
    );
  });

  test('Property 11: CTA button action-oriented text', () => {
    /**
     * Feature: jira-style-landing-page, Property 11:
     * For any CTA button, text matches action-oriented patterns
     */
    fc.assert(
      fc.property(fc.constant(null), () => {
        const { container } = render(<LandingPage />);
        const ctaButtons = container.querySelectorAll('.cta-primary, .cta-secondary, .btn-primary, .btn-secondary');
        
        const actionWords = ['get', 'start', 'sign', 'try', 'join', 'browse', 'create', 'see'];
        
        ctaButtons.forEach(button => {
          const buttonText = button.textContent.toLowerCase();
          const hasActionWord = actionWords.some(word => buttonText.includes(word));
          expect(hasActionWord).toBe(true);
        });
      }),
      propertyConfig
    );
  });

  test('Property 12: CTA button navigation', () => {
    /**
     * Feature: jira-style-landing-page, Property 12:
     * For any CTA button, clicking navigates to signup page
     */
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate
    }));

    fc.assert(
      fc.property(fc.constant(null), () => {
        const { container } = render(<LandingPage />);
        const ctaButtons = container.querySelectorAll('.cta-primary, .cta-secondary');
        
        ctaButtons.forEach(button => {
          mockNavigate.mockClear();
          fireEvent.click(button);
          expect(mockNavigate).toHaveBeenCalledWith('/signup');
        });
      }),
      propertyConfig
    );
  });

  test('Property 13: Lazy loading below-fold images', () => {
    /**
     * Feature: jira-style-landing-page, Property 13:
     * For any image below the fold, loading="lazy" attribute is present
     */
    fc.assert(
      fc.property(fc.constant(null), () => {
        const { container } = render(<LandingPage />);
        const images = container.querySelectorAll('img');
        
        images.forEach(img => {
          const rect = img.getBoundingClientRect();
          const isBelowFold = rect.top > window.innerHeight;
          
          if (isBelowFold) {
            expect(img).toHaveAttribute('loading', 'lazy');
          }
        });
      }),
      propertyConfig
    );
  });

  test('Property 14: Image alt text presence', () => {
    /**
     * Feature: jira-style-landing-page, Property 14:
     * For any img element, alt attribute is non-empty
     */
    fc.assert(
      fc.property(fc.constant(null), () => {
        const { container } = render(<LandingPage />);
        const images = container.querySelectorAll('img');
        
        images.forEach(img => {
          expect(img).toHaveAttribute('alt');
          expect(img.getAttribute('alt')).not.toBe('');
        });
      }),
      propertyConfig
    );
  });

  test('Property 16: CTA button accessibility labels', () => {
    /**
     * Feature: jira-style-landing-page, Property 16:
     * For any CTA button, aria-label or aria-labelledby is present
     */
    fc.assert(
      fc.property(fc.constant(null), () => {
        const { container } = render(<LandingPage />);
        const ctaButtons = container.querySelectorAll('.cta-primary, .cta-secondary, button');
        
        ctaButtons.forEach(button => {
          const hasAriaLabel = button.hasAttribute('aria-label') || button.hasAttribute('aria-labelledby');
          expect(hasAriaLabel).toBe(true);
        });
      }),
      propertyConfig
    );
  });
});
```

### Animation Testing

**Scroll Animation Tests**:
```javascript
describe('LandingPage - Animations', () => {
  test('Property 3: Scroll animation triggering', () => {
    /**
     * Feature: jira-style-landing-page, Property 3:
     * For any element marked for animation, entering viewport triggers animation
     */
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null
    });
    window.IntersectionObserver = mockIntersectionObserver;

    fc.assert(
      fc.property(fc.constant(null), () => {
        const { container } = render(<LandingPage />);
        const animatableElements = container.querySelectorAll('.animate-on-scroll');
        
        // Simulate intersection
        const [[callback]] = mockIntersectionObserver.mock.calls;
        animatableElements.forEach(el => {
          callback([{ target: el, isIntersecting: true }]);
          expect(el).toHaveClass('animate-in');
        });
      }),
      propertyConfig
    );
  });

  test('Property 4: Single animation trigger', () => {
    /**
     * Feature: jira-style-landing-page, Property 4:
     * For any animated element, animation triggers only once
     */
    const { container } = render(<LandingPage />);
    const animatedElement = container.querySelector('.animate-on-scroll');
    
    // Simulate first intersection
    const observer = new IntersectionObserver(() => {});
    observer.observe(animatedElement);
    
    // Element should have animate-in class
    expect(animatedElement).toHaveClass('animate-in');
    
    // Remove from viewport and bring back
    animatedElement.classList.remove('animate-in');
    
    // Should not re-trigger (observer should have unobserved)
    expect(animatedElement).not.toHaveClass('animate-in');
  });
});
```

### Performance Testing

While automated performance testing is challenging, we will include:

**Lighthouse CI Integration**:
- Run Lighthouse audits on every build
- Enforce minimum scores: Performance > 90, Accessibility > 95
- Monitor bundle size (target: <500KB total JS)

**Manual Performance Checklist**:
- [ ] Initial viewport renders in <2s on 3G connection
- [ ] Scroll animations maintain 60fps (check with Chrome DevTools)
- [ ] Images lazy-load correctly (verify in Network tab)
- [ ] No layout shifts during load (CLS < 0.1)

### Integration Testing

**End-to-End Tests** (using Playwright or Cypress):
```javascript
test('complete user journey through landing page', async ({ page }) => {
  await page.goto('/');
  
  // Verify hero section
  await expect(page.locator('.hero-section')).toBeVisible();
  
  // Scroll through sections
  await page.locator('.features-section').scrollIntoViewIfNeeded();
  await expect(page.locator('.features-section')).toHaveClass(/animate-in/);
  
  // Interact with tabs
  await page.click('text=Application Tracking');
  await expect(page.locator('[role="tabpanel"]')).toContainText('track');
  
  // Click CTA and verify navigation
  await page.click('text=Get it free');
  await expect(page).toHaveURL('/signup');
});
```

### Test Coverage Goals

- Unit test coverage: >85% of component code
- Property test coverage: All 16 correctness properties implemented
- Integration test coverage: Critical user paths (hero → features → CTA → signup)
- Accessibility test coverage: 100% of WCAG AA criteria

### Continuous Testing

**Pre-commit Hooks**:
- Run unit tests and property tests
- Run accessibility linter (eslint-plugin-jsx-a11y)
- Check for console errors

**CI/CD Pipeline**:
- Run full test suite on every PR
- Run Lighthouse CI for performance regression
- Visual regression testing (Percy or Chromatic)
- Deploy preview for manual QA

