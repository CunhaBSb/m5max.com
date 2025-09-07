# TEST COVERAGE ANALYSIS - M5 MAX

> **Purpose**: Comprehensive analysis of current test coverage with prioritized gap analysis and improvement roadmap.

## CURRENT TEST INFRASTRUCTURE

### Testing Framework & Configuration

**Framework**: Vitest 3.2.4 (`package.json:93`)  
**Testing Library**: @testing-library/react 16.3.0 (`package.json:75`)  
**Environment**: jsdom 26.1.0 (`package.json:87`)  
**DOM Matchers**: @testing-library/jest-dom 6.8.0 (`package.json:74`)  
**User Events**: @testing-library/user-event 14.6.1 (`package.json:76`)

### Test Configuration (`vite.config.ts:58-63`)

```typescript
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: './src/setupTests.ts',
  css: true,
}
```

**Setup File**: `src/setupTests.ts:1-2`
```typescript
import '@testing-library/jest-dom';
```

### Test Commands (`package.json:12-13`)
- `npm run test` - Run tests with Vitest
- `npm run test:ui` - Run tests with Vitest UI interface

## CURRENT TEST COVERAGE

### Existing Test Files (3 total)

#### 1. UI Components (1/45 components)
**File**: `src/shared/ui/button.test.tsx:1-35`  
**Coverage**: Button component only (2% of UI components)  

**Test Cases**:
- Default props rendering
- Variant class application (`destructive`)
- Size class application (`lg`) 
- AsChild functionality with Slot component
- DOM structure validation

#### 2. Hooks (1/6+ hooks)
**File**: `src/shared/hooks/useIsDesktop.test.ts:1-81`  
**Coverage**: Platform detection hook only (17% of hooks)

**Test Cases**:
- Desktop viewport detection (≥1024px)
- Mobile viewport detection (<1024px)
- Responsive breakpoint changes
- matchMedia API mocking
- Event listener management

#### 3. Utilities (1/10+ utilities)
**File**: `src/shared/lib/utils.test.ts:1-28`  
**Coverage**: `cn` utility function only (10% of utilities)

**Test Cases**:
- Class merging with `clsx`
- Conditional classes handling
- Tailwind class conflict resolution
- Array input handling
- Empty input handling

## COMPREHENSIVE COVERAGE GAP ANALYSIS

### Total Codebase Statistics
- **Total Files**: 121 TypeScript/TSX files
- **Test Files**: 3 files
- **Coverage Percentage**: ~2.5% (3/121)
- **Directories**: 31 directories
- **Components**: 85 React components
- **Tested Components**: 1 component

### Critical Gaps by Category

#### 1. Feature Components (0% coverage)
**Gap**: No tests for any feature components  
**Impact**: High - Core business functionality untested

**Missing Tests**:
- `src/features/home/desktop/Home.tsx`
- `src/features/home/mobile/Home.tsx`
- `src/features/reveillon/desktop/Reveillon.tsx`
- `src/features/reveillon/mobile/Reveillon.tsx`
- `src/features/*/desktop/components/*.tsx` (8+ components)
- `src/features/*/mobile/components/*.tsx` (6+ components)

#### 2. Page Components (0% coverage)
**Gap**: No tests for page containers and routing  
**Impact**: High - User journey entry points untested

**Missing Tests**:
- `src/features/home/pages/HomePage.tsx`
- `src/features/reveillon/pages/ReveillonPage.tsx`
- `src/app/router/AppRoutes.tsx`
- `src/app/router/NotFound.tsx`

#### 3. State Management (0% coverage)
**Gap**: No tests for Zustand store or state actions  
**Impact**: Critical - Core state management untested

**Missing Tests**:
- `src/shared/store/appStore.ts`
- Attribution state management
- Consent state management
- Modal state management
- Action creators and reducers

#### 4. Form System (0% coverage)
**Gap**: No tests for form validation or schemas  
**Impact**: Critical - Lead generation system untested

**Missing Tests**:
- `src/shared/types/forms.ts` - Zod schema validation
- `src/shared/modal/QualificationForm.tsx` - Form container
- `src/shared/modal/B2BForm.tsx` - Form field components
- Lead scoring algorithm
- Form submission flow

