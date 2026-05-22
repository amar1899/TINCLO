# Tailwind CSS Migration Requirements

## Overview
Migrate all remaining components from custom CSS files to Tailwind CSS utility classes, consistent with the already-migrated components (SignupPage, LoginPage, Navigation, NavigationLanding).

## Current State
The following components have already been migrated to Tailwind (no CSS files):
- SignupPage.jsx
- LoginPage.jsx
- Navigation.jsx
- NavigationLanding.jsx

## Requirements

### REQ-1: LandingPage Migration
Migrate `LandingPage.jsx` and remove `LandingPage.css`. The landing page includes a nav, hero section, and footer. Preserve the scroll animation infrastructure (`animate-on-scroll` / `animate-in` classes used by child sections) and the `prefers-reduced-motion` media query behavior.

### REQ-2: JobCard Migration
Migrate `JobCard.jsx` and remove `JobCard.css`. The JobCard includes swipe functionality, swipe indicators, apply modal, requirement tags, and source badges. All swipe drag behavior uses inline styles (already handled in JS) — only the static CSS classes need migrating.

### REQ-3: JobBrowser Migration
Migrate `JobBrowser.jsx` and remove `JobBrowser.css`. Includes search bar, source pills, job counter, loading state, and completion card.

### REQ-4: MatchesView Migration
Migrate `MatchesView.jsx` and remove `MatchesView.css`. Includes match list, match items, detail panel, apply modal (shared styles with JobCard), and status badges.

### REQ-5: FeaturesSection Migration
Migrate `FeaturesSection.jsx` and remove `FeaturesSection.css`. Includes tabbed navigation with keyboard accessibility, active tab indicator, and responsive layout.

### REQ-6: BenefitsSection Migration
Migrate `BenefitsSection.jsx` and remove `BenefitsSection.css`. Includes a 3-column grid of benefit cards with glassmorphism styling and hover effects.

### REQ-7: UseCasesSection Migration
Migrate `UseCasesSection.jsx` and remove `UseCasesSection.css`.

### REQ-8: FinalCTASection Migration
Migrate `FinalCTASection.jsx` and remove `FinalCTASection.css`.

### REQ-9: TabbedNavigation + TabPanel Migration
Migrate `TabbedNavigation.jsx` + `TabbedNavigation.css` and `TabPanel.jsx` + `TabPanel.css`.

### REQ-10: ProfilePage Migration
Migrate `ProfilePage.jsx` and remove `ProfilePage.css`. Includes sidebar avatar card, tabbed form layout, password strength indicator, and form inputs.

### REQ-11: AdminPanel Migration
Migrate `AdminPanel.jsx` and remove `AdminPanel.css`.

### REQ-12: AnalyticsPage Migration
Migrate `AnalyticsPage.jsx` and remove `AnalyticsPage.css`.

### REQ-13: Chat Migration
Migrate `Chat.jsx` and remove `Chat.css`.

### REQ-14: App.css Migration
Migrate `App.jsx` to use Tailwind classes and remove or minimize `App.css`. The loading container, error container, error banner, migration banner, and auth modal all need migrating.

## Constraints
- Preserve all existing functionality and visual appearance
- Maintain accessibility (focus states, ARIA attributes, keyboard navigation)
- Keep `prefers-reduced-motion` support
- Use the existing Tailwind config (brand colors, animations, gradients already defined)
- Where Tailwind cannot express a style (e.g., complex gradients, `::before` pseudo-elements for decorative borders), use inline `style` props or keep minimal CSS in `index.css` under `@layer components`
- Do NOT change any logic, state management, or event handlers
- After each component migration, the CSS file should be deleted
