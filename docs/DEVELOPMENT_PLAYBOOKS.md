# DEVELOPMENT PLAYBOOKS - M5 MAX

> **Purpose**: Step-by-step "where to touch" guides for common development tasks with exact file paths and dependencies.

## TABLE OF CONTENTS

1. [Add New Page/Route](#add-new-pageroute)
2. [Create Feature Component](#create-feature-component)
3. [Build UI Component](#build-ui-component)
4. [Add Zustand Store Slice](#add-zustand-store-slice)
5. [Create Form with Validation](#create-form-with-validation)
6. [Add Analytics Event](#add-analytics-event)
7. [Create Modal Dialog](#create-modal-dialog)
8. [Add New Section Component](#add-new-section-component)

---

## ADD NEW PAGE/ROUTE

### Overview
Add a new page with bifurcated desktop/mobile architecture and lazy loading.

### Files to Touch
- `src/app/router/AppRoutes.tsx` - Add route definition
- `src/features/{feature}/pages/{Feature}Page.tsx` - Create page container
- `src/features/{feature}/desktop/{Feature}.tsx` - Desktop implementation
- `src/features/{feature}/mobile/{Feature}.tsx` - Mobile implementation
- `src/features/{feature}/index.ts` - Feature exports

### Dependencies to Check
- Route path availability in `AppRoutes.tsx:8-12`
- Feature directory structure exists
- Lazy loading pattern consistency

### Step-by-Step Procedure

#### Step 1: Add Route Definition
**File**: `src/app/router/AppRoutes.tsx`

```typescript
// Add import at top (line ~4)
import NewFeaturePage from "@/features/new-feature/pages/NewFeaturePage";

// Add route in Routes component (line ~12)
<Route path="/new-feature" element={<NewFeaturePage />} />
```

#### Step 2: Create Feature Directory Structure
**Command**: 
```bash
mkdir -p src/features/new-feature/{pages,desktop,mobile,desktop/components,mobile/components,data}
```

#### Step 3: Create Page Container
**File**: `src/features/new-feature/pages/NewFeaturePage.tsx`

```typescript
import { lazy, Suspense } from 'react';
import { useIsDesktop } from '@/shared/hooks/useIsDesktop';

// Lazy load desktop and mobile versions
const NewFeatureDesktop = lazy(() => import('../desktop/NewFeature'));
const NewFeatureMobile = lazy(() => import('../mobile/NewFeature'));

// SSR-safe loading component
const PageLoading = () => (
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

// Platform-aware content with unified loading
const NewFeatureContent = () => {
  const isDesktop = useIsDesktop();
  
  // Show loading during platform detection
  if (isDesktop === null) {
    return <PageLoading />;
  }
  
  return isDesktop ? <NewFeatureDesktop /> : <NewFeatureMobile />;
};

const NewFeaturePage = () => {
  return (
    <Suspense fallback={<PageLoading />}>
      <NewFeatureContent />
    </Suspense>
  );
};

export default NewFeaturePage;
```

#### Step 4: Create Desktop Implementation
**File**: `src/features/new-feature/desktop/NewFeature.tsx`

```typescript
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import RootLayout from '@/app/layouts/RootLayout';

const NewFeature = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView({
      page_title: 'New Feature - M5 Max',
      page_location: window.location.href,
      page_category: 'general'
    });
  }, [trackPageView]);

  return (
    <>
      <Helmet>
        <title>New Feature - M5 Max Produções</title>
        <meta name="description" content="New feature description" />
      </Helmet>

      <RootLayout>
        {/* Desktop-specific implementation */}
        <div className="min-h-screen">
          <h1>New Feature Desktop</h1>
        </div>
      </RootLayout>
    </>
  );
};

export default NewFeature;
```

#### Step 5: Create Mobile Implementation
**File**: `src/features/new-feature/mobile/NewFeature.tsx`

```typescript
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import RootLayout from '@/app/layouts/RootLayout';

const NewFeature = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView({
      page_title: 'New Feature - M5 Max',
      page_location: window.location.href,
      page_category: 'general'
    });
  }, [trackPageView]);

  return (
    <>
      <Helmet>
        <title>New Feature - M5 Max Produções</title>
        <meta name="description" content="New feature description" />
      </Helmet>

      <RootLayout>
        {/* Mobile-specific implementation */}
        <div className="min-h-screen">
          <h1>New Feature Mobile</h1>
        </div>
      </RootLayout>
    </>
  );
};

export default NewFeature;
```

#### Step 6: Create Feature Exports
**File**: `src/features/new-feature/index.ts`

```typescript
// Main page container with PlatformSwitch integration
export { default as NewFeature } from './pages/NewFeaturePage';

// Desktop specific exports
export { default as NewFeatureDesktop } from './desktop/NewFeature';

// Mobile specific exports
export { default as NewFeatureMobile } from './mobile/NewFeature';
```

### Tests to Run
```bash
npm run lint           # Check code quality
npm run build         # Verify build success
npx tsc --noEmit      # Type check
```

### Rollback Procedure
1. Remove route from `AppRoutes.tsx`
2. Delete feature directory: `rm -rf src/features/new-feature`

---

## CREATE FEATURE COMPONENT

### Overview
Create a component following the bifurcated desktop/mobile pattern.

### Files to Touch
- `src/features/{feature}/desktop/components/{Component}.tsx` - Desktop version
- `src/features/{feature}/mobile/components/{Component}.tsx` - Mobile version (optional)
- `src/features/{feature}/index.ts` - Add exports if needed

### Dependencies to Check
- Parent feature exists
- Component directory structure
- Shared dependencies in `src/shared/`

### Step-by-Step Procedure

#### Step 1: Create Desktop Component
**File**: `src/features/{feature}/desktop/components/NewComponent.tsx`

```typescript
import React from 'react';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';

interface NewComponentProps {
  title: string;
  description?: string;
  className?: string;
}

const NewComponent: React.FC<NewComponentProps> = ({
  title,
  description,
  className = ''
}) => {
  return (
    <Card className={`p-6 ${className}`}>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {description && (
        <p className="text-gray-600 mb-4">{description}</p>
      )}
      <Button variant="default">
        Desktop Action
      </Button>
    </Card>
  );
};

export default NewComponent;
```

#### Step 2: Create Mobile Component (if different)
**File**: `src/features/{feature}/mobile/components/NewComponent.tsx`

```typescript
import React from 'react';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';

interface NewComponentProps {
  title: string;
  description?: string;
  className?: string;
}

const NewComponent: React.FC<NewComponentProps> = ({
  title,
  description,
  className = ''
}) => {
  return (
    <Card className={`p-4 ${className}`}> {/* Reduced padding for mobile */}
      <h2 className="text-xl font-bold mb-3">{title}</h2> {/* Smaller heading */}
      {description && (
        <p className="text-gray-600 text-sm mb-3">{description}</p>
      )}
      <Button variant="default" size="sm">
        Mobile Action
      </Button>
    </Card>
  );
};

export default NewComponent;
```

#### Step 3: Use in Page Components
**Desktop Usage** (`src/features/{feature}/desktop/{Feature}.tsx`):
```typescript
import NewComponent from './components/NewComponent';

// In component JSX:
<NewComponent 
  title="Feature Title"
  description="Feature description"
/>
```

**Mobile Usage** (`src/features/{feature}/mobile/{Feature}.tsx`):
```typescript
import NewComponent from './components/NewComponent';

// In component JSX:
<NewComponent 
  title="Feature Title"
  description="Feature description"
/>
```

### Tests to Run
```bash
npm run lint           # Check code quality
npm run build         # Verify build success
```

---

## BUILD UI COMPONENT

### Overview
Create a reusable UI component following shadcn/ui patterns with variants.

### Files to Touch
- `src/shared/ui/{component}.tsx` - Main component
- `src/shared/ui/{component}.variants.ts` - Styling variants (if needed)
- `src/shared/ui/{component}.test.tsx` - Component tests
- `src/shared/ui/index.ts` - Add export

### Dependencies to Check
- Required Radix UI primitives installed
- Tailwind CSS classes available
- Variant system dependencies (`class-variance-authority`)

### Step-by-Step Procedure

#### Step 1: Create Variants File
**File**: `src/shared/ui/new-component.variants.ts`

```typescript
import { cva, type VariantProps } from "class-variance-authority";

export const newComponentVariants = cva(
  // Base classes
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type NewComponentVariants = VariantProps<typeof newComponentVariants>;
```

#### Step 2: Create Component
**File**: `src/shared/ui/new-component.tsx`

```typescript
import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";
import { newComponentVariants } from "./new-component.variants";

export interface NewComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof newComponentVariants> {
  children?: React.ReactNode;
}

const NewComponent = React.forwardRef<HTMLDivElement, NewComponentProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <div
        className={cn(newComponentVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

NewComponent.displayName = "NewComponent";

export { NewComponent };
```

#### Step 3: Create Tests
**File**: `src/shared/ui/new-component.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NewComponent } from './new-component';

describe('NewComponent', () => {
  it('should render with default props', () => {
    render(<NewComponent>Test Content</NewComponent>);
    const component = screen.getByText('Test Content');
    expect(component).toBeInTheDocument();
  });

  it('should apply variant classes correctly', () => {
    render(<NewComponent variant="secondary">Test</NewComponent>);
    const component = screen.getByText('Test');
    expect(component).toHaveClass('bg-secondary');
  });

  it('should apply size classes correctly', () => {
    render(<NewComponent size="lg">Test</NewComponent>);
    const component = screen.getByText('Test');
    expect(component).toHaveClass('h-11');
  });
});
```

#### Step 4: Add to UI Index
**File**: `src/shared/ui/index.ts`

```typescript
// Add export (maintain alphabetical order)
export { NewComponent } from "./new-component";
```

### Tests to Run
```bash
npm run test          # Run component tests
npm run lint          # Check code quality
npm run build        # Verify build success
```

---

## ADD ZUSTAND STORE SLICE

### Overview
Add new state management slice to the Zustand store with persistence.

### Files to Touch
- `src/shared/store/appStore.ts` - Add slice to existing store
- `src/shared/types/common.ts` - Add type definitions (if needed)

### Dependencies to Check
- Zustand store exists (`src/shared/store/appStore.ts:24-65`)
- Persistence middleware configured
- Type definitions available

### Step-by-Step Procedure

#### Step 1: Add Types
**File**: `src/shared/types/common.ts`

```typescript
// Add new types at the end of file
export interface NewFeatureState {
  items: string[];
  loading: boolean;
  error: string | null;
}
```

#### Step 2: Extend Store Interface
**File**: `src/shared/store/appStore.ts`

```typescript
// Add to import (line ~4)
import { NewFeatureState } from '@/shared/types/common';

// Add to interface (line ~7-22)
interface AppState {
  // ... existing state
  
  // New Feature State
  newFeature: NewFeatureState;
  
  // ... existing actions
  
  // New Feature Actions
  setNewFeatureItems: (items: string[]) => void;
  setNewFeatureLoading: (loading: boolean) => void;
  setNewFeatureError: (error: string | null) => void;
  clearNewFeature: () => void;
}
```

#### Step 3: Add Initial State
**File**: `src/shared/store/appStore.ts` (in create function ~26-38)

```typescript
// Add to initial state (line ~27-38)
newFeature: {
  items: [],
  loading: false,
  error: null,
},
```

#### Step 4: Add Actions
**File**: `src/shared/store/appStore.ts` (in create function ~40-54)

```typescript
// Add actions (line ~40-54)
setNewFeatureItems: (items) => set((state) => ({
  newFeature: { ...state.newFeature, items }
})),

setNewFeatureLoading: (loading) => set((state) => ({
  newFeature: { ...state.newFeature, loading }
})),

setNewFeatureError: (error) => set((state) => ({
  newFeature: { ...state.newFeature, error }
})),

clearNewFeature: () => set((state) => ({
  newFeature: { items: [], loading: false, error: null }
})),
```

#### Step 5: Add to Persistence (Optional)
**File**: `src/shared/store/appStore.ts` (partialize function ~58-63)

```typescript
partialize: (state) => ({
  // ... existing persisted state
  newFeature: state.newFeature, // Add if should persist
}),
```

#### Step 6: Use in Components
**Usage Example**:

```typescript
import { useAppStore } from '@/shared/store/appStore';

const MyComponent = () => {
  const { 
    newFeature, 
    setNewFeatureItems, 
    setNewFeatureLoading 
  } = useAppStore();

  const handleLoadItems = async () => {
    setNewFeatureLoading(true);
    try {
      const items = await fetchItems();
      setNewFeatureItems(items);
    } catch (error) {
      setNewFeatureError(error.message);
    } finally {
      setNewFeatureLoading(false);
    }
  };

  return (
    <div>
      {newFeature.loading && <div>Loading...</div>}
      {newFeature.error && <div>Error: {newFeature.error}</div>}
      {newFeature.items.map(item => <div key={item}>{item}</div>)}
    </div>
  );
};
```

### Tests to Run
```bash
npx tsc --noEmit      # Type check
npm run lint          # Code quality
npm run build        # Build verification
```

---

## CREATE FORM WITH VALIDATION

### Overview
Create a form using React Hook Form + Zod validation following existing patterns.

### Files to Touch
- `src/shared/types/forms.ts` - Add Zod schema
- `src/shared/modal/{FormName}.tsx` - Form component
- `src/shared/modal/index.ts` - Add export

### Dependencies to Check
- React Hook Form installed (`package.json:58`)
- Zod validation installed (`package.json:68`)
- Form resolver available (`@hookform/resolvers`)

### Step-by-Step Procedure

#### Step 1: Add Zod Schema
**File**: `src/shared/types/forms.ts`

```typescript
// Add schema (follow B2BFormSchema pattern line ~4-19)
export const NewFormSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  category: z.enum(['option1', 'option2', 'option3']),
  message: z.string().optional(),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: 'Você deve concordar com os termos'
  }),
});

export type NewFormData = z.infer<typeof NewFormSchema>;
```

#### Step 2: Create Form Component
**File**: `src/shared/modal/NewForm.tsx`

```typescript
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Checkbox } from '@/shared/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { NewFormSchema, NewFormData } from '@/shared/types/forms';
import { useAnalytics } from '@/shared/hooks/useAnalytics';

interface NewFormProps {
  onSubmit: (data: NewFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const NewForm: React.FC<NewFormProps> = ({ onSubmit, onCancel, loading = false }) => {
  const { trackEvent } = useAnalytics();
  
  const form = useForm<NewFormData>({
    resolver: zodResolver(NewFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      category: 'option1',
      message: '',
      agreeTerms: false,
    },
  });

  const handleSubmit = (data: NewFormData) => {
    trackEvent('form_submit', {
      form_type: 'new_form',
      category: data.category,
    });
    
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome *</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input type="email" placeholder="seu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="option1">Opção 1</SelectItem>
                  <SelectItem value="option2">Opção 2</SelectItem>
                  <SelectItem value="option3">Opção 3</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="agreeTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Concordo com os termos e condições *
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NewForm;
```

#### Step 3: Add Export
**File**: `src/shared/modal/index.ts`

```typescript
// Add export (maintain alphabetical order)
export { default as NewForm } from './NewForm';
```

#### Step 4: Use Form in Modal
**Usage Example**:

```typescript
import NewForm from '@/shared/modal/NewForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';

const MyModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: NewFormData) => {
    setLoading(true);
    try {
      // Process form submission
      await submitForm(data);
      setIsOpen(false);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Form</DialogTitle>
        </DialogHeader>
        <NewForm
          onSubmit={handleSubmit}
          onCancel={() => setIsOpen(false)}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
};
```

### Tests to Run
```bash
npm run test          # Test form validation
npm run lint          # Code quality check
npx tsc --noEmit      # Type checking
```

---

## MINIMUM VIABILITY CHECKS

### Before Committing Changes
1. **Linting**: `npm run lint` passes without errors
2. **Type Check**: `npx tsc --noEmit` passes without errors  
3. **Build**: `npm run build` completes successfully
4. **Tests**: `npm run test` passes for affected components

### Code Quality Gates
- All imports resolve correctly
- TypeScript strict mode compliance
- Consistent naming conventions
- Proper error handling
- Analytics tracking (where applicable)

### Performance Considerations
- Lazy loading for new routes
- Proper chunk assignment in `vite.config.ts`
- Image optimization for media assets
- Bundle size impact analysis

---

## ROLLBACK PROCEDURES

### Quick Rollback Steps
1. **Git Reset**: `git reset --hard HEAD~1` (if committed)
2. **File Deletion**: Remove created files manually
3. **Import Cleanup**: Remove import statements
4. **Build Verification**: Run `npm run build` to ensure stability

### Common Rollback Scenarios
- **Route Addition**: Remove from `AppRoutes.tsx`, delete feature directory
- **Component Creation**: Remove component files, clean up imports
- **Store Changes**: Revert store modifications, check persistence impact
- **Form Addition**: Remove schema, component, and usage references

### Recovery Testing
After rollback, verify:
- Application starts without errors
- All existing routes work
- No broken imports or dependencies
- Build and test commands pass