#### 5. UI Component Library (2% coverage)
**Gap**: 44 of 45 UI components untested  
**Impact**: Medium - Design system reliability at risk

**Missing High-Priority Tests**:
- `src/shared/ui/form.tsx` - Form field components
- `src/shared/ui/dialog.tsx` - Modal dialogs
- `src/shared/ui/card.tsx` - Content containers
- `src/shared/ui/input.tsx` - Form inputs
- `src/shared/ui/select.tsx` - Form selects

#### 6. Hook Library (17% coverage)
**Gap**: 5 of 6 hooks untested  
**Impact**: High - Custom logic and integrations untested

**Missing Tests**:
- `src/shared/hooks/useAnalytics.ts` - Analytics integration
- `src/shared/hooks/useAttribution.ts` - UTM tracking
- `src/shared/hooks/useToast.ts` - Notification system
- `src/shared/hooks/useMedia.ts` - Media query utilities

#### 7. Utility Functions (10% coverage)
**Gap**: 90% of utility functions untested  
**Impact**: Medium - Helper functions may have edge cases

**Missing Tests**:
- `src/shared/lib/analytics.ts` - Analytics utilities
- `src/shared/lib/gtm.ts` - Google Tag Manager
- `src/shared/lib/utm.ts` - UTM parameter handling
- `src/shared/lib/whatsapp.ts` - WhatsApp integration
- `src/shared/lib/constants.ts` - Application constants

#### 8. Layout Components (0% coverage)
**Gap**: No tests for layout and navigation  
**Impact**: Medium - Layout consistency untested

**Missing Tests**:
- `src/shared/layout/Header.tsx`
- `src/shared/layout/Footer.tsx`
- `src/shared/layout/Services.tsx`
- `src/shared/layout/FAQ.tsx`
- `src/app/layouts/RootLayout.tsx`

#### 9. Modal System (0% coverage)
**Gap**: No tests for modal dialogs and forms  
**Impact**: High - Conversion system untested

**Missing Tests**:
- `src/shared/modal/ConversionModal.tsx`
- `src/shared/modal/ContactModal.tsx`
- Modal state management
- Form submission integration

#### 10. Analytics System (0% coverage)
**Gap**: No tests for tracking and consent management  
**Impact**: Medium - GDPR compliance and tracking untested

**Missing Tests**:
- `src/app/providers/analytics/AnalyticsProvider.tsx`
- `src/app/providers/analytics/ConsentBanner.tsx`
- Analytics event tracking
- Consent state management

## PRIORITY MATRIX

### Priority 1: Critical Business Logic (Immediate)

#### 1.1 Form System Testing
**Files**: 3 files  
**Effort**: 16-20 hours  
**Business Impact**: Critical - Lead generation

**Tests Needed**:
- Zod schema validation (`forms.ts`)
- Form field rendering (`B2BForm.tsx`)
- Form submission flow (`QualificationForm.tsx`)
- Lead scoring algorithm
- Error handling and validation messages

**Example Test Structure**:
```typescript
describe('B2BFormSchema', () => {
  it('should validate required fields');
  it('should reject invalid email formats');
  it('should validate enum values');
  it('should handle optional fields');
});

describe('QualificationForm', () => {
  it('should render all form fields');
  it('should submit with valid data');
  it('should show validation errors');
  it('should calculate lead scores correctly');
});
```

#### 1.2 State Management Testing  
**Files**: 1 file  
**Effort**: 8-12 hours  
**Business Impact**: Critical - Core state logic

**Tests Needed**:
- Store initialization
- Action creators
- State updates
- Persistence logic
- Selector behavior

**Example Test Structure**:
```typescript
describe('AppStore', () => {
  it('should initialize with default state');
  it('should update attribution data');
  it('should manage consent state');
  it('should handle modal state');
  it('should persist selected state');
});
```

### Priority 2: Core User Flows (Next Sprint)

#### 2.1 Page Component Testing
**Files**: 2 files  
**Effort**: 12-16 hours  
**Business Impact**: High - User journey entry points

**Tests Needed**:
- Page rendering
- Lazy loading behavior
- Platform detection integration
- Analytics tracking
- SEO metadata

