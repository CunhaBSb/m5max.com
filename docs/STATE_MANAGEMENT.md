# STATE MANAGEMENT - M5 MAX

> **Purpose**: Complete guide to Zustand state management patterns, persistence, and usage throughout the application.

## OVERVIEW

**State Library**: Zustand 5.0.8 (`package.json:69`)  
**Store Location**: `src/shared/store/appStore.ts:24-65`  
**Persistence**: localStorage with selective state partitioning  
**Pattern**: Single global store with typed actions and selectors  
**Export**: `src/shared/store/index.ts:1` - Clean re-export interface

## STORE ARCHITECTURE

### Store Interface (`appStore.ts:7-22`)
```typescript
interface AppState {
  // Attribution & Analytics
  attribution: AttributionData | null;
  consent: ConsentState;
  
  // UI State
  conversionModalOpen: boolean;
  currentAudience: AudienceType;
  
  // Actions
  setAttribution: (data: AttributionData) => void;
  updateConsent: (consent: Partial<ConsentState>) => void;
  openConversionModal: (context: ConversionContext) => void;
  closeConversionModal: () => void;
  setCurrentAudience: (audience: AudienceType) => void;
}
```

### State Categories

#### 1. Attribution & Analytics State
**Purpose**: Track user attribution and consent for GDPR compliance

**Attribution Data** (`appStore.ts:9`):
```typescript
attribution: AttributionData | null
```

**Consent Management** (`appStore.ts:10`):
```typescript
consent: ConsentState
```

#### 2. UI State Management
**Purpose**: Global UI state for modals and audience targeting

**Modal State** (`appStore.ts:13`):
```typescript
conversionModalOpen: boolean
```

**Audience Targeting** (`appStore.ts:14`):
```typescript
currentAudience: AudienceType  // 'b2b' | 'general'
```

## TYPE DEFINITIONS

### Attribution Types (`src/shared/types/analytics.ts:9-16`)
```typescript
export interface AttributionData {
  utm: UTMParams;
  gclid?: string;
  fbclid?: string;
  referrer: string;
  landingPage: string;
  timestamp: number;
}

export interface UTMParams {
  utm_source: string;    // google, facebook, instagram, youtube, direct
  utm_medium: string;    // cpc, social, organic, email, referral
  utm_campaign: string;  // {audience}-{season}-{year}
  utm_content?: string;  // {creative-variant}
  utm_term?: string;     // {keyword}
}
```

### Consent Types (`src/shared/types/analytics.ts:18-25`)
```typescript
export interface ConsentState {
  ad_storage: 'granted' | 'denied';
  ad_user_data: 'granted' | 'denied';
  ad_personalization: 'granted' | 'denied';
  analytics_storage: 'granted' | 'denied';
  functionality_storage: 'granted' | 'denied';
  security_storage: 'granted' | 'denied';
}
```

### Form Context Types (`src/shared/types/forms.ts:32-37`)
```typescript
export interface ConversionContext {
  source: string;
  audience: 'b2b' | 'general';
  page?: string;
  productId?: string;
}
```

## STORE IMPLEMENTATION

### Store Creation (`appStore.ts:24-65`)
```typescript
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      attribution: null,
      consent: {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
        functionality_storage: 'granted',
        security_storage: 'granted'
      },
      conversionModalOpen: false,
      currentAudience: 'general',

      // Actions Implementation
      setAttribution: (data) => set({ attribution: data }),
      
      updateConsent: (newConsent) => set((state) => ({
        consent: { ...state.consent, ...newConsent }
      })),
      
      openConversionModal: (context) => set({ 
        conversionModalOpen: true,
        currentAudience: context.audience 
      }),
      
      closeConversionModal: () => set({ conversionModalOpen: false }),
      
      setCurrentAudience: (audience) => set({ currentAudience: audience })
    }),
    {
      name: 'm5max-storage',
      partialize: (state) => ({
        attribution: state.attribution,
        consent: state.consent,
        currentAudience: state.currentAudience
      }),
    }
  )
);
```

### Persistence Configuration (`appStore.ts:56-64`)

#### Storage Key
```typescript
name: 'm5max-storage'
```

