# CONTEXT MAP - M5 MAX REPOSITORY

> **Purpose**: Master inventory of project context with source-referenced facts to eliminate hallucinations and accelerate development.

## PROJECT OVERVIEW

**Location**: `/home/cunha/m5max`  
**Repository**: Git repository (main branch)  
**Type**: React SPA with bifurcated desktop/mobile architecture  
**Package**: `vite_react_shadcn_ts` - `package.json:2`

## ENTRY POINTS & BOOTSTRAP

### Main Application Flow
- **Entry Point**: `src/main.tsx` → renders App component
- **Root Component**: `src/App.tsx:4-8` → wraps AppRoutes with AppProviders
- **Router**: `src/app/router/AppRoutes.tsx:6-14` → defines route structure
- **Layout**: `src/app/layouts/RootLayout.tsx` → base application layout

### Route Definitions
```typescript
// src/app/router/AppRoutes.tsx:8-12
<Route path="/" element={<HomePage />} />           // Home page
<Route path="/reveillon" element={<ReveillonPage />} />  // Reveillon feature
<Route path="*" element={<NotFound />} />           // 404 handler
```

## ARCHITECTURE PATTERNS

### Bifurcated Desktop/Mobile System
**Pattern Source**: `CLAUDE.md:15-27`

**Structure**:
```
src/features/<feature>/
├── pages/FeaturePage.tsx     // Lazy loading + Suspense container
├── desktop/Feature.tsx       // Desktop implementation  
├── mobile/Feature.tsx        // Mobile implementation
└── components/               // Platform-specific components
```

**Implementation Examples**:
- Home: `src/features/home/pages/HomePage.tsx:1-40`
- Reveillon: `src/features/reveillon/pages/ReveillonPage.tsx`

### Platform Detection System
**Hook**: `src/shared/hooks/useIsDesktop.ts:5-27`
- **Breakpoint**: 1024px (`useIsDesktop.ts:3`)
- **SSR Safety**: Returns `null` during hydration (`useIsDesktop.ts:6`)
- **Switch Component**: `src/shared/PlatformSwitch.tsx:11-26`

### Lazy Loading Strategy
**Pattern**: All page components use React.lazy() + Suspense
```typescript
// src/features/home/pages/HomePage.tsx:5-6
const HomeDesktop = lazy(() => import('../desktop/Home'));
const HomeMobile = lazy(() => import('../mobile/Home'));
```

**Loading Components**: 
- Page-level: `HomePage.tsx:9-19` (M5 logo spinner)
- Platform-level: `PlatformSwitch.tsx:16-23` (fire-orange spinner)

## TECHNOLOGY STACK

### Core Framework (`package.json:54-69`)
- **React**: 18.3.1 (with React DOM)
- **TypeScript**: 5.8.3 (strict mode)
- **Vite**: 5.4.19 (with SWC plugin)
- **Router**: react-router-dom 6.30.1

### UI Framework (`package.json:17-43`)
- **Component System**: Radix UI (complete suite)
- **Styling**: Tailwind CSS 3.4.17
- **Component Library**: shadcn/ui pattern
- **Theme**: next-themes 0.4.6
- **Icons**: lucide-react 0.462.0 + react-icons 5.5.0

### State Management (`package.json:69`)
- **Store**: Zustand 5.0.8
- **Implementation**: `src/shared/store/appStore.ts:24-65`
- **Features**: Persistence middleware, consent management, attribution tracking

### Forms & Validation
- **Forms**: react-hook-form 7.61.1
- **Validation**: Zod 3.25.76
- **Integration**: @hookform/resolvers 3.10.0
- **Schema**: `src/shared/types/forms.ts:4-37`

### Development Tools (`package.json:71-94`)
- **Build**: Vite + SWC (fast compilation)
- **Linting**: ESLint 9.32.0 + TypeScript ESLint
- **Testing**: Vitest 3.2.4 + Testing Library
- **Environment**: jsdom 26.1.0

## FILE ORGANIZATION

### Import Aliases (`vite.config.ts:46-51`)
```typescript
'@app/*'      → 'src/app/*'      // App-level routing and providers
'@features/*' → 'src/features/*' // Feature-specific modules  
'@shared/*'   → 'src/shared/*'   // Shared components and utilities
'@/*'         → 'src/*'          // General src imports
```

### Directory Structure
```
src/
├── app/                    // Application-level configuration
│   ├── layouts/           // Base layouts
│   ├── providers/         // Context providers, analytics
│   └── router/           // Route definitions
├── features/             // Feature-based modules
│   ├── home/            // Homepage feature
│   └── reveillon/       // Reveillon feature  
└── shared/              // Shared resources
    ├── hooks/           // Custom React hooks
    ├── lib/            // Utility functions
    ├── store/          // Zustand state management
    ├── types/          // TypeScript type definitions
    └── ui/             // shadcn/ui component system
```