#### 2.2 Feature Component Testing
**Files**: 4 main files  
**Effort**: 20-24 hours  
**Business Impact**: High - Core functionality

**Tests Needed**:
- Component rendering
- User interactions
- State integration
- Analytics events
- Responsive behavior

### Priority 3: Integration & Infrastructure (Following Sprint)

#### 3.1 Hook Testing
**Files**: 5 files  
**Effort**: 16-20 hours  
**Business Impact**: Medium - Custom logic reliability

#### 3.2 Modal System Testing  
**Files**: 2 files  
**Effort**: 12-16 hours  
**Business Impact**: Medium - User interaction flows

#### 3.3 Analytics Testing
**Files**: 2 files  
**Effort**: 16-20 hours  
**Business Impact**: Medium - Tracking and compliance

### Priority 4: UI Component Library (Ongoing)

#### 4.1 Core UI Components
**Files**: 10 high-use components  
**Effort**: 20-30 hours  
**Business Impact**: Low-Medium - Design system consistency

**Priority Components**:
- Form components (`form.tsx`, `input.tsx`, `select.tsx`)
- Layout components (`dialog.tsx`, `card.tsx`)
- Interactive components (`button.tsx` - already done)

## TESTING STRATEGY RECOMMENDATIONS

### 1. Test Organization Structure

```
src/
├── __tests__/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── store/
│   └── utils/
└── [existing structure]
```

### 2. Test File Naming Convention

```
// Component tests
ComponentName.test.tsx

// Hook tests  
useHookName.test.ts

// Utility tests
utilityName.test.ts

// Integration tests
featureName.integration.test.tsx
```

### 3. Testing Patterns

#### Component Testing Template
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ComponentName from './ComponentName';

describe('ComponentName', () => {
  beforeEach(() => {
    // Setup mocks
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render with default props', () => {
    render(<ComponentName />);
    expect(screen.getByRole('...')).toBeInTheDocument();
  });

  it('should handle user interactions', async () => {
    const mockHandler = vi.fn();
    render(<ComponentName onAction={mockHandler} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    await waitFor(() => {
      expect(mockHandler).toHaveBeenCalledWith(expectedArgs);
    });
  });

  it('should display error states correctly', () => {
    render(<ComponentName error="Test error" />);
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });
});
```

#### Hook Testing Template
```typescript
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useCustomHook } from './useCustomHook';

describe('useCustomHook', () => {
  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useCustomHook());
    expect(result.current.value).toBe(expectedDefault);
  });

  it('should update state on actions', () => {
    const { result } = renderHook(() => useCustomHook());
    
    act(() => {
      result.current.updateValue('new value');
    });
    
    expect(result.current.value).toBe('new value');
  });
});
```

#### Store Testing Template
```typescript
import { create } from 'zustand';
import { describe, it, expect } from 'vitest';

// Create test store without persistence
const createTestStore = (initialState) => {
  return create((set) => ({
    ...initialState,
    actions: {
      updateValue: (value) => set({ value }),
    }
  }));
};

describe('AppStore', () => {
  it('should handle state updates correctly', () => {
    const store = createTestStore({ value: 'initial' });
    
    store.getState().actions.updateValue('updated');
    
    expect(store.getState().value).toBe('updated');
  });
});
```

### 4. Mock Strategy

#### External Dependencies
```typescript
// Mock Zustand store
vi.mock('@/shared/store/appStore', () => ({
  useAppStore: vi.fn(() => ({
    // Mock store state
    conversionModalOpen: false,
    openConversionModal: vi.fn(),
    // ...
  }))
}));

// Mock analytics
vi.mock('@/shared/hooks/useAnalytics', () => ({
  useAnalytics: vi.fn(() => ({
    trackEvent: vi.fn(),
    trackPageView: vi.fn(),
  }))
}));

// Mock router
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(() => vi.fn()),
  useLocation: vi.fn(() => ({ pathname: '/test' })),
}));
```

#### Platform Detection Mock
```typescript
// Mock useIsDesktop for responsive testing
const mockUseIsDesktop = vi.fn();
vi.mock('@/shared/hooks/useIsDesktop', () => ({
  useIsDesktop: mockUseIsDesktop
}));

