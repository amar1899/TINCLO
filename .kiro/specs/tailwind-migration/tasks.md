# Tailwind CSS Migration Tasks

- [x] 1. Migrate LandingPage to Tailwind
  - Read `LandingPage.jsx` and `LandingPage.css` to understand all class usages
  - Replace `.landing-page` wrapper with Tailwind classes (min-h-screen text-white + inline gradient style)
  - Replace `.landing-nav` with Tailwind flex layout + backdrop blur
  - Replace `.nav-logo`, `.nav-link`, `.nav-link-primary` with Tailwind classes
  - Replace `.landing-hero`, `.hero-container`, `.hero-text`, `.hero-visual` with Tailwind flex layout
  - Replace `.hero-title`, `.hero-subtitle`, `.hero-actions` with Tailwind typography classes
  - Replace `.btn-primary`, `.btn-secondary` with Tailwind button classes
  - Replace `.hero-screenshot` with Tailwind classes
  - Replace all footer classes with Tailwind
  - Move `animate-on-scroll` / `animate-in` CSS to `index.css` under `@layer utilities`
  - Move `prefers-reduced-motion` rules to `index.css`
  - Remove CSS import and delete `LandingPage.css`

- [x] 2. Migrate JobCard to Tailwind
  - Read `JobCard.jsx` and `JobCard.css` to understand all class usages
  - Replace `.job-card` with Tailwind card classes; add decorative top gradient bar using an absolutely positioned div
  - Replace `.job-card-header`, `.company-badge`, `.company-logo`, `.company-info` with Tailwind
  - Replace `.job-title`, `.job-meta`, `.job-meta-item`, `.meta-icon`, `.meta-text` with Tailwind
  - Replace `.job-description`, `.job-tags`, `.job-tag` with Tailwind
  - Replace `.job-requirements`, `.requirements-label`, `.requirements-list`, `.requirement-tag` with Tailwind
  - Replace `.job-source-badge`, `.job-header-right` with Tailwind
  - Replace `.btn-apply-now` with Tailwind button classes
  - Replace `.read-more-btn` with Tailwind
  - Replace `.swipe-indicator`, `.like-indicator`, `.pass-indicator` with Tailwind absolute positioning
  - Replace `.swipe-hint`, `.swipe-hint-left`, `.swipe-hint-right` with Tailwind
  - Migrate all ApplyModal classes to Tailwind
  - Remove CSS import and delete `JobCard.css`

- [x] 3. Migrate JobBrowser to Tailwind
  - Read `JobBrowser.jsx` and `JobBrowser.css`
  - Replace `.job-browser` wrapper with Tailwind
  - Replace search bar classes with Tailwind
  - Replace source pills, job counter, live badge with Tailwind
  - Replace loading state and completion card classes with Tailwind
  - Replace `.fallback-notice` with Tailwind
  - Remove CSS import and delete `JobBrowser.css`

- [x] 4. Migrate MatchesView to Tailwind
  - Read `MatchesView.jsx` and `MatchesView.css`
  - Replace `.matches-view`, `.matches-header` with Tailwind
  - Replace `.matches-list`, `.match-item` (including left border strip) with Tailwind
  - Replace `.matches-empty`, `.empty-card` with Tailwind
  - Replace all match item detail classes with Tailwind
  - Replace `.match-actions`, `.match-apply-now-btn`, `.match-status-badge` with Tailwind
  - Replace `.match-details` and detail panel classes with Tailwind
  - Migrate ApplyModal classes to Tailwind
  - Remove CSS import and delete `MatchesView.css`

- [x] 5. Migrate TabbedNavigation and TabPanel to Tailwind
  - Read `TabbedNavigation.jsx`, `TabbedNavigation.css`, `TabPanel.jsx`, `TabPanel.css`
  - Migrate TabbedNavigation classes to Tailwind
  - Migrate TabPanel classes to Tailwind (feature cards, icons, descriptions)
  - Remove CSS imports and delete both CSS files

- [x] 6. Migrate FeaturesSection to Tailwind
  - Read `FeaturesSection.jsx` and `FeaturesSection.css`
  - Replace `.features-section` with Tailwind (gradient background, padding)
  - Replace `.features-container`, `.features-heading` with Tailwind
  - Replace `.features-tab-list` with Tailwind flex + overflow-x-auto
  - Replace `.features-tab`, `.features-tab-active` with Tailwind (preserve focus-visible and keyboard nav)
  - Replace `.features-tab-panels` with Tailwind
  - Remove CSS import and delete `FeaturesSection.css`

- [x] 7. Migrate BenefitsSection to Tailwind
  - Read `BenefitsSection.jsx` and `BenefitsSection.css`
  - Replace section wrapper, container, heading, subheading with Tailwind
  - Replace `.benefits-grid` with Tailwind grid (3-col responsive)
  - Replace `.benefit-card` with Tailwind (glassmorphism, hover effects)
  - Replace benefit card inner elements with Tailwind
  - Remove CSS import and delete `BenefitsSection.css`

- [x] 8. Migrate UseCasesSection to Tailwind
  - Read `UseCasesSection.jsx` and `UseCasesSection.css`
  - Migrate all classes to Tailwind
  - Remove CSS import and delete `UseCasesSection.css`

- [x] 9. Migrate FinalCTASection to Tailwind
  - Read `FinalCTASection.jsx` and `FinalCTASection.css`
  - Migrate all classes to Tailwind
  - Remove CSS import and delete `FinalCTASection.css`

- [x] 10. Migrate ProfilePage to Tailwind
  - Read `ProfilePage.jsx` and `ProfilePage.css`
  - Replace layout classes (container, content, sidebar, main) with Tailwind
  - Replace avatar card, stats, back button with Tailwind
  - Replace tabs and tab active state with Tailwind
  - Replace form card, form rows, form groups, inputs with Tailwind
  - Replace password input wrap, toggle button with Tailwind
  - Replace password strength bars and labels with Tailwind (dynamic color)
  - Replace password requirements list with Tailwind
  - Replace error/success messages and submit button with Tailwind
  - Remove CSS import and delete `ProfilePage.css`

- [x] 11. Migrate AdminPanel to Tailwind
  - Read `AdminPanel.jsx` and `AdminPanel.css`
  - Migrate all classes to Tailwind
  - Remove CSS import and delete `AdminPanel.css`

- [x] 12. Migrate AnalyticsPage to Tailwind
  - Read `AnalyticsPage.jsx` and `AnalyticsPage.css`
  - Migrate all classes to Tailwind
  - Remove CSS import and delete `AnalyticsPage.css`

- [x] 13. Migrate Chat to Tailwind
  - Read `Chat.jsx` and `Chat.css`
  - Migrate all classes to Tailwind
  - Remove CSS import and delete `Chat.css`

- [x] 14. Migrate App.css / App.jsx to Tailwind
  - Read `App.jsx` and `App.css`
  - Replace `.app`, `.app-main` with Tailwind
  - Replace `.loading-container`, `.loading-spinner` with Tailwind
  - Replace `.error-container`, `.error-banner`, `.migration-banner` with Tailwind
  - Replace auth modal classes with Tailwind
  - Remove CSS import and delete or minimize `App.css`
