# M5Max Codebase Cleanup Strategy
## Phased Implementation Plan

**Analysis Date:** 2025-12-05  
**Total Estimated Impact:** ~22KB bundle reduction, 109MB repository size reduction, improved maintainability

---

## Executive Summary

This cleanup addresses 9 critical categories of technical debt:
- **Critical bugs:** Duplicate hook definition causing potential runtime conflicts
- **Security risks:** 109MB git-tracked cache, dangerous migration code in production
- **Code pollution:** 63+ console statements in production code
- **Dead code:** 6 unused dependencies, 8 broken imports, duplicate PDF file
- **Maintainability:** 3 files >540 lines, unclear separation of concerns

**Total Files to Modify:** 18 files
**Files to Delete:** 9+ files/directories
**Estimated Implementation Time:** 4-6 hours

---

## Phase 1: Critical Fixes (PRIORITY: URGENT)
### Risk Level: HIGH | Impact: HIGH | Time: 1 hour

These issues could cause runtime errors, security problems, or repository bloat.

### 1.1 Remove Duplicate useIsDesktop Hook Definition ⚠️ CRITICAL
**Problem:** `useIsDesktop` defined in TWO locations causes import ambiguity
- Primary: `/home/cunha/m5max/src/shared/hooks/useIsDesktop.ts` (full implementation with SSR support)
- Duplicate: `/home/cunha/m5max/src/shared/hooks/useMedia.ts:32` (alias wrapper)

**Current Usage Analysis:**
All imports currently use the primary version via `@/shared/hooks/useIsDesktop` or the index export.

**Solution:**
1. **Keep:** `/home/cunha/m5max/src/shared/hooks/useIsDesktop.ts` (primary implementation)
2. **Remove line 32 from:** `/home/cunha/m5max/src/shared/hooks/useMedia.ts`
   ```typescript
   // DELETE THIS LINE:
   export const useIsDesktop = () => useMedia('(min-width: 1024px)');
   ```

**Files to verify after change:**
- `/home/cunha/m5max/src/shared/hooks/index.ts` - Should only export from useIsDesktop.ts
- `/home/cunha/m5max/src/shared/layout/switchers/PlatformSwitch.tsx`
- `/home/cunha/m5max/src/shared/hooks/usePlatformDetection.ts`

**Verification:**
```bash
npm run build
npm run lint
npm run test
```

**Expected Benefit:** Eliminates import confusion, prevents future bugs

---

### 1.2 Remove Git-Tracked .npm-cache Directory (109MB!)
**Problem:** npm cache tracked in git, causing repository bloat

**Current State:**
```bash
$ du -sh /home/cunha/m5max/.npm-cache
109M    /home/cunha/m5max/.npm-cache

$ git status --porcelain .npm-cache | wc -l
200+ modified files
```

**Solution:**

**Step 1:** Add to `.gitignore`
File: `/home/cunha/m5max/.gitignore`
```gitignore
# Add after line 8:
.npm-cache/
```

**Step 2:** Remove from git tracking (preserve local files)
```bash
git rm -r --cached .npm-cache
git commit -m "chore: remove npm cache from git tracking (109MB cleanup)"
```

**Step 3:** Verify gitignore
```bash
echo "test" > .npm-cache/test-file
git status  # Should NOT show .npm-cache
rm .npm-cache/test-file
```

**Expected Benefit:** 109MB reduction in repository size, faster clones/pulls

---

### 1.3 Remove Production Migration Code (SECURITY RISK)
**Problem:** `/home/cunha/m5max/src/shared/lib/dataMigration.ts` contains dangerous `resetProductTables()` function (line 299)

**Analysis:**
- 346 lines of migration code
- 12 console.log statements
- Contains destructive `resetProductTables()` that can delete all products
- Should NOT be in production bundle

**Solution:**

**Option A (Recommended): Move to dev-only scripts**
```bash
# Create migration scripts directory
mkdir -p /home/cunha/m5max/scripts/migrations

# Move file
mv /home/cunha/m5max/src/shared/lib/dataMigration.ts \
   /home/cunha/m5max/scripts/migrations/dataMigration.ts
```

