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

## IMPLEMENTATION ROADMAP

### Week 1-2: Foundation (Priority 1)
- [ ] Set up test organization structure
- [ ] Configure test utilities and helpers
- [ ] Implement Form System tests (forms.ts, QualificationForm, B2BForm)
- [ ] Implement State Management tests (appStore.ts)
- [ ] Set up CI/CD test running

### Week 3-4: Core Flows (Priority 2a)
- [ ] Implement Page Component tests (HomePage, ReveillonPage)
- [ ] Add routing tests (AppRoutes, NotFound)
- [ ] Platform detection integration tests
- [ ] SEO metadata testing

### Week 5-6: Business Logic (Priority 2b)
- [ ] Feature component tests (Home, Reveillon desktop/mobile)
- [ ] Component interaction tests
- [ ] User journey integration tests
- [ ] Analytics event tracking tests

### Week 7-8: Infrastructure (Priority 3a)
- [ ] Hook testing suite (useAnalytics, useAttribution, useToast)
- [ ] Modal system tests (ConversionModal, ContactModal)
- [ ] Layout component tests (Header, Footer, RootLayout)

### Week 9-12: UI Library (Priority 4)
- [ ] Core UI component tests (form, input, dialog, card)
- [ ] Variant system testing
- [ ] Accessibility testing
- [ ] Visual regression testing setup

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

## AUTOMATED TESTING SETUP

### CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
```

### Pre-commit Hooks

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "src/**/*.{ts,tsx}": [
      "npm run test -- --run --changed",
      "npm run lint"
    ]
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

This comprehensive testing strategy will transform the M5 Max codebase from ~2.5% coverage to 70%+ coverage with a focus on business-critical functionality and user experience quality.