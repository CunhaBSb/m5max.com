# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Build & Development:**
- `npm run dev` - Start Vite development server on http://localhost:5173
- `npm run build` - Production build with optimized 7-chunk bundle splitting
- `npm run build:dev` - Development build with debugging enabled
- `npm run preview` - Preview production build locally

**Quality Checks:**
- `npm run lint` - Run ESLint (TypeScript-ESLint with React hooks rules)
- `npm run test` - Run Vitest unit tests
- `npm run test:ui` - Open Vitest UI for interactive testing
- `npx tsc --noEmit` - TypeScript type checking (strict mode enabled)

**TypeScript Configuration:**
- Strict mode enabled with comprehensive strictness flags (tsconfig.json:12-22)
- noImplicitAny, noUnusedParameters, noUnusedLocals, strictNullChecks all enabled
- exactOptionalPropertyTypes and noUncheckedIndexedAccess for maximum safety

## Architecture Overview

### Bifurcated Desktop/Mobile Architecture

The codebase uses a **platform-specific component architecture** that separates desktop and mobile implementations at the component level:

**Breakpoint:** 1024px (defined in src/shared/hooks/useIsDesktop.ts:3)

**Structure Pattern:**
```
src/features/<feature>/
├── pages/FeaturePage.tsx          # Lazy-loading entry point
├── desktop/Feature.tsx            # Desktop-specific implementation
├── mobile/Feature.tsx             # Mobile-specific implementation
└── components/                    # Shared feature components
    ├── desktop/                   # Desktop-specific subcomponents
    └── mobile/                    # Mobile-specific subcomponents
```

**Implementation Example (src/features/home/pages/HomePage.tsx:1-32):**
- Page components use `PlatformSwitch` to toggle between desktop/mobile
- Both versions are lazy-loaded with React.lazy() and Suspense
- Custom loading fallback with M5 Max branding

**Key Hook:** `useIsDesktop()` (src/shared/hooks/useIsDesktop.ts:5-27)
- Returns boolean | null to handle SSR/hydration
- Uses window.matchMedia for responsive detection
- Properly cleans up event listeners

### State Management

**Single Zustand Store** (src/shared/store/appStore.ts:27-76)

**State Shape:**
- `attribution: AttributionData | null` - UTM tracking and campaign data
- `consent: ConsentState` - GDPR consent for analytics (analytics_storage, ad_storage, etc.)
- `conversionModalOpen: boolean` - Conversion flow modal state
- `formModalOpen: boolean` - Form submission modal state
- `currentAudience: AudienceType` - Current targeting context (b2b, b2c, general)

**Persistence Strategy:**
- Uses zustand/persist middleware with localStorage
- Storage key: 'm5max-storage'
- Only persists: attribution, consent, currentAudience (lines 69-73)
- UI state (modals) is NOT persisted intentionally

### Form System & Lead Scoring

**Dual Form System** (src/shared/types/forms.ts:4-42):
- `B2BFormSchema` - Corporate events (festivals, Réveillon, weddings 500+ people)
- `B2CFormSchema` - Personal events (gender reveals, small parties, residential)

**Lead Scoring Algorithm** (src/shared/types/forms.ts:77-136):

**B2B Scoring Weights:**
- Budget Range: 15-40 points (5k-15k → 15pts, 200k+ → 40pts)
- Attendees: 10-30 points (up to 500 → 10pts, 20k+ → 30pts)
- Event Type: 10-30 points (corporate → 30pts, Réveillon → 25pts)
- Product Type: 10-30 points (deluxe kit → 30pts, basic → 10pts)

**B2C Scoring Weights:**
- Budget Range: 10-40 points (up to 5k → 10pts, 30k+ → 40pts)
- Attendees: 15-30 points (up to 50 → 15pts, 200+ → 30pts)
- Event Type: 10-35 points (gender reveal → 35pts, wedding → 30pts)
- Product Type: 15-35 points (surprise kit → 35pts, basic → 15pts)

**Form Validation:**
- Uses Zod schemas with Portuguese error messages
- React Hook Form integration via @hookform/resolvers
- Type inference: `type B2BFormData = z.infer<typeof B2BFormSchema>`

### Routing & Features