#### Selective Persistence (`appStore.ts:58-63`)
```typescript
partialize: (state) => ({
  attribution: state.attribution,        // Persist attribution data
  consent: state.consent,               // Persist consent choices
  currentAudience: state.currentAudience // Persist audience selection
  // conversionModalOpen: excluded (ephemeral UI state)
})
```

**Rationale**: Modal state is ephemeral and should not persist across sessions.

## ACTION PATTERNS

### 1. Simple State Updates

#### Direct Assignment Pattern
```typescript
setAttribution: (data) => set({ attribution: data })
setCurrentAudience: (audience) => set({ currentAudience: audience })
```

**Usage**:
```typescript
const { setAttribution } = useAppStore();
setAttribution({
  utm: { utm_source: 'google', utm_medium: 'cpc', utm_campaign: 'holiday-2024' },
  referrer: document.referrer,
  landingPage: window.location.href,
  timestamp: Date.now()
});
```

### 2. Merge Update Pattern

#### Partial State Updates
```typescript
updateConsent: (newConsent) => set((state) => ({
  consent: { ...state.consent, ...newConsent }
}))
```

**Usage**:
```typescript
const { updateConsent } = useAppStore();
updateConsent({ 
  analytics_storage: 'granted',
  ad_storage: 'denied'
});
```

### 3. Compound Actions Pattern

#### Multi-State Updates
```typescript
openConversionModal: (context) => set({ 
  conversionModalOpen: true,
  currentAudience: context.audience 
})
```

**Usage**:
```typescript
const { openConversionModal } = useAppStore();
openConversionModal({
  source: 'hero',
  audience: 'general',
  page: 'home'
});
```

## COMPONENT USAGE PATTERNS

### 1. Selector Pattern (Recommended)

#### Minimal Re-renders with Specific Selectors
```typescript
// Good: Only re-renders on modal state change
const { conversionModalOpen, closeConversionModal } = useAppStore();

// Good: Only re-renders on attribution change
const { attribution } = useAppStore();

// Good: Only re-renders on consent change
const { consent } = useAppStore();
```

### 2. Full Store Access (Use Sparingly)
```typescript
// Use only when multiple state pieces are needed
const store = useAppStore();
```

## REAL-WORLD USAGE EXAMPLES

### 1. Root Layout - Modal Management
**File**: `src/app/layouts/RootLayout.tsx:13`

```typescript
const RootLayout = ({ children }: RootLayoutProps) => {
  const { conversionModalOpen, closeConversionModal, currentAudience } = useAppStore();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Layout content */}
      <ConversionModal 
        isOpen={conversionModalOpen}
        onClose={closeConversionModal}
        audience={currentAudience}
        source="global"
      />
    </div>
  );
};
```

### 2. Hero Component - Conversion Trigger  
**File**: `src/features/home/desktop/components/Hero.tsx:17-29`

```typescript
const Hero = () => {
  const { openConversionModal, attribution } = useAppStore();
  
  const handleOrçamentoClick = useCallback(() => {
    openConversionModal({
      source: 'hero',
      audience: 'general',
      page: 'home'
    });
  }, [openConversionModal]);

  return (
    <Button variant="cta" onClick={handleOrçamentoClick}>
      Solicitar Orçamento
    </Button>
  );
};
```

### 3. Analytics Hook - Data Access
**File**: `src/shared/hooks/useAnalytics.ts:22`

```typescript
export const useAnalytics = () => {
  const { consent, attribution } = useAppStore();

  const trackEvent = useCallback((event: string, params: object) => {
    if (consent.analytics_storage === 'granted') {
      // Track event with attribution context
      window.dataLayer?.push({
        event,
        ...params,
        ...attribution?.utm
      });
    }
  }, [consent, attribution]);

  return { trackEvent };
};
```

### 4. Analytics Provider - Consent Integration
**File**: `src/app/providers/analytics/AnalyticsProvider.tsx:13`

```typescript
const AnalyticsProvider = ({ children }) => {
  const { consent } = useAppStore();

  useEffect(() => {
    // Configure GTM/GA4 based on consent
    if (typeof window !== 'undefined') {
      window.gtag('consent', 'update', consent);
    }
  }, [consent]);

  return <>{children}</>;
};
```

### 5. Conversion Modal - State Integration
**File**: `src/shared/modal/ConversionModal.tsx:33`

