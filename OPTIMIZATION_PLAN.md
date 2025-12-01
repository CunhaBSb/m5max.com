# M5 MAX Codebase Optimization Plan
## Comprehensive Phased Approach for Structure, Deduplication, Performance & Scalability

---

## EXECUTIVE SUMMARY

**Current State Analysis:**
- **Total Files**: 152 source files (37 in features, 115 shared/app/other)
- **Test Coverage**: 4.6% (7 test files out of 152 source files)
- **Bundle Size**: 189.40 kB main (55.71 kB gzipped) + 7 vendor chunks
- **Architecture**: Bifurcated desktop/mobile at 1024px breakpoint
- **Features**: 4 features (home, produtos, reveillon, orcamento-iate)

**Verified Structural Issues:**
1. **Pattern Inconsistency**: ReveillonPage uses `useIsDesktop` hook directly; other pages use `PlatformSwitch` component
2. **Import Alias Misuse**: 3 files use `@features` for intra-feature imports (should be relative)
3. **Export Inconsistency**: Feature index.ts files vary wildly (home: 11 lines, produtos: 1 line)
4. **Missing Hook Export**: `useIsDesktop` not exported from `/home/cunha/m5max/src/shared/hooks/index.ts`
5. **Structural Anomaly**: orcamento-iate has no components subdirectories

**Code Duplication Confirmed:**
- **Layout Components**: 5 duplicated pairs (Header, Footer, Services, FAQ, FogosM5Complete)
  - Services.tsx: 233 lines (desktop) vs 276 lines (mobile) - ~85% similar logic
  - Header, Footer, FAQ, FogosM5Complete all duplicated
- **Page Loading Components**: 4 identical PageLoading components across features
- **Desktop/Mobile Split**: Some shared logic duplicated in platform-specific components

**Performance Opportunities:**
- Main bundle: 189.40 kB (could be reduced by 20-30% with deduplication)
- Supabase products hook: 138.95 kB (38.35 kB gzipped) - potential lazy loading target
- Test coverage gap: Critical business logic untested

---

## OPTIMIZATION STRATEGY OVERVIEW

**Priority Order** (User-specified):
1. **ESTRUTURA PRIMEIRO** - Fix inconsistencies and standardize
2. **Eliminate código duplicado** - Reduce duplication
3. **Performance** - Optimize bundle size
4. **Escalabilidade** - Prepare for growth

**Approach Philosophy:**
- **Safe and Incremental**: Each phase is independently testable and deployable
- **Git-branched**: Separate branches allow parallel work and easy rollback
- **Measurable**: Clear success metrics for each phase
- **Pattern-driven**: Leverage existing patterns, don't reinvent

---

## PHASE 1: ESTRUTURA - Standardization & Consistency
**Branch**: `feat/optimize-structure`  
**Duration**: 2-3 days  
**Risk Level**: LOW  
**Dependencies**: None

### Objectives
1. Standardize page component patterns across all features
2. Fix import alias misuse (replace @features with relative imports)
3. Standardize feature index.ts exports
4. Add missing hook exports
5. Normalize directory structures

### Specific Changes

#### 1.1 Standardize Page Patterns
**File**: `/home/cunha/m5max/src/features/reveillon/pages/ReveillonPage.tsx`
- **Current**: Uses `useIsDesktop` hook directly with manual Suspense
- **Change**: Migrate to `PlatformSwitch` component pattern (like HomePage, ProdutosPage, OrcamentoIatePage)
- **Benefit**: Consistent pattern, centralized platform logic, easier maintenance

**Before** (lines 1-24):
```tsx
import { lazy, Suspense } from 'react';
import { useIsDesktop } from '@/shared/hooks/useIsDesktop';

const ReveillonDesktop = lazy(() => import('@/features/reveillon/desktop/Reveillon'));
const ReveillonMobile = lazy(() => import('@/features/reveillon/mobile/Reveillon'));

const ReveillonPage = () => {
  const isDesktop = useIsDesktop();
  return (
    <Suspense fallback={<ReveillonPageFallback />}>
      {isDesktop ? <ReveillonDesktop /> : <ReveillonMobile />}
    </Suspense>
  );
};
```