// In test
mockUseIsDesktop.mockReturnValue(true);  // Desktop
mockUseIsDesktop.mockReturnValue(false); // Mobile
```

## GRANULAR IMPLEMENTATION ROADMAP

### Sprint 1 (Week 1-2): Critical Business Logic Foundation
**Target**: 15% coverage | **Focus**: Revenue-generating systems

#### Day 1-3: Form System Testing
- [ ] **Setup** test organization structure (`src/__tests__/forms/`)
- [ ] **B2BFormSchema validation** (`forms.test.ts`)
  ```typescript
  ✓ Required field validation (nome, email, empresa)
  ✓ Email format validation (Brazilian domains)
  ✓ Phone number format validation (BR format)
  ✓ Enum validation (tipoEvento, orçamento, numeroConvidados)
  ✓ Date validation (evento within 6 months)
  ✓ Optional field handling (detalhesAdicionais)
  ```

- [ ] **QualificationForm component** (`QualificationForm.test.tsx`)
  ```typescript
  ✓ Form rendering with all fields
  ✓ Field validation error display
  ✓ Lead scoring calculation (budget 30pts + attendees 15pts + date 20pts)
  ✓ Form submission success flow
  ✓ Analytics event tracking on submit
  ✓ Modal state management integration
  ```

#### Day 4-7: State Management Testing
- [ ] **AppStore core functionality** (`appStore.test.ts`)
  ```typescript
  ✓ Store initialization with defaults
  ✓ Attribution data updates (UTM parameters)
  ✓ Consent state management (GDPR compliance)
  ✓ Modal state management (open/close operations)
  ✓ Persistence layer testing (localStorage integration)
  ✓ Action creators and state mutations
  ✓ Selector behavior validation
  ```

#### Day 8-10: Integration Testing Setup
- [ ] **CI/CD test pipeline** (GitHub Actions)
- [ ] **Coverage reporting** (Vitest + c8)
- [ ] **Mock configurations** (analytics, router, external APIs)

#### Expected Outcomes:
- **Business Logic Coverage**: 85% (forms + state critical paths)
- **Lead Generation Flow**: Fully tested end-to-end
- **GDPR Compliance**: Validated consent management

---

### Sprint 2 (Week 3-4): User Journey Critical Paths
**Target**: 35% coverage | **Focus**: User experience flows

#### Day 11-14: Page Component Testing
- [ ] **HomePage component** (`HomePage.test.tsx`)
  ```typescript
  ✓ Desktop/mobile platform detection
  ✓ Lazy loading behavior (React.lazy)
  ✓ Suspense fallback rendering
  ✓ Analytics page view tracking
  ✓ SEO metadata validation
  ✓ Hero CTA button functionality
  ✓ Modal trigger integration
  ```

- [ ] **ReveillonPage component** (`ReveillonPage.test.tsx`)
  ```typescript
  ✓ Feature-specific content rendering
  ✓ Platform-specific component loading
  ✓ Timeline section interaction
  ✓ Booking flow integration
  ✓ Event-specific analytics tracking
  ```

#### Day 15-17: Routing & Navigation
- [ ] **AppRoutes testing** (`AppRoutes.test.tsx`)
  ```typescript
  ✓ Route resolution (/, /reveillon, 404)
  ✓ Lazy loading integration
  ✓ Platform detection in routing
  ✓ Analytics route tracking
  ✓ Error boundary behavior
  ```

- [ ] **NotFound component** (`NotFound.test.tsx`)
  ```typescript
  ✓ 404 page rendering
  ✓ Navigation back to home
  ✓ Analytics error tracking
  ```

#### Day 18-21: Platform Detection System
- [ ] **Enhanced useIsDesktop tests** (extend existing)
  ```typescript
  ✓ SSR safety (null during hydration)
  ✓ Breakpoint accuracy (1024px threshold)
  ✓ Event listener cleanup
  ✓ Multiple viewport changes
  ✓ Edge cases (exactly 1024px)
  ```

#### Expected Outcomes:
- **User Flow Coverage**: 90% (all entry points tested)
- **Platform Detection**: 100% reliability
- **SEO/Analytics**: Validated tracking implementation

---

### Sprint 3 (Week 5-6): Feature Component Ecosystem
**Target**: 50% coverage | **Focus**: Business feature components

#### Day 22-28: Desktop Feature Components
- [ ] **Home Desktop** (`Home.desktop.test.tsx`)
  ```typescript
  ✓ Hero section rendering and interactions
  ✓ FogosM5Complete stats display
  ✓ Services portfolio grid
  ✓ FAQ accordion functionality
  ✓ CTA button analytics tracking
  ✓ WhatsApp integration testing
  ✓ Particle animation system (non-visual validation)
  ```

- [ ] **Reveillon Desktop** (`Reveillon.desktop.test.tsx`)
  ```typescript
  ✓ Event-specific hero content
  ✓ Timeline section interactions
  ✓ Service customization options
  ✓ Booking form integration
  ✓ Event analytics tracking
  ```

#### Day 29-35: Mobile Feature Components
- [ ] **Home Mobile** (`Home.mobile.test.tsx`)
  ```typescript
  ✓ Responsive component rendering
  ✓ Touch interaction handling
  ✓ Mobile-optimized animations
  ✓ Swipe gesture support
  ✓ Mobile analytics events
  ```

- [ ] **Reveillon Mobile** (`Reveillon.mobile.test.tsx`)
  ```typescript
  ✓ Mobile timeline interaction
  ✓ Touch-optimized service selection
  ✓ Mobile booking flow
  ✓ Responsive design validation
  ```

#### Day 36-42: Component Integration Testing
- [ ] **Cross-component workflows**
  ```typescript
  ✓ Hero → Modal → Form workflow
  ✓ Services → WhatsApp workflow
  ✓ FAQ → Contact workflow
  ✓ Attribution preservation across components
  ```

#### Expected Outcomes:
- **Feature Coverage**: 80% (all main user interactions)
- **Mobile/Desktop Parity**: Validated responsive behavior
- **Business Workflows**: End-to-end journey testing

---

### Sprint 4 (Week 7-8): Infrastructure & Integration
**Target**: 65% coverage | **Focus**: Supporting systems

#### Day 43-49: Custom Hook Testing
- [ ] **useAnalytics hook** (`useAnalytics.test.ts`)
  ```typescript
  ✓ Event tracking functionality
  ✓ Page view tracking
  ✓ Consent state integration
  ✓ UTM parameter handling
  ✓ Error handling and fallbacks
  ```

- [ ] **useAttribution hook** (`useAttribution.test.ts`)
  ```typescript
  ✓ UTM parameter extraction
  ✓ Attribution data persistence
  ✓ Cross-session attribution
  ✓ Default attribution handling
  ```

- [ ] **useToast hook** (`useToast.test.ts`)
  ```typescript
  ✓ Toast notification display
  ✓ Success/error message handling
  ✓ Auto-dismiss functionality
  ✓ Multiple toast management
  ```

#### Day 50-56: Modal System Testing
- [ ] **ConversionModal** (`ConversionModal.test.tsx`)
  ```typescript
  ✓ Modal open/close behavior
  ✓ Form integration
  ✓ Analytics event tracking
  ✓ Escape key handling
  ✓ Background click dismissal
  ✓ Accessibility (focus management)
  ```

- [ ] **ContactModal** (`ContactModal.test.tsx`)
  ```typescript
  ✓ Contact form rendering
  ✓ Field validation
  ✓ Submission handling
  ✓ Success/error states
  ```

#### Day 57-63: Layout Component Testing
- [ ] **Header component** (`Header.test.tsx`)
  ```typescript
  ✓ Navigation menu functionality
  ✓ Mobile menu toggle
  ✓ Logo click behavior
  ✓ Responsive design
  ✓ Active page indication
  ```

- [ ] **Footer component** (`Footer.test.tsx`)
  ```typescript
  ✓ Contact information display
  ✓ Social media links
  ✓ WhatsApp integration
  ✓ Business information accuracy
  ```

#### Expected Outcomes:
- **Infrastructure Coverage**: 85% (all supporting systems)
- **Integration Points**: Validated cross-system communication
- **User Experience**: Tested interaction patterns

---

### Sprint 5 (Week 9-12): UI Component Library & Polish
**Target**: 75% coverage | **Focus**: Design system reliability

#### Day 64-77: Core UI Component Testing
- [ ] **Button variants** (`button.test.tsx` - expand existing)
  ```typescript
  ✓ All variants (fire, tech, hero, outline-fire, cta)
  ✓ Size variations (sm, lg, default)
  ✓ Disabled states
  ✓ Loading states
  ✓ Icon integration
  ✓ Accessibility (ARIA attributes)
  ✓ Hover/focus states
  ```

- [ ] **Form components** (`form.test.tsx`, `input.test.tsx`, `select.test.tsx`)
  ```typescript
  ✓ Field rendering and validation
  ✓ Error state display
  ✓ Required field indicators
  ✓ Accessibility compliance
  ✓ Brazilian Portuguese labels
  ```

- [ ] **Dialog system** (`dialog.test.tsx`)
  ```typescript
  ✓ Modal open/close behavior
  ✓ Focus management
  ✓ Keyboard navigation
  ✓ Backdrop behavior
  ✓ Animation states
  ```

#### Day 78-91: Visual & Accessibility Testing
- [ ] **Playwright visual regression** setup
  ```typescript
  ✓ Homepage visual consistency
  ✓ Modal appearance validation
  ✓ Button hover states
  ✓ Mobile responsive layout
  ✓ Cross-browser compatibility
  ```

- [ ] **Accessibility testing** (`a11y.test.tsx`)
  ```typescript
  ✓ Screen reader compatibility
  ✓ Keyboard navigation
  ✓ ARIA attribute validation
  ✓ Color contrast ratios
  ✓ Focus management
  ```

#### Day 92-105: Performance & Edge Case Testing
- [ ] **Performance testing**
  ```typescript
  ✓ Bundle loading performance
  ✓ Lazy loading validation
  ✓ Animation performance
  ✓ Memory leak detection
  ```

- [ ] **Edge case coverage**
  ```typescript
  ✓ Network failure handling
  ✓ JavaScript disabled scenarios
  ✓ Extreme viewport sizes
  ✓ High latency conditions
  ```

#### Expected Outcomes:
- **UI Library Coverage**: 90% (design system reliability)
- **Visual Consistency**: Automated regression testing
- **Accessibility Compliance**: WCAG 2.1 AA validated

---

## DETAILED TESTING METRICS & MILESTONES

### Coverage Progression Tracking

**Sprint 1 Checkpoint (Week 2)**
- **Target**: 15% overall coverage
- **Critical**: Forms (85%), State (85%), Core utilities (90%)
- **Success Metrics**: Lead generation flow completely tested

**Sprint 2 Checkpoint (Week 4)**  
- **Target**: 35% overall coverage
- **Critical**: Pages (90%), Routing (100%), Platform detection (100%)
- **Success Metrics**: All user entry points validated

**Sprint 3 Checkpoint (Week 6)**
- **Target**: 50% overall coverage
- **Critical**: Features (80%), Workflows (90%), Mobile/desktop parity
- **Success Metrics**: Business logic completely covered

**Sprint 4 Checkpoint (Week 8)**
- **Target**: 65% overall coverage
- **Critical**: Hooks (85%), Modals (90%), Layout (80%)
- **Success Metrics**: Infrastructure systems reliable

**Sprint 5 Checkpoint (Week 12)**
- **Target**: 75% overall coverage
- **Critical**: UI components (90%), Visual regression (100%), A11y (85%)
- **Success Metrics**: Production-ready quality validated

### Quality Gates per Sprint

**Sprint 1 Quality Gates:**
- [ ] All business-critical paths pass tests
- [ ] Form validation covers all edge cases
- [ ] Lead scoring algorithm validated
- [ ] State persistence works correctly

**Sprint 2 Quality Gates:**
- [ ] User flows work on all devices
- [ ] SEO metadata validates correctly
- [ ] Analytics tracking fires properly
- [ ] Error boundaries catch failures

**Sprint 3 Quality Gates:**
- [ ] Mobile/desktop feature parity
- [ ] Animation systems work without errors
- [ ] WhatsApp integration functional
- [ ] Attribution tracking preserved

**Sprint 4 Quality Gates:**
- [ ] Modal accessibility compliance
- [ ] Hook error handling robust
- [ ] Layout responsive on all breakpoints
- [ ] Integration points stable

**Sprint 5 Quality Gates:**
- [ ] Visual regression baseline established
- [ ] Accessibility audit passes
- [ ] Performance budgets met
- [ ] Cross-browser compatibility

## TESTING METRICS & GOALS

### Coverage Targets

**Phase 1 (Weeks 1-2)**: 15% coverage  
- Critical forms and state management

**Phase 2 (Weeks 3-6)**: 35% coverage  
- Core user flows and business logic

**Phase 3 (Weeks 7-8)**: 50% coverage  
- Infrastructure and integrations

**Phase 4 (Weeks 9-12)**: 70% coverage  
- UI component library and edge cases

### Quality Metrics

#### Code Coverage
- **Statements**: >80%
- **Branches**: >75%
- **Functions**: >85%
- **Lines**: >80%

#### Test Quality
- **No skipped tests** without clear justification
- **Meaningful assertions** (not just "renders without error")
- **Edge case coverage** for business-critical logic
- **Integration test coverage** for user workflows

## MCP-ENHANCED TESTING AUTOMATION

### Playwright MCP Integration for E2E Testing

```typescript
// Enhanced E2E testing with Playwright MCP
describe('Lead Generation Flow', () => {
  it('should complete full conversion funnel', async () => {
    // Use Playwright MCP for browser automation
    await mcp__Playwright__playwright_navigate('localhost:5173');
    
    // Homepage Hero CTA click
    await mcp__Playwright__playwright_click('.hero-cta-button');
    
    // Modal form interaction
    await mcp__Playwright__playwright_fill('[name="nome"]', 'João Silva');
    await mcp__Playwright__playwright_fill('[name="email"]', 'joao@empresa.com.br');
    await mcp__Playwright__playwright_select('[name="orçamento"]', '50k-100k');
    
    // Form submission and validation
    await mcp__Playwright__playwright_click('[type="submit"]');
    
    // Verify analytics events fired
    const logs = await mcp__Playwright__playwright_console_logs({ 
      search: 'lead_qualified' 
    });
    expect(logs).toContain('lead_qualified');
    
    // Screenshot for visual regression
    await mcp__Playwright__playwright_screenshot({ 
      name: 'conversion-success',
      fullPage: true 
    });
  });
});
```

### GitHub MCP CI/CD Integration

```yaml
# .github/workflows/test-enhanced.yml
name: Enhanced Testing Pipeline
on: [push, pull_request]
jobs:
  test-unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:coverage
      - name: Update GitHub PR with coverage
        uses: mcp__github__add_issue_comment
        with:
          body: "Coverage updated: ${{ steps.coverage.outputs.percentage }}%"
  
  test-e2e:
    runs-on: ubuntu-latest
    needs: test-unit
    steps:
      - name: Run Playwright E2E via MCP
        run: |
          npm run dev &
          npm run test:playwright:mcp
      - name: Visual Regression Check
        run: npm run test:visual:compare