```typescript
const ConversionModal: React.FC<ConversionModalProps> = ({ isOpen, onClose, audience, source }) => {
  const { attribution } = useAppStore();

  const handleFormSubmit = async (data: FormData) => {
    // Include attribution data in form submission
    const submissionData = {
      ...data,
      attribution,
      source,
      audience
    };
    
    await submitLead(submissionData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Modal content */}
    </Dialog>
  );
};
```

## ADVANCED PATTERNS

### 1. Computed Values with useMemo

```typescript
const MyComponent = () => {
  const { consent } = useAppStore();
  
  const canTrack = useMemo(() => 
    consent.analytics_storage === 'granted' && 
    consent.ad_storage === 'granted',
    [consent]
  );
  
  return <div>{canTrack && <AnalyticsPixel />}</div>;
};
```

### 2. Action Composition

```typescript
const ComplexComponent = () => {
  const { openConversionModal, setCurrentAudience } = useAppStore();
  
  const handleComplexAction = useCallback(() => {
    // First set audience context
    setCurrentAudience('b2b');
    
    // Then open modal with context
    setTimeout(() => {
      openConversionModal({
        source: 'complex-flow',
        audience: 'b2b',
        page: 'service-page'
      });
    }, 100);
  }, [openConversionModal, setCurrentAudience]);
  
  return <Button onClick={handleComplexAction}>Complex Action</Button>;
};
```

### 3. Conditional State Updates

```typescript
const ConditionalComponent = () => {
  const { attribution, setAttribution } = useAppStore();
  
  const updateAttributionIfNeeded = useCallback((newData: AttributionData) => {
    // Only update if attribution is stale (older than 30 minutes)
    if (!attribution || Date.now() - attribution.timestamp > 1800000) {
      setAttribution(newData);
    }
  }, [attribution, setAttribution]);
  
  return <div>/* Component content */</div>;
};
```

## TESTING PATTERNS

### 1. Store Testing Setup

```typescript
import { create } from 'zustand';
import { AppState } from '@/shared/store/appStore';

// Test store without persistence
const createTestStore = (initialState?: Partial<AppState>) => {
  return create<AppState>()((set) => ({
    // Default state
    attribution: null,
    consent: { /* default consent */ },
    conversionModalOpen: false,
    currentAudience: 'general',
    
    // Override with test state
    ...initialState,
    
    // Actions
    setAttribution: (data) => set({ attribution: data }),
    updateConsent: (newConsent) => set((state) => ({
      consent: { ...state.consent, ...newConsent }
    })),
    // ... other actions
  }));
};
```

### 2. Component Testing with Store

```typescript
import { render, screen } from '@testing-library/react';
import { useAppStore } from '@/shared/store/appStore';
import MyComponent from './MyComponent';

// Mock the store
vi.mock('@/shared/store/appStore');
const mockUseAppStore = vi.mocked(useAppStore);

describe('MyComponent', () => {
  beforeEach(() => {
    mockUseAppStore.mockReturnValue({
      conversionModalOpen: false,
      closeConversionModal: vi.fn(),
      // ... other store values
    });
  });
  
  it('should handle modal state correctly', () => {
    render(<MyComponent />);
    // Test component behavior
  });
});
```

## PERFORMANCE CONSIDERATIONS

### 1. Selector Optimization

#### Good: Specific Selectors
```typescript
// Each selector creates minimal re-renders
const modalOpen = useAppStore(state => state.conversionModalOpen);
const audience = useAppStore(state => state.currentAudience);
```

#### Avoid: Object Destructuring with Multiple Properties
```typescript
// Can cause unnecessary re-renders
const { conversionModalOpen, currentAudience, attribution, consent } = useAppStore();
```

### 2. Action Memoization

```typescript
const MyComponent = () => {
  const openConversionModal = useAppStore(state => state.openConversionModal);
  
  // Memoize action to prevent child re-renders
  const handleClick = useCallback(() => {
    openConversionModal({ source: 'button', audience: 'general' });
  }, [openConversionModal]);
  
  return <ExpensiveChildComponent onClick={handleClick} />;
};
```

### 3. Persistence Performance

**Storage Key Strategy**: Single key (`m5max-storage`) reduces localStorage operations  
**Selective Persistence**: Only essential state persisted to minimize serialization overhead  
**Storage Size**: Current state ~1-2KB, well within localStorage limits