**After**:
```tsx
import { lazy, Suspense } from 'react';
import { PlatformSwitch } from '@/shared/layout/switchers/PlatformSwitch';

const ReveillonDesktop = lazy(() => import('../desktop/Reveillon'));
const ReveillonMobile = lazy(() => import('../mobile/Reveillon'));

const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 to-black">
    <img src="/m5logo.svg" alt="M5 Max" className="w-12 h-12 opacity-80 animate-pulse" />
  </div>
);

const ReveillonPage = () => (
  <Suspense fallback={<PageLoading />}>
    <PlatformSwitch desktop={<ReveillonDesktop />} mobile={<ReveillonMobile />} />
  </Suspense>
);
```

#### 1.2 Fix Import Alias Misuse
**Files** (3 total):
- `/home/cunha/m5max/src/features/reveillon/desktop/Reveillon.tsx` (line 5, 7)
- `/home/cunha/m5max/src/features/reveillon/mobile/Reveillon.tsx`
- `/home/cunha/m5max/src/features/home/desktop/Home.tsx` (line 5)

**Pattern**: Replace `@features/<feature>/` with relative imports `../` within feature directories

**Example Fix** - Reveillon.tsx line 5:
```tsx
// BEFORE
import ReveillonHero from '@features/reveillon/desktop/components/ReveillonHero';

// AFTER  
import ReveillonHero from './components/ReveillonHero';
```

**Rationale**: `@features` is for cross-feature imports. Intra-feature imports should be relative for better encapsulation and portability.

#### 1.3 Standardize Feature Index Exports
**Files** (4 feature index.ts files):

**Current State**:
- `home/index.ts`: 11 lines, detailed comments, exports page + desktop/mobile + components
- `produtos/index.ts`: 1 line, minimal, only exports page
- `reveillon/index.ts`: 2 lines, only exports page
- `orcamento-iate/index.ts`: 3 lines, exports page + desktop + mobile

**Standardized Pattern** (apply to all):
```tsx
// src/features/<feature>/index.ts

// Main page container with PlatformSwitch integration
export { default as <Feature>Page } from './pages/<Feature>Page';

// Desktop implementation
export { default as <Feature>Desktop } from './desktop/<Feature>';

// Mobile implementation
export { default as <Feature>Mobile } from './mobile/<Feature>';

// Feature-specific components (if any)
// export { Component1, Component2 } from './components';
```

**Apply to**:
- `produtos/index.ts` - Add desktop/mobile exports
- `reveillon/index.ts` - Add desktop/mobile exports + standardize comments

#### 1.4 Add Missing Hook Exports
**File**: `/home/cunha/m5max/src/shared/hooks/index.ts`

**Current** (lines 1-3):
```tsx
export { useAnalytics } from './useAnalytics';
export { useAttribution } from './useAttribution';
export { useToast } from './useToast';
```

**Add**:
```tsx
export { useIsDesktop } from './useIsDesktop';
export { useMedia } from './useMedia';
export { useSupabaseProducts } from './useSupabaseProducts';
```

**Benefit**: Centralized hook exports, easier imports, better discoverability

#### 1.5 Normalize orcamento-iate Structure
**Current**: Missing `components/` subdirectories in desktop/mobile

**Action**: Create subdirectories for future component extraction:
```
src/features/orcamento-iate/
  ├── desktop/
  │   ├── components/          ← CREATE
  │   └── OrcamentoIateDesktop.tsx
  └── mobile/
      ├── components/          ← CREATE
      └── OrcamentoIateMobile.tsx
```

**Note**: No code changes yet, just structure preparation for Phase 2

### Success Metrics
- [ ] All 4 pages use identical PlatformSwitch pattern
- [ ] Zero `@features` imports within feature directories (verified via grep)
- [ ] All 4 feature index.ts files follow standard 8-12 line format
- [ ] All 6+ hooks exported from shared/hooks/index.ts
- [ ] All features have parallel directory structures
- [ ] `npm run lint` passes without errors
- [ ] `npm run build` completes successfully
- [ ] Visual regression testing: All pages render identically