## KEY COMPONENTS & SYSTEMS

### UI Component System (`src/shared/ui/`)
**Pattern**: shadcn/ui component library
- **Registry**: `src/shared/ui/index.ts` (barrel exports)
- **Variants**: `.variants.ts` files for component styling
- **Testing**: Basic tests for Button component (`button.test.tsx:1-25`)

**Key Components**:
- Button system with variants (`button.tsx` + `button.variants.ts`)
- Form components (input, select, checkbox, etc.)
- Layout components (card, separator, skeleton)
- Interactive components (dialog, popover, dropdown-menu)

### State Management (`src/shared/store/appStore.ts`)
**Architecture**: Single Zustand store with persistence
```typescript
// src/shared/store/appStore.ts:7-22
interface AppState {
  // Attribution & Analytics
  attribution: AttributionData | null;
  consent: ConsentState;
  // UI State  
  conversionModalOpen: boolean;
  currentAudience: AudienceType;
}
```

**Features**:
- **Persistence**: localStorage with selective state (`appStore.ts:57-63`)
- **Consent Management**: GDPR-compliant analytics consent
- **Attribution Tracking**: UTM and conversion tracking
- **Modal State**: Global conversion modal management

### Type System (`src/shared/types/`)
**Organization**: 
- `common.ts`: Base interfaces and shared types
- `forms.ts`: Zod schemas and form-related types  
- `analytics.ts`: Analytics and tracking types

**Key Types**:
- `AudienceType`: 'b2b' | 'general' (`common.ts:20`)
- `ConversionSource`: Tracks modal/conversion origins (`common.ts:22`)
- `B2BFormSchema`: Complete form validation (`forms.ts:4-19`)

## BUILD & OPTIMIZATION

### Manual Chunk Strategy (`vite.config.ts:17-41`)
**Optimization**: 7 strategic chunks for optimal loading
- **react-vendor**: Core React libraries
- **ui-vendor**: Most-used Radix UI components
- **form-vendor**: Form handling libraries
- **icons-vendor**: Icon libraries  
- **media-vendor**: Media components (lazy loaded)
- **utils-vendor**: Utility libraries
- **modal-vendor**: On-demand modal components

### Development Scripts (`package.json:7-13`)
- **Development**: `npm run dev` (Vite server on :5173)
- **Production**: `npm run build` 
- **Development Build**: `npm run build:dev` (with debugging)
- **Linting**: `npm run lint` (ESLint)
- **Testing**: `npm run test` (Vitest), `npm run test:ui` (Vitest UI)

### Type Checking
**Command**: `npx tsc --noEmit` (TypeScript without emit)
**Configuration**: 
- `tsconfig.json`: Main TypeScript config
- `tsconfig.app.json`: App-specific settings
- `tsconfig.node.json`: Node/Vite configuration

## TESTING STRATEGY

### Current Coverage
**Existing Tests**:
- `src/shared/ui/button.test.tsx`: Button component tests
- `src/shared/hooks/useIsDesktop.test.ts`: Platform detection tests
- `src/shared/lib/utils.test.ts`: Utility function tests

### Testing Configuration (`vite.config.ts:58-63`)
```typescript
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: './src/setupTests.ts',
  css: true,
}
```

**Dependencies**:
- **Framework**: Vitest 3.2.4 with UI
- **Rendering**: Testing Library React 16.3.0
- **Environment**: jsdom 26.1.0
- **Matchers**: @testing-library/jest-dom 6.8.0

## SPA CONFIGURATION

### Deployment Setup
- **Vercel**: `vercel.json` with client-side routing rewrites
- **Netlify**: `public/_redirects` for fallback routing
- **Pattern**: All routes redirect to `/index.html` with 200 status

### Service Worker
**Implementation**: `src/shared/utils/service-worker.ts`
**Public Files**: `public/sw.js`, `public/manifest.json`

## DEVELOPMENT WORKFLOW

### Code Quality Gates
1. **Linting**: ESLint with React hooks and refresh plugins
2. **Type Checking**: TypeScript strict mode with additional checks  
3. **Testing**: Vitest for unit tests with UI option
4. **Build Verification**: Production build before commits

### Conventions (`CLAUDE.md:82-91`)
- **Desktop-first**: Implement desktop version first, then mobile
- **Lazy Loading**: All page components with Suspense
- **Shared Components**: Only truly universal elements in `src/shared/`
- **Source References**: All facts must include `file:line` or be marked `UNKNOWN`

---

## ANTI-HALLUCINATION PROTOCOL

**Rule**: Every architectural claim in this document is backed by source code reference (`file:line`) or marked as `UNKNOWN → TODO`. No speculation allowed.

**Verification**: All patterns, configurations, and decisions reference actual implementation files.

**Update Policy**: This document must be updated when architectural changes are made to maintain accuracy.