**Routes** (src/app/router/AppRoutes.tsx:10-15):
- `/` - HomePage (main landing)
- `/reveillon` - ReveillonPage (New Year's Eve events)
- `/produtos` - ProdutosPage (product catalog)
- `/orcamento-iate-2026` - OrcamentoIatePage (yacht club quote 2026)
- `*` - NotFound (404 page)

**Current Features:**
- home
- reveillon
- produtos
- orcamento-iate

Each feature follows the bifurcated architecture pattern.

### Bundle Optimization Strategy

**Manual Chunk Splitting** (vite.config.ts:17-41):

The build uses 7 optimized chunks for performance:

1. **react-vendor** (~40KB) - React core (react, react-dom, react-router-dom)
2. **ui-vendor** (~35KB) - Most-used Radix UI components (dialog, accordion, dropdown, popover)
3. **form-vendor** (~45KB) - Form dependencies (react-hook-form, @hookform/resolvers, zod)
4. **icons-vendor** (~20KB) - Icon libraries (lucide-react, react-icons)
5. **media-vendor** (~15KB) - Lazy-loaded media (react-youtube)
6. **utils-vendor** (~12KB) - Shared utilities (clsx, tailwind-merge, class-variance-authority, date-fns)
7. **modal-vendor** (~18KB) - On-demand UI (select, checkbox)
8. **advanced-ui** (~10KB) - Rarely-used components (menubar, context-menu, navigation-menu)

**Strategy:** Critical path first (react + ui + utils + icons ~107KB), on-demand loading for forms/modals/media.

### Import Aliases

**Path Mapping** (vite.config.ts:46-51):
```typescript
@app/*     → src/app/*      // Routing, providers, layouts
@features/* → src/features/* // Feature modules
@shared/*  → src/shared/*   // Shared components, hooks, types
@/*        → src/*           // General imports
```

Also configured in tsconfig.json:10 for TypeScript resolution.

### UI Component System

**Technology Stack:**
- **Radix UI** - Headless, accessible component primitives
- **shadcn/ui** - Styling patterns built on Radix
- **Tailwind CSS** - Utility-first styling
- **class-variance-authority** - Component variant management

**Component Location:** src/shared/ui/

**M5 Max Theme Colors** (tailwind.config.ts:109-127):
- **fire colors:** red, orange, gold, yellow (pyrotechnic theme)
- **tech colors:** blue, blue-light (professional/technical)
- **metal colors:** silver, platinum (premium feel)
- **safety colors:** green (#16a34a), warning (#eab308)

**Primary Brand Color:** Orange #f97316 (tailwind.config.ts:53)

### Analytics & Tracking

**Environment Variables Required** (.env):
- `VITE_GTM_ID` - Google Tag Manager container ID
- `VITE_GA4_ID` - Google Analytics 4 measurement ID
- `VITE_GADS_ID` - Google Ads conversion tracking
- `VITE_META_PIXEL_ID` - Meta (Facebook) Pixel ID
- `VITE_WHATSAPP_NUMBER` - WhatsApp Business number
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

**Analytics Provider** (src/app/providers/analytics/AnalyticsProvider.tsx):
- Integrated GTM, GA4, and Meta Pixel
- GDPR-compliant consent management via ConsentBanner
- Consent state stored in Zustand store

**Attribution Tracking:**
- UTM parameters captured via useAttribution hook
- Persisted in Zustand store for conversion attribution
- Used in lead scoring and analytics events

### Business Context

**Company:** Fogos M5 - Professional fireworks and pyrotechnic events
**Market:** Brazilian market (Portuguese language)
**Target Audiences:**
- **B2B:** Corporate events, festivals, large celebrations (500+ attendees)
- **B2C:** Personal events, gender reveals, weddings, parties

**Event Types:**
- Réveillon (New Year's Eve) - Premium pricing, high demand
- Corporate events - High-value leads
- Weddings - Medium-value, high volume
- Gender reveals (chá revelação) - Growing market segment
- Festivals and public events - Large scale

**Conversion Flow:**
1. User arrives from marketing campaign (UTM tracked)
2. Hero section with CTA
3. Opens conversion modal (tracked in store)
4. Fills form (B2B or B2C schema)
5. Lead scoring calculation
6. Redirect to WhatsApp or email based on score and preferences

## Development Guidelines

### Before Making Changes

1. **Read files first** - Never propose changes to code you haven't read
2. **Understand bifurcation** - Check if changes affect desktop, mobile, or both
3. **Check state impact** - Verify if Zustand store needs updates
4. **Validate forms** - Update Zod schemas if changing form fields
5. **Test responsiveness** - Changes must work at 1024px breakpoint

### Pattern Consistency

**When adding new features:**
1. Create folder: `src/features/<feature-name>/`
2. Add page component: `pages/<Feature>Page.tsx` with lazy loading pattern:
   ```tsx
   import { ChunkErrorBoundary } from '@/shared/ui/ChunkErrorBoundary';
   import { ConditionalLazy } from '@/shared/layout/switchers/ConditionalLazy';
   import { PageLoading } from '@/shared/ui/page-loading';

   const FeaturePage = () => (
     <ChunkErrorBoundary>
       <ConditionalLazy
         desktopLoader={() => import('../desktop/Feature')}
         mobileLoader={() => import('../mobile/Feature')}
         fallback={<PageLoading />}
       />
     </ChunkErrorBoundary>
   );
   ```
3. Create desktop version: `desktop/<Feature>.tsx`
4. Create mobile version: `mobile/<Feature>.tsx`
5. For mobile pages, wrap below-fold sections with LazySection for viewport-based lazy loading
6. Update AppRoutes.tsx with new route

**Note:** `PlatformSwitch` is deprecated for lazy-loaded pages. Use it only for non-lazy components (Header, Footer, inline components).

**When adding UI components:**
- Add to `src/shared/ui/` if reusable across features
- Add to `src/features/<feature>/components/` if feature-specific
- Use class-variance-authority for variants
- Follow M5 Max theme colors from tailwind.config.ts

**When modifying forms:**
1. Update Zod schema in src/shared/types/forms.ts
2. Update lead scoring weights if needed (lines 77-136)
3. Update form component to use new fields
4. Test Portuguese validation messages
5. Verify TypeScript types auto-update via z.infer

### Code Quality

**ESLint Configuration** (eslint.config.js):
- TypeScript-ESLint recommended rules enabled
- React Hooks rules enforced
- React Refresh for HMR
- @typescript-eslint/no-unused-vars disabled (TypeScript handles this)

**Testing:**
- Current test coverage is very low (~3 files tested)
- Priority: Add tests for form validation, state management, and core user flows
- Use Vitest with jsdom environment (configured in vite.config.ts:58-63)
- Testing library already configured (src/setupTests.ts)

### Performance Considerations

**Lazy Loading (Optimized Pattern):**
- All page-level components use ConditionalLazy + ChunkErrorBoundary
- Platform detection happens FIRST (synchronous), THEN lazy loading starts
- Only loads the needed chunk (desktop OR mobile), reducing network traffic by ~50%
- Eliminates dual loading state flash (single consistent PageLoading)
- ChunkErrorBoundary catches chunk loading failures with retry UI
- Mobile pages use LazySection for below-fold content (Intersection Observer)

**Key Components:**
- `ConditionalLazy` (src/shared/layout/switchers/ConditionalLazy.tsx) - Conditional lazy loading
- `ChunkErrorBoundary` (src/shared/ui/ChunkErrorBoundary.tsx) - Error recovery for chunk failures
- `LazySection` (src/shared/layout/LazySection.tsx) - Viewport-based lazy loading for sections
- `useIsDesktop()` returns boolean immediately (never null), mobile-first SSR (returns false)

**Bundle Size:**
- Monitor chunk sizes after changes
- Keep critical path <250KB gzipped
- Use dynamic imports for heavy dependencies
- Tree-shake icon imports (import specific icons, not entire packages)

**Images:**
- Use OptimizedImage component (src/shared/ui/optimized-image.tsx)
- Implement lazy loading for below-fold images
- Consider WebP format for better compression

## Anti-Patterns to Avoid

1. **Don't bypass the bifurcated architecture** - Always create desktop and mobile versions
2. **Don't mutate Zustand state directly** - Use provided action methods
3. **Don't skip lazy loading** - Page components must use ConditionalLazy + ChunkErrorBoundary
4. **Don't use PlatformSwitch for lazy-loaded pages** - Use ConditionalLazy instead (PlatformSwitch is for non-lazy components only)
5. **Don't hardcode analytics IDs** - Use environment variables
6. **Don't create forms without Zod schemas** - Type safety and validation are critical
7. **Don't ignore the 1024px breakpoint** - Test all changes at this width
8. **Don't add heavy dependencies without chunk optimization** - Update vite.config.ts manual chunks
9. **Don't forget LazySection for mobile below-fold content** - Improves initial load performance

## Quick Reference

**Platform detection:** src/shared/hooks/useIsDesktop.ts:3 (1024px)
**State store:** src/shared/store/appStore.ts:27-76
**Form schemas:** src/shared/types/forms.ts:4-42
**Lead scoring:** src/shared/types/forms.ts:77-136
**Routes:** src/app/router/AppRoutes.tsx:10-15
**Bundle config:** vite.config.ts:17-41
**Theme colors:** tailwind.config.ts:109-127
**Import aliases:** vite.config.ts:46-51

**Common file locations:**
- Feature pages: `src/features/{feature}/pages/{Feature}Page.tsx`
- Desktop components: `src/features/{feature}/desktop/`
- Mobile components: `src/features/{feature}/mobile/`
- Shared UI: `src/shared/ui/`
- Shared hooks: `src/shared/hooks/`
- Types: `src/shared/types/`
- Store: `src/shared/store/appStore.ts`