### Rollback Strategy
- Git revert to `main` branch
- No database changes, no API changes
- Zero user-facing impact (purely internal refactor)

---

## PHASE 2: DEDUPLICAÇÃO - Eliminate Code Duplication
**Branch**: `feat/deduplicate-code`  
**Duration**: 4-5 days  
**Risk Level**: MEDIUM  
**Dependencies**: Phase 1 complete

### Objectives
1. Extract shared layout component logic
2. Create reusable PageLoading component
3. Consolidate desktop/mobile variations using composition
4. Reduce bundle size by 20-30% through deduplication

### Specific Changes

#### 2.1 Extract Shared Layout Logic
**Problem**: 5 layout components duplicated (Services, FAQ, Header, Footer, FogosM5Complete)
- Services: 233 lines (desktop) vs 276 lines (mobile) - ~85% similar business logic

**Solution**: Create platform-agnostic base components with desktop/mobile variants for styling only

**New Structure**:
```
src/shared/layout/
  ├── components/              ← NEW
  │   ├── Services/
  │   │   ├── ServicesBase.tsx      ← Shared logic (data, handlers, structure)
  │   │   ├── ServicesDesktop.tsx   ← Desktop styling wrapper
  │   │   ├── ServicesMobile.tsx    ← Mobile styling wrapper
  │   │   └── index.tsx             ← PlatformSwitch integration
  │   ├── FAQ/
  │   │   ├── FAQBase.tsx
  │   │   ├── FAQDesktop.tsx
  │   │   ├── FAQMobile.tsx
  │   │   └── index.tsx
  │   ├── Header/
  │   ├── Footer/
  │   └── FogosM5Complete/
  ├── desktop/                 ← DEPRECATED (keep temporarily)
  └── mobile/                  ← DEPRECATED (keep temporarily)
```

**Implementation Pattern** (example for Services):

**ServicesBase.tsx** (new):
```tsx
// Shared business logic and structure
export interface ServicesData {
  showcaseVideos: Array<{
    youtubeId: string;
    title: string;
    description: string;
    badges: string[];
  }>;
  socialLinks: {
    whatsapp: string;
    instagram: string;
    youtube: string;
  };
}

export const useServicesData = () => {
  // Shared data fetching and handlers
  const { trackEvent } = useAnalytics();
  const { setModalOpen } = useAppStore();
  
  const showcaseVideos = [ /* shared data */ ];
  
  const handleContactClick = () => {
    trackEvent('contact_click', { section: 'services' });
    // shared logic
  };
  
  return { showcaseVideos, handleContactClick, socialLinks };
};
```

**ServicesDesktop.tsx** (desktop styling):
```tsx
import { useServicesData } from './ServicesBase';

export const ServicesDesktop = () => {
  const { showcaseVideos, handleContactClick } = useServicesData();
  
  return (
    <section className="desktop-specific-classes">
      {/* Desktop-specific layout */}
      <div className="grid grid-cols-3 gap-6">
        {showcaseVideos.map(video => (
          <ShowcaseVideoCard key={video.youtubeId} {...video} />
        ))}
      </div>
    </section>
  );
};
```

**ServicesMobile.tsx** (mobile styling):
```tsx
import { useServicesData } from './ServicesBase';

export const ServicesMobile = () => {
  const { showcaseVideos, handleContactClick } = useServicesData();
  
  return (
    <section className="mobile-specific-classes">
      {/* Mobile-specific layout */}
      <div className="flex flex-col gap-4">
        {showcaseVideos.map(video => (
          <ShowcaseVideoCard key={video.youtubeId} {...video} />
        ))}
      </div>
    </section>
  );
};
```

**index.tsx** (PlatformSwitch integration):
```tsx
import { PlatformSwitch } from '../switchers/PlatformSwitch';
import { ServicesDesktop } from './ServicesDesktop';
import { ServicesMobile } from './ServicesMobile';

export const Services = () => (
  <PlatformSwitch desktop={<ServicesDesktop />} mobile={<ServicesMobile />} />
);

export default Services;
```