Update imports in the moved file:
```typescript
// Change imports from '@/...' to relative paths
import { supabase } from '../../src/shared/lib/supabase';
import { produtosKits } from '../../src/features/produtos/data/produtos';
```

**Option B (Alternative): Feature flag protection**
If migrations need to remain accessible in production:
```typescript
// Wrap dangerous functions
export const resetProductTables = async () => {
  if (import.meta.env.PROD) {
    throw new Error('resetProductTables disabled in production');
  }
  // ... existing code
};
```

**Files to check for imports:**
```bash
grep -r "dataMigration" /home/cunha/m5max/src --include="*.ts" --include="*.tsx"
```

**Expected Benefit:** Eliminates security risk, removes 346 lines from production bundle

---

### 1.4 Remove Duplicate PDF File
**Problem:** Identical 250KB PDF in two locations
- `/home/cunha/m5max/public/orcamento-iate-2026.pdf`
- `/home/cunha/m5max/docs/Orçamento-IateClubedeBrasília-Réveillon26.pdf`

**Solution:**
```bash
# Keep public version (used by frontend)
# Delete docs version
rm /home/cunha/m5max/docs/Orçamento-IateClubedeBrasília-Réveillon26.pdf
```

**Verification:**
Check for hardcoded references:
```bash
grep -r "Orçamento-IateClubedeBrasília" /home/cunha/m5max/src
```

**Expected Benefit:** 250KB repository size reduction

---

### 1.5 Fix Broken Imports in lazy-ui.tsx
**Problem:** 8 components referenced but files don't exist

**File:** `/home/cunha/m5max/src/shared/ui/lazy-ui.tsx`

**Broken imports (lines 5-6, 20-21, 53-54, 60-62, 64-65):**
```typescript
// Lines 5-6: Files don't exist
const LazyVideoPlayer = lazy(() => import('./video-player-optimized'));
const LazyVideoPlayerMobile = lazy(() => import('./video-player-mobile'));

// Lines 20-21: Using non-existent imports
export const VideoPlayer = withLazyLoading(LazyVideoPlayer, 'lg');
export const VideoPlayerMobile = withLazyLoading(LazyVideoPlayerMobile, 'lg');

// Lines 53-65: Files don't exist  
export { default as Calendar } from './calendar';
export { default as Command } from './command';
export { default as Table } from './table';
export { default as Breadcrumb } from './breadcrumb';
export { default as Drawer } from './drawer';
export { default as Resizable } from './resizable';
export { default as Sidebar } from './sidebar';
```

**Solution:**

