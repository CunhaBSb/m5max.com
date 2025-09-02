# COMPONENT REGISTRY - M5 MAX

> **Purpose**: Complete UI component catalog with usage examples, props interfaces, and variant systems.

## OVERVIEW

**Component System**: shadcn/ui with custom M5 Max theming  
**Total Components**: 45+ UI components  
**Base Framework**: Radix UI primitives with Tailwind CSS styling  
**Configuration**: `components.json:1-20` - Default style, TypeScript enabled  
**Import Pattern**: Direct imports (`import { Button } from '@shared/ui/button'`)

## COMPONENT CATEGORIES

### Core Interactive Components
- [Button](#button) - Primary actions with M5 Max themed variants
- [Input](#input) - Text input with validation styling
- [Select](#select) - Dropdown selection with Radix UI
- [Checkbox](#checkbox) - Form checkboxes with custom styling
- [Switch](#switch) - Toggle switches
- [Slider](#slider) - Range input controls

### Layout & Structure  
- [Card](#card) - Content containers with sections
- [Separator](#separator) - Visual dividers
- [Aspect Ratio](#aspect-ratio) - Responsive media containers
- [Scroll Area](#scroll-area) - Custom scrollable regions
- [Sheet](#sheet) - Side panels and overlays

### Navigation & Menus
- [Navigation Menu](#navigation-menu) - Complex menu systems with variants
- [Dropdown Menu](#dropdown-menu) - Context menus
- [Context Menu](#context-menu) - Right-click menus
- [Menubar](#menubar) - Application menu bars
- [Tabs](#tabs) - Tabbed interfaces

### Feedback & Status
- [Toast](#toast) - Notification system with Sonner
- [Alert Dialog](#alert-dialog) - Modal confirmations
- [Progress](#progress) - Progress indicators  
- [Skeleton](#skeleton) - Loading placeholders
- [Badge](#badge) - Status indicators with variants

### Form Components
- [Form](#form) - React Hook Form integration
- [Label](#label) - Form field labels
- [Textarea](#textarea) - Multi-line text input
- [Radio Group](#radio-group) - Single selection groups
- [Input OTP](#input-otp) - One-time password inputs

### Media & Rich Content
- [Dialog](#dialog) - Modal dialogs
- [Popover](#popover) - Floating content panels
- [Hover Card](#hover-card) - Hover-triggered content
- [Tooltip](#tooltip) - Contextual help text
- [Accordion](#accordion) - Collapsible content sections
- [Collapsible](#collapsible) - Simple show/hide content

### Custom M5 Max Components
- [Video Player](#video-player) - Custom video component
- [Video Player Simple](#video-player-simple) - Minimal video player
- [YouTube Embed](#youtube-embed) - YouTube video integration
- [Optimized Image](#optimized-image) - Performance-optimized images

---

## COMPONENT DETAILS

### Button

**File**: `src/shared/ui/button.tsx:1-25`  
**Variants File**: `src/shared/ui/button.variants.ts:3-37`  
**Test File**: `src/shared/ui/button.test.tsx:1-25`

#### Props Interface
```typescript
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}
```

#### Variants (`button.variants.ts:7-23`)
```typescript
variant: {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
  
  // M5 Max Custom Variants
  fire: "gradient-fire text-white shadow-fire hover:scale-105 transition-bounce font-semibold",
  tech: "gradient-tech text-white shadow-tech hover:shadow-lg transition-smooth",
  hero: "bg-fire-orange text-white shadow-fire hover:bg-fire-red hover:shadow-lg hover:scale-105 transition-bounce font-bold",
  whatsapp: "bg-green-500 text-white hover:bg-green-600 shadow-elegant transition-smooth",
  cta: "bg-fire-red text-white shadow-fire hover:bg-fire-orange hover:scale-105 transition-bounce font-semibold"
}
```

#### Size Options (`button.variants.ts:24-30`)
```typescript
size: {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-12 rounded-lg px-8 text-base",
  xl: "h-14 rounded-lg px-10 text-lg",
  icon: "h-10 w-10",
}
```

#### Usage Examples
```typescript
// Basic usage
<Button>Click me</Button>

// M5 Max themed variants
<Button variant="fire">Fire Effect</Button>
<Button variant="hero" size="lg">Hero CTA</Button>
<Button variant="whatsapp" size="sm">WhatsApp</Button>

// With icon (using asChild)
<Button variant="cta" size="xl" asChild>
  <a href="/contact">Get Started</a>
</Button>
```

#### Tests (`button.test.tsx:5-25`)
- Default props rendering
- Variant class application
- Size class application
- Accessibility compliance

---

### Card

**File**: `src/shared/ui/card.tsx:1-80`

#### Component Structure
```typescript
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>
const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>
const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>
const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>
```

#### Base Styling (`card.tsx:12`)
```typescript
className={cn(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  className
)}
```

#### Usage Example
```typescript
<Card className="w-96">
  <CardHeader>
    <CardTitle>Event Package</CardTitle>
    <CardDescription>Professional fireworks show</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Complete package with synchronized music and safety protocols.</p>
  </CardContent>
  <CardFooter className="flex justify-between">
    <Button variant="outline">More Info</Button>
    <Button variant="fire">Book Now</Button>
  </CardFooter>
</Card>
```

---

### Input

**File**: `src/shared/ui/input.tsx:1-23`

#### Props Interface
```typescript
React.ComponentProps<"input">
```

#### Base Styling (`input.tsx:10-13`)
```typescript
className={cn(
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  className
)}
```

#### Usage Examples
```typescript
// Basic input
<Input type="text" placeholder="Enter your name" />

// Email input
<Input type="email" placeholder="seu@email.com" />

// With form integration
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input placeholder="seu@email.com" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

---

### Badge

**File**: `src/shared/ui/badge.tsx:1-35`  
**Variants File**: `src/shared/ui/badge.variants.ts:3-22`

#### Variants (`badge.variants.ts:7-15`)
```typescript
variant: {
  default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
  secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
  destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
  outline: "text-foreground",
}
```

#### Base Styling (`badge.variants.ts:4`)
```typescript
"inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
```

#### Usage Examples
```typescript
<Badge>New</Badge>
<Badge variant="secondary">Featured</Badge>
<Badge variant="destructive">Sold Out</Badge>
<Badge variant="outline">Limited</Badge>
```

---

### Dialog

**File**: `src/shared/ui/dialog.tsx:1-120`

#### Component Structure (Radix UI Based)
```typescript
const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close
const DialogOverlay = React.forwardRef<...>
const DialogContent = React.forwardRef<...>
const DialogHeader = ({ className, ...props })
const DialogFooter = ({ className, ...props })
const DialogTitle = React.forwardRef<...>
const DialogDescription = React.forwardRef<...>
```

#### Overlay Styling (`dialog.tsx:22`)
```typescript
className={cn(
  "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  className
)}
```

#### Usage Example
```typescript
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button variant="fire">Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Fireworks Package</DialogTitle>
      <DialogDescription>
        Select your perfect fireworks show package
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      {/* Dialog content */}
    </div>
    <DialogFooter>
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button variant="cta">Book Now</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### Form

**File**: `src/shared/ui/form.tsx:1-200`

#### Key Components
```typescript
const Form = FormProvider // React Hook Form provider
const FormField = <TFieldValues extends FieldValues = FieldValues, ...>
const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>
const FormLabel = React.forwardRef<...>
const FormControl = React.forwardRef<...>
const FormDescription = React.forwardRef<...>
const FormMessage = React.forwardRef<...>
```

#### Integration Pattern
Works seamlessly with React Hook Form and Zod validation.

#### Usage Example (From Development Playbooks)
```typescript
const form = useForm<FormData>({
  resolver: zodResolver(FormSchema),
  defaultValues: { /* ... */ },
});

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="fieldName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Field Label</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormDescription>Field help text</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

---

### Navigation Menu

**File**: `src/shared/ui/navigation-menu.tsx:1-200`  
**Variants File**: `src/shared/ui/navigation-menu.variants.ts:1-30`

#### Complex component with multiple sub-components for advanced navigation.

---

### Toggle

**File**: `src/shared/ui/toggle.tsx:1-40`  
**Variants File**: `src/shared/ui/toggle.variants.ts:1-25`

#### Advanced toggle component with variant system for different states and styles.

---

## CUSTOM M5 MAX COMPONENTS

### Video Player

**File**: `src/shared/ui/video-player.tsx`

#### Purpose
Advanced video player with M5 Max branding and controls.

### Video Player Simple

**File**: `src/shared/ui/video-player-simple.tsx`

#### Purpose
Minimal video player for lightweight usage.

### YouTube Embed

**File**: `src/shared/ui/youtube-embed.tsx`

#### Purpose
Optimized YouTube video embedding with lazy loading.

### Optimized Image

**File**: `src/shared/ui/optimized-image.tsx`

#### Purpose
Performance-optimized image component with lazy loading and responsive sizing.

---

## LAZY LOADING SYSTEM

### Lazy UI Components

**File**: `src/shared/ui/lazy-ui.tsx:1-50`

#### Purpose
Lazy loading system for UI components to improve initial bundle size.

#### Pattern
```typescript
const LazyComponent = lazy(() => import('./heavy-component'));

<Suspense fallback={<Skeleton />}>
  <LazyComponent />
</Suspense>
```

---

## VARIANT SYSTEM

### Class Variance Authority Integration

**Dependencies**: `class-variance-authority` (`package.json:45`)  
**Utility**: `cn()` function from `src/shared/lib/utils.ts:4`

#### Pattern
```typescript
import { cva, type VariantProps } from "class-variance-authority";

export const componentVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "default-classes",
        custom: "custom-classes"
      },
      size: {
        sm: "small-classes",
        lg: "large-classes"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "sm"
    }
  }
);
```

---

## TESTING PATTERNS

### Component Testing Structure

**Framework**: Vitest + Testing Library  
**Test Files**: `*.test.tsx` in component directory  
**Setup**: `src/setupTests.ts:1-2`

#### Test Template
```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ComponentName } from './component-name';

describe('ComponentName', () => {
  it('should render with default props', () => {
    render(<ComponentName>Test Content</ComponentName>);
    const element = screen.getByText('Test Content');
    expect(element).toBeInTheDocument();
  });

  it('should apply variant classes correctly', () => {
    render(<ComponentName variant="custom">Test</ComponentName>);
    const element = screen.getByText('Test');
    expect(element).toHaveClass('custom-class');
  });
});
```

---

## COMPONENT USAGE PATTERNS

### M5 Max Theme Integration

#### Fire-themed Components
```typescript
<Button variant="fire">Spectacular Show</Button>
<Button variant="hero" size="lg">Book Your Event</Button>
<Button variant="cta">Get Quote</Button>
```

#### Professional Business Components
```typescript
<Button variant="tech">Technical Details</Button>
<Card className="shadow-elegant">
  <CardHeader>
    <CardTitle>Professional Service</CardTitle>
  </CardHeader>
</Card>
```

#### WhatsApp Integration
```typescript
<Button variant="whatsapp" onClick={openWhatsApp}>
  Contact via WhatsApp
</Button>
```

### Responsive Design Patterns

#### Mobile-First Approach
```typescript
<Button 
  size="sm"           // Mobile default
  className="md:h-11 md:px-8"  // Desktop override
>
  Responsive Button
</Button>
```

#### Platform-Specific Components
```typescript
// Desktop version
<Card className="p-6 shadow-lg">
  <Button variant="fire" size="lg">Desktop CTA</Button>
</Card>

// Mobile version  
<Card className="p-4">
  <Button variant="fire" size="sm">Mobile CTA</Button>
</Card>
```

---

## ACCESSIBILITY FEATURES

### Built-in Accessibility

**Focus Management**: All components include focus-visible styling  
**ARIA Labels**: Radix UI primitives include proper ARIA attributes  
**Keyboard Navigation**: Full keyboard support for interactive components  
**Screen Reader Support**: Semantic HTML and proper labeling

#### Example Accessibility Implementation
```typescript
<Button
  variant="cta"
  aria-label="Book fireworks show for your event"
  className="focus-visible:ring-2 focus-visible:ring-fire-orange"
>
  Book Now
</Button>
```

---

## PERFORMANCE CONSIDERATIONS

### Bundle Impact Analysis

**Manual Chunks** (`vite.config.ts:22`): UI components split into `ui-vendor` chunk  
**Tree Shaking**: Individual component imports prevent unused code  
**Lazy Loading**: Heavy components deferred until needed

#### Import Optimization
```typescript
// Good: Tree-shakeable import
import { Button } from '@shared/ui/button';

// Avoid: Barrel import (not used due to index.ts configuration)
import { Button } from '@shared/ui';
```

### Runtime Performance

**React.memo**: Used where appropriate for expensive re-renders  
**forwardRef**: All components properly forward refs  
**Event Handlers**: Optimized with useCallback where needed

---

## MAINTENANCE GUIDELINES

### Adding New Components

1. **Create Component**: Follow existing patterns with forwardRef
2. **Add Variants**: Create `.variants.ts` if styling variations needed
3. **Write Tests**: Create `.test.tsx` with comprehensive coverage
4. **Update Registry**: Add to this documentation
5. **Integration**: Test with existing components

### Updating Existing Components

1. **Backward Compatibility**: Maintain existing prop interfaces
2. **Variant Addition**: Extend variants without breaking existing usage
3. **Test Updates**: Update tests for new functionality
4. **Documentation**: Update usage examples and prop documentation

### Component Deprecation

1. **Migration Guide**: Document replacement component
2. **Gradual Removal**: Mark as deprecated with console warnings
3. **Usage Audit**: Search codebase for usage before removal
4. **Version Planning**: Remove in major version updates only