**Migration Strategy**:
1. Create new component structure for Services (test thoroughly)
2. Update imports in all feature files to use new structure
3. Keep old desktop/mobile files for 1 sprint as backup
4. Apply pattern to FAQ, Header, Footer, FogosM5Complete
5. Delete deprecated desktop/mobile directories after validation

**Expected Reduction**:
- Services: 509 lines → ~350 lines (31% reduction)
- FAQ: ~400 lines → ~280 lines (30% reduction)
- Total: ~2000 lines → ~1400 lines (30% reduction across layout components)

#### 2.2 Create Reusable PageLoading Component
**Problem**: 4 identical PageLoading components across features

**Solution**: Extract to shared component

**New File**: `/home/cunha/m5max/src/shared/layout/PageLoading.tsx`
```tsx
export const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 to-black">
    <div className="text-center">
      <img 
        src="/m5logo.svg" 
        alt="M5 Max" 
        className="w-12 h-12 mx-auto opacity-80 animate-pulse" 
      />
    </div>
  </div>
);
```

**Update Imports** (4 files):
- `/home/cunha/m5max/src/features/home/pages/HomePage.tsx`
- `/home/cunha/m5max/src/features/produtos/pages/ProdutosPage.tsx`
- `/home/cunha/m5max/src/features/reveillon/pages/ReveillonPage.tsx`
- `/home/cunha/m5max/src/features/orcamento-iate/pages/OrcamentoIatePage.tsx`

```tsx
// BEFORE
const PageLoading = () => ( /* 6 lines */ );

// AFTER
import { PageLoading } from '@/shared/layout/PageLoading';
```

**Benefit**: 24 lines eliminated, single source of truth for loading states

#### 2.3 Extract orcamento-iate Components
**File**: `/home/cunha/m5max/src/features/orcamento-iate/desktop/OrcamentoIateDesktop.tsx` (30,133 bytes)

**Action**: Extract reusable components into `components/` subdirectory
- Identify repeated sections (headers, forms, cards)
- Create 4-6 smaller components
- Reduce main file from 30KB to <15KB

**Example Extractions**:
```
components/
  ├── IateHeroSection.tsx
  ├── IatePricingCard.tsx
  ├── IateFeaturesList.tsx
  └── IateContactForm.tsx
```

### Success Metrics
- [ ] 5 layout component families refactored (Services, FAQ, Header, Footer, FogosM5Complete)
- [ ] Code duplication reduced by 30% (measured via line count and bundle size)
- [ ] Single PageLoading component used by all 4 features
- [ ] orcamento-iate components extracted (main files <15KB each)
- [ ] Bundle size reduced by 20-30% (target: 135KB main bundle, 40KB gzipped)
- [ ] `npm run build` shows chunk size improvements
- [ ] All pages render identically (visual regression tests)
- [ ] No console errors or warnings

### Rollback Strategy
- Keep deprecated desktop/mobile directories for 1 sprint
- Feature flags for new component structure
- Parallel imports during transition period
- Git revert if critical issues arise

---

## PHASE 3: PERFORMANCE - Bundle Optimization
**Branch**: `feat/optimize-performance`  
**Duration**: 3-4 days  
**Risk Level**: MEDIUM-HIGH  
**Dependencies**: Phase 2 complete

### Objectives
1. Optimize Supabase products hook (138.95 kB → lazy load)
2. Improve code splitting strategy
3. Add preloading for critical chunks
4. Implement bundle analysis monitoring
5. Achieve <50KB gzipped initial load

### Specific Changes

#### 3.1 Lazy Load Supabase Products Hook
**Problem**: `useSupabaseProducts-DXtDJl6i.js` is 138.95 kB (38.35 kB gzipped)
- Currently loaded even on pages that don't use products

**Solution**: Lazy load only on produtos feature

**File**: `/home/cunha/m5max/src/features/produtos/desktop/Produtos.tsx`

**Before**:
```tsx
import { useSupabaseProducts } from '@/shared/hooks/useSupabaseProducts';

const ProdutosDesktop = () => {
  const { products, loading } = useSupabaseProducts();
  // ...
};
```

