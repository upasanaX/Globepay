# GlobePay – Copilot Instructions

## Project Overview
GlobePay is a fintech React SPA for international money transfers. The app name ("GlobePay") and user ("Ishika") are hardcoded in the UI. All data is static — there is **no real backend API**; `src/data/mockData.ts` is the single source of truth for all wallets, transactions, exchange rates, crypto, etc.

## Architecture

```
App.tsx  ──>  ThemeProvider (context/ThemeContext.tsx)
          └─> Router
               ├── "/"            → LandingPage  (standalone, no sidebar)
               └── DashboardLayout (Sidebar + Topbar + Outlet + ChatWidget)
                    └── all other routes (/dashboard, /send, /cards, …)
```

- **Two layout modes**: `LandingPage` is fully standalone; all authenticated pages render inside `DashboardLayout` via React Router's `<Outlet>`.
- **`DashboardLayout`** owns the sidebar toggle state and wraps every page in `PageTransition` (`AnimatePresence` + `framer-motion`).
- **`ChatWidget`** is a floating, keyword-matched mock chatbot mounted globally in `DashboardLayout` — it has no real AI backend.

## Styling System (Dual — Important)

Two styling libraries coexist. Use the right one per context:

| Use case | Tool |
|---|---|
| Layout, spacing, responsive, dark mode utilities | **Tailwind CSS** (`className="..."`) |
| Complex component styles with variants/states | **Stitches** (`styled(...)` from `stitches.config.ts`) |

**Tailwind conventions:**
- Dark mode is **class-based** (`dark:` prefix). Toggle via `useTheme()` from `context/ThemeContext.tsx`; theme is persisted as `globepay-theme` in `localStorage`.
- Custom utility classes are defined in `src/index.css`: `.glass`, `.glass-card`, `.gradient-text`, `.btn-primary`, `.sidebar-link`.
- Brand palette: `brand-50…950` (indigo/violet), `surface-50…900` (slate dark). Use `from-brand-600 to-purple-600` for gradient accents.

**Stitches conventions:**
- Design tokens live in `src/stitches.config.ts` (colors, spacing 4px scale, radii, shadows, transitions, z-indices).
- Re-exported type-safe aliases are in `src/styles/tokens.ts` — use `$primary`, `$2`, `$md`, etc.
- Named keyframes are in `src/styles/animations.ts` (`fadeInUp`, `scalePop`, `errorShake`, etc.) — import and compose into `styled()` components.
- See `src/components/ui/Button.tsx` as the reference implementation for a multi-variant Stitches component.

## Animation Pattern
- **Page transitions**: every page is wrapped by `PageTransition` (`framer-motion` fade+slide), keyed on `location.pathname`.
- **Staggered lists**: define a `fadeUp` variant object with a `custom` index multiplier (see `DashboardPage.tsx`).
- Import `AnimatePresence` for conditional mount/unmount animations (modals, sidebar overlay, chat).

## Adding a New Page
1. Create `src/pages/MyPage.tsx` (use `motion.div` for entrance animation).
2. Add a route in `App.tsx` inside the `<DashboardLayout>` route group.
3. Add a `navItems` entry in `src/components/layout/Sidebar.tsx` with a `lucide-react` icon.
4. Add any new mock data to `src/data/mockData.ts` with a TypeScript interface.

## Key Dependencies
- `react-router-dom` v7 — use `<Link>`, `useLocation`, `useNavigate`.
- `lucide-react` — sole icon library; do not import from other icon packages.
- `recharts` v3 — for all charts; always wrap in `<ResponsiveContainer>`.
- `framer-motion` v12 — all animations; prefer `motion.*` components over CSS transitions for interactive elements.
- `axios` is installed but unused; all data comes from `mockData.ts`.

## Dev Workflows
```bash
# Development (hot reload on port 3000)
cd fintech-interface && npm start

# Production build
cd fintech-interface && npm run build

# Serve production build (port 5000, SPA-aware)
node fintech-interface/server.js

# Tests
cd fintech-interface && npm test
```

## Key Files Reference
- `src/stitches.config.ts` — design token source of truth
- `src/styles/tokens.ts` — typed token aliases
- `src/styles/animations.ts` — reusable Stitches keyframes
- `src/data/mockData.ts` — all app data + TypeScript interfaces
- `src/components/ui/Button.tsx` — reference for Stitches multi-variant components
- `src/index.css` — Tailwind layers + shared utility classes (`.glass-card`, `.btn-primary`)
- `tailwind.config.js` — extended brand/surface palette + custom keyframes
