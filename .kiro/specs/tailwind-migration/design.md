# Tailwind CSS Migration Design

## Approach

Each component migration follows the same pattern:
1. Read the existing JSX and CSS file
2. Replace every `className="css-class-name"` with equivalent Tailwind utility classes
3. Use inline `style` props for complex gradients and pseudo-element decorations that Tailwind can't express
4. Delete the CSS file
5. Remove the CSS import from the JSX file

## Tailwind Config Reference

The project's `tailwind.config.js` already defines:
- `primary.DEFAULT`: `#667eea`
- `primary.dark`: `#764ba2`
- `accent`: `#f093fb`
- `bg-brand-gradient`: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- `bg-brand-gradient-full`: `linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)`
- Animations: `slide-up`, `slide-down`, `spin-slow`, `shake`, `fade-in`

## Shared Patterns

### Gradient backgrounds
Use inline `style={{ background: 'linear-gradient(...)' }}` for complex gradients not in the config, or use the `bg-brand-gradient` utility class for the standard brand gradient.

### Pseudo-element top borders (decorative)
Cards with a colored top border strip (e.g., `::before` with gradient) should use a wrapper `div` with `rounded-t-*` and gradient background as a visual top bar, or use `border-t-4` with a solid color approximation.

### Scroll animations
The `animate-on-scroll` / `animate-in` pattern used by LandingPage sections should be preserved as custom CSS in `index.css` under `@layer utilities` since it's driven by a JS hook that toggles class names.

### Apply Modal (shared between JobCard and MatchesView)
Both components have identical `ApplyModal` implementations. The modal styles should be migrated consistently in both. Consider extracting to a shared component in a follow-up, but for this migration just migrate both independently.

### Focus states
Use `focus-visible:outline-2 focus-visible:outline-indigo-500 focus-visible:outline-offset-2` pattern (already used in SignupPage/LoginPage).

## Component-by-Component Notes

### LandingPage
- Nav: `flex justify-between items-center px-12 py-6 bg-white/10 backdrop-blur-md`
- Hero: `flex items-center justify-center min-h-[60vh] px-12 py-16`
- Footer: `bg-black/20 backdrop-blur-md px-12 pt-12 pb-6 mt-8`
- Keep `animate-on-scroll` / `animate-in` in `index.css` (used by child sections via JS hook)

### JobCard
- Card: `relative bg-gradient-to-br from-white to-[#f8f9ff] rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] p-8 max-w-[600px] mx-auto border border-white/80 overflow-hidden`
- Top gradient bar: inline `style` with `::before` equivalent — use a `div` with absolute positioning
- Swipe indicators: `absolute top-6 px-5 py-2.5 rounded-xl text-2xl font-black border-4 pointer-events-none z-10`

### JobBrowser
- Search bar: `bg-brand-gradient rounded-3xl p-6 mb-6 shadow-[0_8px_30px_rgba(102,126,234,0.4)] text-white`
- Search input wrap: `flex-1 min-w-[160px] flex items-center bg-white/20 border-2 border-white/30 rounded-2xl px-4 gap-2.5 backdrop-blur-md transition-all focus-within:border-white/70 focus-within:bg-white/30`

### MatchesView
- Header: `mb-7 px-7 py-6 bg-brand-gradient rounded-2xl text-white shadow-[0_8px_25px_rgba(102,126,234,0.4)]`
- Match item: `bg-white rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.08)] px-6 py-5 flex justify-between items-center cursor-pointer transition-all border-2 border-transparent hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 relative overflow-hidden`

### ProfilePage
- Container: `min-h-screen pt-20 px-4 pb-8` with gradient background via inline style
- Sidebar: `w-full max-w-[280px]` card with avatar, stats
- Password strength bars: use dynamic className based on score

### App.css
- Loading container: already has Tailwind-compatible structure, migrate to `flex flex-col items-center justify-center min-h-screen` etc.
- Auth modal: migrate to Tailwind (similar to existing modal patterns in LoginPage)