**After**:
```tsx
import { lazy, Suspense } from 'react';

const ProductsLoader = lazy(() => import('../components/ProductsLoader'));

const ProdutosDesktop = () => {
  return (
    <Suspense fallback={<ProductsLoadingState />}>
      <ProductsLoader />
    </Suspense>
  );
};
```

**New File**: `src/features/produtos/components/ProductsLoader.tsx`
```tsx
import { useSupabaseProducts } from '@/shared/hooks/useSupabaseProducts';

export const ProductsLoader = () => {
  const { products, loading } = useSupabaseProducts();
  // products rendering logic
};
```

**Expected Impact**: Initial bundle reduced by ~38KB gzipped (only loads on produtos page)

#### 3.2 Optimize Manual Chunks Configuration
**File**: `/home/cunha/m5max/vite.config.ts`

**Current** (lines 17-41): 7 vendor chunks

**Optimization**:
```tsx
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        // Critical path (load immediately)
        'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        'ui-critical': ['@radix-ui/react-dialog', 'lucide-react'],
        
        // On-demand (lazy load)
        'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
        'ui-advanced': [
          '@radix-ui/react-accordion',
          '@radix-ui/react-dropdown-menu',
          '@radix-ui/react-popover',
          '@radix-ui/react-select',
          '@radix-ui/react-checkbox'
        ],
        'media-vendor': ['react-youtube'],
        'supabase-vendor': ['@supabase/supabase-js'],  // ← NEW: Isolate Supabase
        
        // Utilities (shared)
        'utils-vendor': ['clsx', 'tailwind-merge', 'class-variance-authority', 'date-fns']
      }
    }
  }
}
```

**Rationale**: 
- Separate Supabase into its own chunk for better caching
- Combine less-used Radix UI components into single chunk
- Reduce critical path to <3 chunks

#### 3.3 Add Preloading for Critical Routes
**File**: `/home/cunha/m5max/src/app/router/AppRoutes.tsx`

**Current**: Basic lazy loading without preloading

**Add Preloading**:
```tsx
import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Lazy load pages
const HomePage = lazy(() => import('@/features/home'));
const ProdutosPage = lazy(() => import('@/features/produtos'));
const ReveillonPage = lazy(() => import('@/features/reveillon'));

// Preload on hover/mouseover
const preloadRoutes = {
  '/': () => import('@/features/home'),
  '/produtos': () => import('@/features/produtos'),
  '/reveillon': () => import('@/features/reveillon')
};

export const AppRoutes = () => {
  const handleLinkHover = (path: string) => {
    if (preloadRoutes[path]) {
      preloadRoutes[path]();
    }
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/produtos" element={<ProdutosPage />} />
      <Route path="/reveillon" element={<ReveillonPage />} />
      <Route path="/orcamento-iate" element={<OrcamentoIatePage />} />
    </Routes>
  );
};

// Add hover preloading to navigation links
```

**Integration**: Add `onMouseEnter` handlers to Header navigation links

**Expected Impact**: Instant page loads after first hover (50-100ms improvement)

#### 3.4 Implement Bundle Analysis Monitoring
**New Script**: `package.json`
```json
{
  "scripts": {
    "build:analyze": "vite build --mode production && vite-bundle-analyzer"
  }
}
```

**Install**: `npm install --save-dev vite-bundle-analyzer`

**Add to CI/CD**: Track bundle size over time, fail if exceeds thresholds

**Thresholds**:
```json
{
  "budgets": {
    "initial": "250kb",  // gzipped
    "mainChunk": "60kb",
    "vendorChunk": "150kb",
    "lazyChunk": "30kb"
  }
}
```

#### 3.5 Optimize Image Assets
**Action**: Audit and optimize images
```bash
# Find large images
find src -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.svg" \) -exec ls -lh {} \;

# Optimize with imagemin or similar
npx @squoosh/cli --mozjpeg auto src/**/*.jpg
npx svgo src/**/*.svg
```

**Add**: WebP format with fallback for photos

### Success Metrics
- [ ] Initial bundle <50KB gzipped (currently 55.71KB)
- [ ] Supabase chunk only loads on produtos page
- [ ] First Contentful Paint (FCP) <1.2s
- [ ] Time to Interactive (TTI) <3.0s
- [ ] Lighthouse Performance score >90
- [ ] Bundle analysis integrated into CI/CD
- [ ] All image assets optimized (<100KB each)
- [ ] Route preloading working (measure with DevTools)