**Remove lines 5-6** (video-player-optimized doesn't exist):
```typescript
// DELETE THESE:
const LazyVideoPlayer = lazy(() => import('./video-player-optimized'));
const LazyVideoPlayerMobile = lazy(() => import('./video-player-mobile'));
```

**Remove lines 20-21**:
```typescript
// DELETE THESE:
export const VideoPlayer = withLazyLoading(LazyVideoPlayer, 'lg');
export const VideoPlayerMobile = withLazyLoading(LazyVideoPlayerMobile, 'lg');
```

**Remove lines 53-54, 60-62, 64-65** (non-existent components):
```typescript
// DELETE THESE:
export { default as Calendar } from './calendar';
export { default as Command } from './command';
export { default as Table } from './table';
export { default as Breadcrumb } from './breadcrumb';
export { default as Drawer } from './drawer';
export { default as Resizable } from './resizable';
export { default as Sidebar } from './sidebar';
```

**Verification:**
```bash
npm run build  # Should succeed without module resolution errors
npm run lint
```

**Expected Benefit:** Eliminates build warnings, prevents runtime errors

---

## Phase 2: Performance & Cleanup
### Risk Level: LOW | Impact: MEDIUM | Time: 1.5 hours

### 2.1 Remove Console Statements (63+ occurrences)

**Strategy:** Remove all console statements EXCEPT error logging in catch blocks

**Files to Clean (by priority):**

**2.1.1 Service Worker** (`/home/cunha/m5max/src/shared/utils/service-worker.ts`)
- 13 console statements
- **Keep:** Error logs in catch blocks (console.error)
- **Remove:** All debug/info logs (console.log)

**2.1.2 Supabase Client** (`/home/cunha/m5max/src/shared/lib/supabase.ts`)
- 7 console statements
- **Remove all:** Debug/info logs
- **Strategy:** Supabase errors should be handled by calling code

**2.1.3 useSupabaseProducts Hook** (`/home/cunha/m5max/src/shared/hooks/useSupabaseProducts.ts`)
- 13 console statements
- **Remove all except:** Error logging in catch blocks (console.error)
- **Convert:** console.warn to proper error handling

**2.1.4 Main Entry** (`/home/cunha/m5max/src/main.tsx`)
- 3 console statements (lines 13, 16, 20)
- **Remove:** Service Worker registration logs

**2.1.5 Analytics Hook** (`/home/cunha/m5max/src/shared/hooks/useAnalytics.ts`)
- 2 console statements
- **Strategy:** Silent operation, errors handled by analytics platform

**2.1.6 Migration File** (`/home/cunha/m5max/src/shared/lib/dataMigration.ts`)
- 12 console statements
- **Note:** This file will be moved to scripts/ in Phase 1.3, so console.log is acceptable there

**2.1.7 Other Files** (9 more files with 1-4 console statements each)
- `/home/cunha/m5max/src/app/router/NotFound.tsx`: 1
- `/home/cunha/m5max/src/app/providers/analytics/ConsentBanner.tsx`: 1
- `/home/cunha/m5max/src/shared/hooks/useWebVitals.ts`: 4
- `/home/cunha/m5max/src/shared/modal/FormModalContent.tsx`: 1
- `/home/cunha/m5max/src/features/orcamento-iate/components/BudgetTriage.tsx`: 1
- `/home/cunha/m5max/src/shared/ui/video-player.tsx`: 3
- `/home/cunha/m5max/src/shared/store/appStore.ts`: 1

**Implementation Pattern:**
```typescript
// BEFORE:
console.log('Loading products...', filters);
const { data, error } = await supabase.from('products').select();
console.log('Loaded:', data);

// AFTER:
const { data, error } = await supabase.from('products').select();
// Silent success, only log errors
if (error) {
  console.error('Failed to load products:', error);
  // Handle error appropriately
}
```

**Verification Strategy:**
```bash
# Ensure NO console.log/warn/debug remain
grep -r "console\.(log|warn|debug)" /home/cunha/m5max/src --include="*.ts" --include="*.tsx"

# console.error is OK for error handling
grep -r "console\.error" /home/cunha/m5max/src --include="*.ts" --include="*.tsx"
```

**Expected Benefit:** Cleaner production console, ~2-3KB bundle reduction

---

### 2.2 Remove Unused Dependencies

**Analysis:** 6 packages installed but never imported in `src/`

**Dependencies to Remove:**

1. **recharts** (^2.15.4) - Charting library (~50KB)
   - Not found in any source files
   ```bash
   npm uninstall recharts
   ```

2. **embla-carousel-react** (^8.6.0) - Carousel component
   - Not found in any source files
   ```bash
   npm uninstall embla-carousel-react
   ```

3. **cmdk** (^1.1.1) - Command menu component
   - Not found in any source files
   ```bash
   npm uninstall cmdk
   ```

4. **react-resizable-panels** (^2.1.9) - Resizable panels
   - Not found in any source files
   ```bash
   npm uninstall react-resizable-panels
   ```

5. **gtag** (^1.0.1) - Google Analytics wrapper
   - Found in analytics files but NOT imported
   - Using GTM directly instead
   ```bash
   npm uninstall gtag
   ```

6. **caniuse-lite** (^1.0.30001757) - Autoprefixer data
   - Auto-installed by autoprefixer, but listed as direct dependency
   - Remove from dependencies (autoprefixer will handle it)
   ```bash
   npm uninstall caniuse-lite
   # It will be reinstalled by autoprefixer automatically
   ```

**Batch Removal Command:**
```bash
npm uninstall recharts embla-carousel-react cmdk react-resizable-panels gtag caniuse-lite
```

**Verification:**
```bash
npm run build
npm run test
# Ensure no build errors
```

**Expected Benefit:** 
- ~15KB bundle size reduction (estimated)
- Cleaner dependency tree
- Faster npm install times

---

### 2.3 Audit Unused Radix UI Components (Investigation Phase)

**Problem:** Multiple @radix-ui packages installed, unclear if all are used

**Investigation Required:**
File: `/home/cunha/m5max/package.json` shows 23 @radix-ui packages

**Verification Script:**
```bash
# For each Radix package, check usage
for pkg in accordion alert-dialog aspect-ratio avatar checkbox collapsible \
           context-menu dialog dropdown-menu hover-card label menubar \
           navigation-menu popover progress radio-group scroll-area select \
           separator slider slot switch tabs toast toggle toggle-group tooltip; do
  echo "=== Checking @radix-ui/react-$pkg ==="
  grep -r "@radix-ui/react-$pkg" /home/cunha/m5max/src --include="*.ts" --include="*.tsx" | wc -l
done
```

**Components likely unused** (based on broken imports in lazy-ui.tsx):
Since calendar, command, table, breadcrumb, drawer, resizable, sidebar don't exist as UI component files, any corresponding @radix-ui packages are likely unused.

**Note:** @radix-ui/react-slot is a utility package used by other Radix components, so it should be kept even if not directly imported.

**Action:** Run verification script first, document results, then remove unused packages in a separate commit

**Expected Benefit:** Additional 5-10KB bundle reduction per unused package

---

## Phase 3: Refactoring (Code Quality)
### Risk Level: MEDIUM | Impact: MEDIUM | Time: 2-3 hours

### 3.1 Split ProductModal.tsx (705 lines)

**File:** `/home/cunha/m5max/src/features/produtos/desktop/components/ProductModal.tsx`

**Current Issues:**
- 705 lines in single file
- Mixes presentation, business logic, and state management
- Hard to test individual components

**Recommended Structure:**
```
/home/cunha/m5max/src/features/produtos/desktop/components/ProductModal/
├── index.tsx                     (100 lines - main orchestrator)
├── ProductModalHeader.tsx        (80 lines - header section)
├── ProductModalDetails.tsx       (150 lines - product details)
├── ProductModalComponents.tsx    (120 lines - component list)
├── ProductModalPricing.tsx       (100 lines - pricing/CTA)
├── ProductModalGallery.tsx       (80 lines - image gallery if present)
└── hooks/
    ├── useProductModalState.ts   (60 lines - modal state logic)
    └── useProductAnalytics.ts    (40 lines - analytics tracking)
```

**Implementation Strategy:**

**Step 1:** Extract hooks first (safest refactor)
```typescript
// Create: hooks/useProductModalState.ts
export const useProductModalState = (product, isOpen) => {
  // Move useState calls here
  // Move useEffect calls here
  // Return state and handlers
};
```

**Step 2:** Extract sub-components (bottom-up)
Start from leaf components first:
1. ProductModalPricing (most isolated)
2. ProductModalComponents
3. ProductModalDetails
4. ProductModalHeader
5. ProductModalGallery (if exists)

**Step 3:** Refactor main component
Keep only:
- Modal shell (Dialog wrapper)
- Sub-component composition
- Props passing

**Verification:**
```bash
npm run test -- ProductModal
npm run build
# Visual regression testing recommended
```

**Expected Benefit:** 
- Easier maintenance
- Better testability
- Improved code organization
- Enables parallel development

---

### 3.2 Split leadScoring.ts (543 lines)

**File:** `/home/cunha/m5max/src/shared/lib/leadScoring.ts`

**Current Structure:**
- Multiple scoring algorithms
- E-commerce specific logic
- B2B vs B2C scoring
- Recommendation engine

**Recommended Structure:**
```
/home/cunha/m5max/src/shared/lib/leadScoring/
├── index.ts                    (30 lines - public exports)
├── types.ts                    (60 lines - shared types)
├── b2bScoring.ts               (120 lines - B2B logic)
├── b2cScoring.ts               (120 lines - B2C logic)  
├── ecommerceScoring.ts         (150 lines - e-commerce logic)
├── recommendations.ts          (80 lines - recommendation engine)
└── utils.ts                    (40 lines - shared utilities)
```

**Benefits:**
- Clearer separation of concerns
- Easier to test individual scoring algorithms
- Can modify B2B without affecting B2C
- Better code discovery

**Implementation:**
1. Create leadScoring directory
2. Extract types first (safest)
3. Extract utility functions
4. Split scoring functions by category
5. Update index.ts to re-export public API
6. Update imports throughout codebase

---

### 3.3 Split useAnalytics.ts (584 lines)

**File:** `/home/cunha/m5max/src/shared/hooks/useAnalytics.ts`

**Current Issues:**
- 584 lines mixing multiple analytics platforms
- GTM, GA4, Meta Pixel all in one hook
- Hard to test individual tracking methods
- Changes to one platform affect others

**Recommended Structure:**
```
/home/cunha/m5max/src/shared/hooks/analytics/
├── index.ts                      (40 lines - main export)
├── useAnalytics.ts               (100 lines - orchestrator hook)
├── useGTM.ts                     (120 lines - GTM specific)
├── useGA4.ts                     (120 lines - GA4 specific)
├── useMetaPixel.ts               (120 lines - Meta specific)
├── types.ts                      (50 lines - shared types)
└── utils/
    ├── eventNormalization.ts     (60 lines)
    └── consentManagement.ts      (40 lines)
```

**Implementation Note:** This is lower priority as analytics code works well currently. Consider deferring to Phase 4.

**Benefits:**
- Platform-specific changes isolated
- Easier to add new platforms
- Better testability
- Clearer responsibilities

---

### 3.4 Split FormModalContent.tsx (545 lines)

**File:** `/home/cunha/m5max/src/shared/modal/FormModalContent.tsx`

**Current Issues:**
- 545 lines in single component
- Handles both B2B and B2C forms
- Mixes form logic with presentation

**Recommended Structure:**
```
/home/cunha/m5max/src/shared/modal/FormModalContent/
├── index.tsx                     (80 lines - orchestrator)
├── B2BFormFields.tsx             (180 lines - B2B specific)
├── B2CFormFields.tsx             (180 lines - B2C specific)
├── FormSuccessView.tsx           (60 lines - success state)
└── hooks/
    └── useFormSubmission.ts      (80 lines - submission logic)
```

**Benefits:**
- Easier to modify B2B vs B2C forms independently
- Clearer form structure
- Better testability
- Reduced cognitive load

---

## Phase 4: Optional Improvements
### Risk Level: LOW | Impact: LOW | Time: 1 hour

### 4.1 Create Console Removal Build Plugin

For automatic console.log removal in production builds:

**File:** `/home/cunha/m5max/vite.config.ts`
```typescript
// Add to plugins array
{
  name: 'remove-console',
  transform(code, id) {
    if (import.meta.env.PROD && /\.(tsx?|jsx?)$/.test(id)) {
      // Remove console.log, console.debug, console.info
      // Keep console.error and console.warn for error tracking
      return code.replace(/console\.(log|debug|info)\([^)]*\);?/g, '');
    }
  }
}
```

**Benefit:** Prevents future console pollution even if developers forget to remove logs

---

### 4.2 Add Bundle Size Monitoring

**File:** `/home/cunha/m5max/package.json`
```json
{
  "scripts": {
    "build:analyze": "vite build && vite-bundle-visualizer"
  }
}
```

Install dependency:
```bash
npm install --save-dev rollup-plugin-visualizer
```

Update vite.config.ts:
```typescript
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    // ... existing plugins
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ]
});
```

**Benefit:** Visualize bundle composition and identify optimization opportunities

---

### 4.3 Enforce Code Quality Rules

**File:** `/home/cunha/m5max/eslint.config.js`

Add rules to prevent future issues:
```javascript
{
  rules: {
    // Prevent console statements (allow error/warn for debugging)
    'no-console': ['error', { allow: ['error', 'warn'] }],
    
    // Warn on overly complex functions
    'max-lines-per-function': ['warn', { max: 150 }],
    
    // Warn on large files
    'max-lines': ['warn', { max: 400, skipBlankLines: true, skipComments: true }],
    
    // Encourage smaller components
    'complexity': ['warn', 15]
  }
}
```

**Benefit:** Prevents code quality regression

---

## Implementation Sequencing

### Week 1: Critical Fixes
**Day 1 (2 hours):**
- [ ] Phase 1.1: Remove duplicate useIsDesktop (1 line change)
- [ ] Phase 1.5: Fix broken imports in lazy-ui.tsx (remove 10 lines)
- [ ] Build and test to verify no errors

**Day 2 (2 hours):**
- [ ] Phase 1.2: Remove .npm-cache from git tracking
  - Add to .gitignore
  - Run git rm -r --cached
  - Commit with proper message
- [ ] Phase 1.4: Remove duplicate PDF file

**Day 3 (2 hours):**
- [ ] Phase 1.3: Move dataMigration.ts to scripts/
- [ ] Verify no production imports
- [ ] Update any dev tooling that uses it

### Week 2: Performance Cleanup
**Day 1 (3 hours):**
- [ ] Phase 2.1: Remove console statements from all 13 files
  - Service Worker (13 statements)
  - useSupabaseProducts (13 statements)
  - Supabase client (7 statements)
  - Main.tsx (3 statements)
  - Other files (27 statements)
- [ ] Build and verify clean console

**Day 2 (1 hour):**
- [ ] Phase 2.2: Remove 6 unused dependencies
  - Run batch uninstall command
  - Test build thoroughly
  - Verify bundle size reduction

**Day 3 (2 hours):**
- [ ] Phase 2.3: Audit and remove unused Radix UI
  - Run verification script
  - Document actively used components
  - Remove unused packages
  - Test build

### Week 3: Refactoring (Optional - Only if time allows)
**Only proceed if:**
- Team agrees on priority
- No active feature work conflicts
- Time budget allows

**Day 1-2 (6 hours):**
- [ ] Phase 3.1: Split ProductModal.tsx
- [ ] Phase 3.2: Split leadScoring.ts

**Day 3 (4 hours):**
- [ ] Phase 3.4: Split FormModalContent.tsx
- [ ] Defer Phase 3.3 (useAnalytics) - works well as-is

**Week 4: Optional Improvements (1 hour)**
- [ ] Phase 4.1: Console removal plugin
- [ ] Phase 4.2: Bundle analyzer
- [ ] Phase 4.3: ESLint rules

---

## Verification Checklist

After each phase, run:

```bash
# 1. TypeScript compilation (strict mode)
npx tsc --noEmit

# 2. Linting
npm run lint

# 3. Unit tests
npm run test

# 4. Build succeeds
npm run build

# 5. Bundle size check
ls -lh dist/assets/*.js
# Compare with baseline: build-before.txt

# 6. Manual smoke testing
npm run preview
```

**Critical user flows to test:**
- [ ] Homepage loads correctly
- [ ] Product modal opens and displays products
- [ ] Form submission works (both B2B and B2C)
- [ ] Analytics tracking fires correctly
- [ ] Service worker registers (production only)
- [ ] Responsive design works at 1024px breakpoint

---

## Expected Outcomes

### Bundle Size Impact:
| Phase | Reduction | Notes |
|-------|-----------|-------|
| 1.3 Migration code | ~5KB gzipped | 346 lines removed from bundle |
| 1.5 Fix broken imports | ~1KB | Removes dead code references |
| 2.1 Console statements | ~2-3KB | 63 console calls removed |
| 2.2 Unused dependencies | ~15KB | recharts, cmdk, embla, etc. |
| 2.3 Unused Radix UI | ~5-10KB | Per unused package |
| **TOTAL** | **~28-33KB** | ~4-5% bundle size improvement |

### Repository Size Impact:
| Item | Size Reduction | Impact |
|------|----------------|--------|
| .npm-cache removal | -109MB | Faster git operations |
| Duplicate PDF | -250KB | Cleaner repo structure |
| **TOTAL** | **~109MB** | Significantly faster clones |

### Code Quality Impact:
- ✅ Eliminates duplicate hook definition (prevents bugs)
- ✅ Removes 63+ console pollution points (cleaner production)
- ✅ Fixes 8 broken import statements (eliminates warnings)
- ✅ Removes dangerous production deletion function (security)
- ✅ Cleans dependency tree (6 packages removed)
- ✅ Improves maintainability (splits 3 large files if Phase 3 completed)

### Performance Impact:
- Faster parse/compile time (less code to process)
- Smaller bundle = faster download and parse
- Cleaner dependency tree = faster npm install
- Better tree-shaking opportunities

---

## Risk Mitigation

### Before Starting:
1. **Create feature branch:** 
   ```bash
   git checkout -b cleanup/phase-1-critical-fixes
   ```

2. **Backup current state:**
   ```bash
   git tag pre-cleanup-backup
   ```

3. **Document current build:**
   ```bash
   npm run build
   ls -lh dist/assets/ > build-before.txt
   cat build-before.txt
   ```

### During Implementation:

1. **One phase at a time** - Complete, test, commit before moving to next phase

2. **Commit messages** - Use conventional commits format:
   ```
   chore: remove duplicate useIsDesktop definition
   
   - Removes duplicate export from useMedia.ts (line 32)
   - Keeps primary implementation in useIsDesktop.ts
   - Prevents import confusion and potential bugs
   
   Refs: CLEANUP_STRATEGY.md Phase 1.1
   ```

3. **Test between commits:**
   ```bash
   npm run build && npm run test && npm run lint
   ```

### Rollback Strategy:

If something breaks:
```bash
# Option 1: Full rollback
git reset --hard pre-cleanup-backup

# Option 2: Revert specific commit
git log --oneline  # Find commit hash
git revert <commit-hash>

# Option 3: Rollback to specific phase
git reset --hard <commit-before-phase>
```

### Communication:

Before starting Phase 3 (refactoring):
1. Notify team of upcoming refactoring work
2. Coordinate with anyone working on affected files
3. Consider creating separate branch per file split
4. Ensure CI/CD passes before merging

---

## Critical Files for Implementation

### Phase 1 (Critical Fixes - MUST DO):
1. `/home/cunha/m5max/src/shared/hooks/useMedia.ts` - Remove duplicate useIsDesktop export (line 32)
2. `/home/cunha/m5max/src/shared/ui/lazy-ui.tsx` - Fix 8 broken component imports (lines 5-6, 20-21, 53-65)
3. `/home/cunha/m5max/.gitignore` - Add .npm-cache/ entry
4. `/home/cunha/m5max/src/shared/lib/dataMigration.ts` - Move to scripts/migrations/ directory
5. Delete: `/home/cunha/m5max/docs/Orçamento-IateClubedeBrasília-Réveillon26.pdf`

### Phase 2 (Performance - HIGH PRIORITY):
1. `/home/cunha/m5max/src/shared/utils/service-worker.ts` - Remove debug console logs (13 occurrences)
2. `/home/cunha/m5max/src/shared/hooks/useSupabaseProducts.ts` - Clean console statements (13 occurrences)
3. `/home/cunha/m5max/src/shared/lib/supabase.ts` - Remove debug logs (7 occurrences)
4. `/home/cunha/m5max/src/main.tsx` - Clean service worker registration logs (3 occurrences)
5. `/home/cunha/m5max/package.json` - Remove 6 unused dependencies
6. `/home/cunha/m5max/src/shared/hooks/useAnalytics.ts` - Remove 2 console statements
7. `/home/cunha/m5max/src/app/router/NotFound.tsx` - Remove 1 console statement
8. `/home/cunha/m5max/src/app/providers/analytics/ConsentBanner.tsx` - Remove 1 console statement
9. `/home/cunha/m5max/src/shared/hooks/useWebVitals.ts` - Remove 4 console statements
10. `/home/cunha/m5max/src/shared/modal/FormModalContent.tsx` - Remove 1 console statement
11. `/home/cunha/m5max/src/features/orcamento-iate/components/BudgetTriage.tsx` - Remove 1 console statement
12. `/home/cunha/m5max/src/shared/ui/video-player.tsx` - Remove 3 console statements
13. `/home/cunha/m5max/src/shared/store/appStore.ts` - Remove 1 console statement

### Phase 3 (Refactoring - OPTIONAL):
1. `/home/cunha/m5max/src/features/produtos/desktop/components/ProductModal.tsx` - Split into 6+ sub-components (705 lines)
2. `/home/cunha/m5max/src/shared/lib/leadScoring.ts` - Split by scoring type into 7 files (543 lines)
3. `/home/cunha/m5max/src/shared/hooks/useAnalytics.ts` - Separate by analytics platform into 7 files (584 lines)
4. `/home/cunha/m5max/src/shared/modal/FormModalContent.tsx` - Split into 5 files (545 lines)

---

## Questions for Implementation Team

Before proceeding, please clarify:

1. **Migration code (Phase 1.3):**
   - Is `dataMigration.ts` still actively used?
   - Can it be safely moved to scripts/ directory?
   - Or should we add production guard instead?

2. **Console removal (Phase 2.1):**
   - Should we keep ANY console.log in production?
   - Or remove all non-error logging?

3. **Refactoring priority (Phase 3):**
   - Is there active feature work on ProductModal, FormModalContent, or analytics?
   - Which refactoring (if any) should be prioritized?
   - Can we defer to future sprint?

4. **Testing coverage:**
   - Should we add tests BEFORE splitting large components?
   - Or split first, then add tests?

5. **Timeline:**
   - Can we allocate 2-3 days for Phase 1 + Phase 2?
   - Is Phase 3 (refactoring) required or optional?

---

## Additional Notes

### Performance Testing Recommended:

After cleanup, run Lighthouse audit:
```bash
npm run build
npm run preview
# Open Chrome DevTools > Lighthouse
# Run audit in production mode
```

Compare metrics:
- Bundle size (Before vs After)
- Parse/compile time
- Time to Interactive (TTI)
- First Contentful Paint (FCP)

**Expected improvements:**
- 4-5% smaller bundle size
- Faster parse time (~10-20ms)
- No regression in user-facing metrics

### Documentation Updates Needed:

After completing phases:
1. **CLAUDE.md** - Update with:
   - New file locations (if Phase 3 completed)
   - Removed dependencies
   - Updated architecture notes

2. **README.md** - Document:
   - Cleanup improvements
   - New developer guidelines
   - Bundle size improvements

3. **Onboarding docs** - Update any references to:
   - Removed files
   - Changed file structures
   - New conventions

### Future Prevention:

Consider implementing:

1. **Pre-commit hooks** (via Husky):
   ```bash
   npm install --save-dev husky lint-staged
   ```
   Prevent console.log commits

2. **Bundle size budgets** (in CI/CD):
   ```json
   {
     "budgets": [
       {
         "type": "bundle",
         "maximumError": "300kb"
       }
     ]
   }
   ```

3. **Automated dependency auditing:**
   ```bash
   npm install --save-dev depcheck
   npx depcheck
   ```

4. **File size linting:**
   Add to ESLint config as shown in Phase 4.3

5. **Regular dependency pruning:**
   Schedule quarterly dependency audit

---

**End of Cleanup Strategy**

**Document Version:** 1.0  
**Created:** 2025-12-05  
**Last Updated:** 2025-12-05  
**Status:** Ready for Review → Implementation