```

### CI/CD Integration

```typescript
// Enhanced test configuration with MCP integration
// vite.config.ts - Add to test config
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: ['./src/setupTests.ts', './src/setupMCPTests.ts'],
  css: true,
  coverage: {
    provider: 'c8',
    reporter: ['text', 'json', 'html', 'lcov'],
    exclude: [
      'src/setupTests.ts',
      'src/**/*.test.{ts,tsx}',
      'src/vite-env.d.ts',
      'src/**/*.mcp.test.{ts,tsx}' // MCP-specific test files
    ],
    threshold: {
      global: {
        branches: 75,
        functions: 85,
        lines: 80,
        statements: 80
      }
    }
  }
}
```

### Pre-commit Hooks with MCP Validation

```json
// package.json - Enhanced with MCP testing integration
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged && npm run test:mcp:quick"
    }
  },
  "lint-staged": {
    "src/**/*.{ts,tsx}": [
      "npm run test -- --run --changed",
      "npm run test:playwright:changed", 
      "npm run lint"
    ]
  },
  "scripts": {
    "test:mcp:quick": "npm run test:unit && npm run test:e2e:smoke",
    "test:playwright:mcp": "vitest run src/**/*.playwright.test.ts",
    "test:visual:compare": "playwright test --config=playwright.visual.config.ts",
    "test:coverage:mcp": "vitest run --coverage && npm run test:e2e:coverage"
  }
}
```

### Coverage Reporting

```typescript
// vite.config.ts - Add to test config
test: {
  // ... existing config
  coverage: {
    provider: 'c8',
    reporter: ['text', 'json', 'html'],
    exclude: [
      'src/setupTests.ts',
      'src/**/*.test.{ts,tsx}',
      'src/vite-env.d.ts',
    ]
  }
}
```

## MAINTENANCE STRATEGY

### New Component Testing Requirements
- [ ] Every new component must include tests
- [ ] PR template includes testing checklist
- [ ] Code review includes test review
- [ ] Coverage must not decrease

### Test Maintenance Schedule
- [ ] **Weekly**: Review failing tests and flaky tests
- [ ] **Monthly**: Review coverage metrics and gaps
- [ ] **Quarterly**: Update testing strategy and tools
- [ ] **Annually**: Major testing framework upgrades

---

## CRITICAL SUCCESS FACTORS

### Business Impact Prioritization Matrix

**Revenue-Critical (Must Test First):**
- **Lead Generation Flow**: Form validation, scoring algorithm, conversion tracking
- **WhatsApp Integration**: Business phone integration, attribution preservation
- **Analytics Pipeline**: UTM tracking, GDPR consent, conversion attribution

**User Experience Critical (Test Second):**
- **Platform Detection**: Desktop/mobile bifurcation reliability
- **Page Loading**: Lazy loading, performance, error boundaries
- **Modal System**: Conversion flow, accessibility, user interactions

**Code Quality Critical (Test Third):**
- **UI Component Library**: Design system consistency, variant behavior
- **State Management**: Zustand store reliability, persistence layer
- **Hook System**: Custom hooks, error handling, integration points

### ROI-Focused Implementation Strategy

**Sprint 1 (Weeks 1-2): Maximum Business Impact**
- **Investment**: 40 hours (forms + state + integration setup)
- **Expected ROI**: Prevents lead generation failures, ensures conversion tracking
- **Risk Mitigation**: Validates revenue-generating code paths

**Sprint 2-3 (Weeks 3-6): User Experience Assurance**
- **Investment**: 60 hours (pages + features + workflows)
- **Expected ROI**: Prevents user journey failures, ensures platform parity
- **Risk Mitigation**: Validates all user entry points and interaction flows

**Sprint 4-5 (Weeks 7-12): Long-term Quality**
- **Investment**: 80 hours (infrastructure + UI library + polish)
- **Expected ROI**: Reduces maintenance overhead, ensures accessibility
- **Risk Mitigation**: Prevents technical debt accumulation

### Testing Success Metrics

**Business Metrics:**
- **Lead Conversion Rate**: Maintain >85% form completion rate
- **WhatsApp Click-through**: Preserve attribution across 95% of interactions
- **Page Load Performance**: <2s LCP maintained across all tested paths

**Technical Metrics:**
- **Test Execution Speed**: <30 seconds for full unit test suite
- **E2E Test Reliability**: >95% pass rate on CI/CD pipeline
- **Visual Regression**: 0 unintentional UI changes in production

**Quality Metrics:**
- **Bug Prevention**: >90% of production bugs caught in testing
- **Accessibility Compliance**: WCAG 2.1 AA validation across all tested components
- **Cross-browser Compatibility**: Chrome, Firefox, Safari, Edge validation

---

## IMPLEMENTATION COMMITMENT

This comprehensive testing strategy will transform the M5 Max codebase from **2.5% coverage to 75%+ coverage** with laser focus on business-critical functionality and user experience quality. 

**The granular roadmap ensures every testing hour directly contributes to revenue protection, user experience enhancement, and technical debt prevention.**

**Success Timeline:**
- **Month 1**: Business-critical systems fully tested (forms, state, core flows)
- **Month 2**: User experience completely validated (all platforms, journeys, integrations)  
- **Month 3**: Production-ready quality achieved (UI library, accessibility, performance)

**With MCP integration, this testing strategy leverages automated browser testing, visual regression detection, and CI/CD integration to ensure maximum coverage with minimum manual overhead.**