### Rollback Strategy
- Revert vite.config.ts changes if build fails
- Keep old chunk configuration as fallback
- Monitor performance metrics for regressions
- Rollback if Lighthouse score drops >10 points

---

## PHASE 4: ESCALABILIDADE - Architecture for Growth
**Branch**: `feat/scalable-architecture`  
**Duration**: 5-6 days  
**Risk Level**: MEDIUM  
**Dependencies**: Phases 1-3 complete

### Objectives
1. Establish feature module boundaries
2. Create architectural documentation
3. Implement feature flags system
4. Add E2E testing framework
5. Create component library documentation
6. Establish coding standards

### Key Initiatives

#### 4.1 Feature Module Boundaries
**Goal**: Each feature is self-contained and portable

**Standard Feature Structure**:
```
src/features/<feature>/
  ├── index.ts                 ← Public API (exports only)
  ├── pages/
  │   └── <Feature>Page.tsx    ← Platform switcher only
  ├── desktop/
  │   ├── <Feature>.tsx        ← Desktop implementation
  │   └── components/          ← Desktop-specific components
  ├── mobile/
  │   ├── <Feature>.tsx        ← Mobile implementation
  │   └── components/          ← Mobile-specific components
  ├── components/              ← Shared feature components
  │   └── <Feature>Base.tsx    ← Platform-agnostic logic
  ├── hooks/                   ← Feature-specific hooks
  │   └── use<Feature>Data.ts
  ├── types/                   ← Feature-specific types
  │   └── <feature>.types.ts
  ├── data/                    ← Static data/constants
  │   └── <feature>.data.ts
  └── README.md                ← Feature documentation
```

#### 4.2 Create Documentation Structure
**New Files**:
```
docs/
  ├── architecture/
  │   ├── 01-overview.md
  │   ├── 02-bifurcated-pattern.md
  │   ├── 03-feature-modules.md
  │   └── 04-state-management.md
  ├── features/
  │   ├── home.md
  │   ├── produtos.md
  │   ├── reveillon.md
  │   └── orcamento-iate.md
  ├── guides/
  │   ├── adding-new-feature.md
  │   ├── adding-new-page.md
  │   └── testing-strategy.md
  └── decisions/
      ├── 001-bifurcated-architecture.md
      └── 002-platform-switch-pattern.md
```

#### 4.3 E2E Testing Framework
**Install**: Playwright
```bash
npm install --save-dev @playwright/test
npx playwright install
```

**Critical Flows to Test**:
1. Homepage load and navigation
2. Produtos page load and filtering
3. Reveillon page load and timeline interaction
4. Orcamento-iate form submission
5. Platform switching (desktop ↔ mobile)
6. Analytics tracking (UTM parameters)
7. Contact form workflows

### Success Metrics
- [ ] All 4 features follow standard structure
- [ ] 12+ documentation files created
- [ ] E2E tests cover 5+ critical user flows
- [ ] Component library documented (45 components)
- [ ] CONTRIBUTING.md guide created
- [ ] ESLint + Prettier configured

---

## PHASE 5: TESTING - Comprehensive Test Coverage
**Branch**: `feat/comprehensive-testing`  
**Duration**: 6-8 days  
**Risk Level**: LOW (additive only)  
**Dependencies**: Phase 4 complete

### Objectives
1. Increase test coverage from 4.6% to 70%+
2. Add unit tests for business logic
3. Add integration tests for features
4. Add component tests for UI library
5. Establish testing culture

### Priority Areas

#### 5.1 Unit Test Critical Business Logic
**Priority 1: State Management**
- Expand appStore.test.ts
- Test attribution tracking, modal management, GDPR consent

**Priority 2: Hooks**
- Test all 6+ hooks in `/home/cunha/m5max/src/shared/hooks/`
- Create new test files for untested hooks

**Priority 3: Utilities**
- Test utm.ts, whatsapp.ts, gtm.ts

#### 5.2 Component Tests
**Goal**: Test all 45 UI components