## STATE DEBUGGING

### 1. Zustand DevTools Integration

```typescript
// Add to appStore.ts for debugging
import { devtools } from 'zustand/middleware';

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      // ... store implementation
    ),
    { name: 'm5max-store' }
  )
);
```

### 2. State Logging

```typescript
const DebugComponent = () => {
  const state = useAppStore();
  
  useEffect(() => {
    console.log('Store State:', {
      attribution: state.attribution,
      consent: state.consent,
      modalOpen: state.conversionModalOpen,
      audience: state.currentAudience
    });
  }, [state]);
  
  return null;
};
```

## MIGRATION & EXPANSION PATTERNS

### 1. Adding New State

```typescript
// 1. Extend interface
interface AppState {
  // ... existing state
  newFeature: NewFeatureState;
  
  // ... existing actions  
  updateNewFeature: (data: NewFeatureState) => void;
}

// 2. Add to store implementation
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // ... existing state
      newFeature: { /* initial state */ },
      
      // ... existing actions
      updateNewFeature: (data) => set({ newFeature: data }),
    }),
    {
      name: 'm5max-storage',
      partialize: (state) => ({
        // ... existing persisted state
        newFeature: state.newFeature, // Add if should persist
      }),
    }
  )
);
```

### 2. Breaking Changes Migration

```typescript
// Add version to persistence for migration handling
{
  name: 'm5max-storage',
  version: 2,
  migrate: (persistedState: any, version: number) => {
    if (version < 2) {
      // Migrate old consent structure
      return {
        ...persistedState,
        consent: migrateConsentStructure(persistedState.consent)
      };
    }
    return persistedState;
  },
  partialize: (state) => ({ /* ... */ })
}
```

## STORE ARCHITECTURE PRINCIPLES

### 1. Single Source of Truth
- **Global State**: All cross-component state in single store
- **Local State**: Component-specific state remains in components
- **Derived State**: Computed values use selectors or useMemo

### 2. Action-Based Updates
- **Immutable Updates**: All state changes through actions
- **Pure Actions**: Actions have no side effects
- **Predictable State**: State changes are synchronous and predictable

### 3. Selective Persistence
- **Essential Data**: Only business-critical state persisted
- **UI State**: Ephemeral UI state not persisted
- **Performance**: Minimal serialization overhead

### 4. Type Safety
- **Strict Types**: All state and actions strictly typed
- **Runtime Validation**: Zod schemas for external data
- **IntelliSense**: Full IDE support for store usage

## ANTI-PATTERNS TO AVOID

### 1. Direct State Mutation
```typescript
// ❌ Bad: Direct mutation
const { consent } = useAppStore();
consent.analytics_storage = 'granted';

// ✅ Good: Use action
const { updateConsent } = useAppStore();
updateConsent({ analytics_storage: 'granted' });
```

### 2. Overusing Global State
```typescript
// ❌ Bad: Component-specific state in global store
interface AppState {
  formErrors: string[];
  currentTab: number;
  // ... these should be local state
}

// ✅ Good: Keep local state local
const MyComponent = () => {
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState(0);
  // ...
};
```

### 3. Large Object Destructuring
```typescript
// ❌ Bad: Causes unnecessary re-renders
const { ...everything } = useAppStore();

// ✅ Good: Specific selectors
const openModal = useAppStore(state => state.openConversionModal);
const modalOpen = useAppStore(state => state.conversionModalOpen);
```

### 4. Side Effects in Store
```typescript
// ❌ Bad: Side effects in actions
setAttribution: (data) => {
  trackEvent('attribution_set', data); // Side effect!
  return set({ attribution: data });
}

// ✅ Good: Side effects in components
const { setAttribution } = useAppStore();
const { trackEvent } = useAnalytics();

const handleAttribution = (data) => {
  setAttribution(data);
  trackEvent('attribution_set', data);
};
```

## CONCLUSION

The M5 Max Zustand store provides a clean, typed, and performant state management solution focused on:

- **Attribution Tracking**: UTM parameters and referrer data
- **Consent Management**: GDPR-compliant analytics consent
- **Modal State**: Global conversion modal management
- **Audience Targeting**: B2B vs. general audience segmentation

The store follows modern React patterns with selective persistence, type safety, and performance optimization while maintaining simplicity and maintainability.