**Priority Components** (test first):
1. Button, Card, Dialog - Most used
2. Form components - Critical for business
3. Navigation components - User journey critical

#### 5.3 Integration Tests
**Create for All 4 Features**:
- home.integration.test.tsx
- produtos.integration.test.tsx
- reveillon.integration.test.tsx
- orcamento-iate.integration.test.tsx

### Success Metrics
- [ ] Test coverage 70%+ overall
- [ ] Business logic 90%+ coverage
- [ ] All 45 UI components have basic tests
- [ ] All 4 features have integration tests
- [ ] CI/CD runs tests automatically

---

## IMPLEMENTATION ROADMAP

### Timeline
**Total Duration**: 10-12 weeks (2.5-3 months)

- **Week 1-2**: Phase 1 - Structure
- **Week 3-4**: Phase 2 - Deduplication
- **Week 5-6**: Phase 3 - Performance
- **Week 7-8**: Phase 4 - Scalability
- **Week 9-10**: Phase 5 - Testing

---

## GIT BRANCH STRATEGY

### Branch Naming
```
feat/optimize-structure           ← Phase 1
feat/deduplicate-code             ← Phase 2
feat/optimize-performance         ← Phase 3
feat/scalable-architecture        ← Phase 4
feat/comprehensive-testing        ← Phase 5
```

### Workflow Per Phase
1. Create branch from main
2. Implement changes with frequent commits
3. Test locally: `npm run lint && npm run build && npm run test`
4. Push and create PR
5. Code review (1+ approval)
6. Merge to main
7. Deploy and monitor

### Commit Message Convention
```
<type>(<scope>): <subject>

Types: feat, fix, refactor, test, docs, chore

Example:
feat(structure): standardize ReveillonPage to use PlatformSwitch
refactor(layout): extract Services component shared logic
test(hooks): add comprehensive tests for useAnalytics
```

---

## RISK MITIGATION

### High-Risk Areas

**1. Layout Component Refactor (Phase 2)**
- **Risk**: Breaking visual design
- **Mitigation**: Visual regression testing, feature flags, staged rollout

**2. Bundle Optimization (Phase 3)**
- **Risk**: Breaking lazy loading
- **Mitigation**: Testing on slow connections, monitoring, rollback plan

**3. Breaking Changes**
- **Risk**: Introducing bugs during refactor
- **Mitigation**: Comprehensive tests, small PRs, feature flags

### Rollback Procedures
```bash
# Immediate rollback
git revert <commit-hash>
git push origin main

# Feature flag rollback (no deployment needed)
# Disable in feature flag dashboard
```

---

## SUCCESS METRICS DASHBOARD

### Overall Targets
| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Code Lines | ~20,000 | ~14,000 | 30% reduction |
| Bundle Size (gzipped) | 55.71 kB | <40 kB | 28% reduction |
| Test Coverage | 4.6% | 70%+ | 15x increase |
| Lighthouse Score | ? | >90 | - |
| Pattern Consistency | 5 issues | 0 issues | 100% |

---

## CRITICAL FILES FOR IMPLEMENTATION

### Phase 1 - Most Critical Files:
1. **`/home/cunha/m5max/src/features/reveillon/pages/ReveillonPage.tsx`**  
   - Primary pattern inconsistency to fix
   - Currently uses useIsDesktop directly instead of PlatformSwitch

2. **`/home/cunha/m5max/src/shared/hooks/index.ts`**  
   - Missing hook exports to add
   - Central export point for all hooks

3. **`/home/cunha/m5max/src/features/home/desktop/Home.tsx`**  
   - Contains @features import alias misuse (line 5)
   - Pattern to replicate across other features

4. **`/home/cunha/m5max/src/features/produtos/index.ts`**  
   - Minimal exports (1 line) - needs standardization
   - Template for other feature index files

5. **`/home/cunha/m5max/src/features/reveillon/desktop/Reveillon.tsx`**  
   - Multiple @features import alias violations
   - Business logic to preserve during refactor

---

**Plan Status**: Ready for Implementation  
**Next Step**: Review with team, then create `feat/optimize-structure` branch
