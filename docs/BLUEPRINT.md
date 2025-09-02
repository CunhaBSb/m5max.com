# Architecture Blueprint

This document outlines the core architectural patterns and standards for this project. All developers, including AI agents like Claude and Gemini, must adhere to these guidelines to maintain code quality, performance, and maintainability.

## Core Philosophy: Desktop/Mobile Bifurcated Architecture

Instead of traditional responsive design where a single component adapts to different screen sizes, this project uses a **bifurcated architecture**. This means we maintain two separate and distinct component trees for **desktop** and **mobile** platforms.

**Why?**

1.  **Maximum Performance:** Users only download the code relevant to their platform. A mobile user never downloads heavy desktop components, and vice-versa. This significantly improves initial load times.
2.  **Tailored User Experience (UX):** It allows for completely different layouts, user flows, and even logic for each platform, providing a highly optimized experience rather than a compromised one-size-fits-all solution.
3.  **Code Isolation:** Keeps platform-specific code clean and separate, making it easier to develop, debug, and maintain.

## Feature Structure Standard

All new features must follow this directory structure:

```
src/
└── features/
    └── [feature-name]/
        ├── pages/
        │   └── [FeatureName]Page.tsx  // 1. Entry Point & Platform Switcher
        │
        ├── desktop/
        │   ├── [FeatureName].tsx      // 2. Desktop-specific Page Implementation
        │   └── components/            // 3. Components used ONLY by the Desktop version
        │
        └── mobile/
            ├── [FeatureName].tsx      // 4. Mobile-specific Page Implementation
            └── components/            // 5. Components used ONLY by the Mobile version
```

### How It Works:

1.  **The Entry Point (`[FeatureName]Page.tsx`):**
    *   This is the component the router links to.
    *   Its **only job** is to act as a platform switcher.
    *   It uses the `useIsDesktop()` hook to detect the platform.
    *   It uses `React.lazy()` to dynamically import either the `desktop/[FeatureName].tsx` or `mobile/[FeatureName].tsx` component.
    *   It wraps the dynamic component in `<Suspense>` to show a loading fallback.

    **Example (`HomePage.tsx`):**
    ```tsx
    import { lazy, Suspense } from 'react';
    import { useIsDesktop } from '@/shared/hooks/useIsDesktop';

    const HomeDesktop = lazy(() => import('../desktop/Home'));
    const HomeMobile = lazy(() => import('../mobile/Home'));

    const HomePage = () => {
      const isDesktop = useIsDesktop();

      // Handles SSR safety by returning a loader until the client can determine the platform
      if (isDesktop === null) {
        return <PageLoading />;
      }

      return (
        <Suspense fallback={<PageLoading />}>
          {isDesktop ? <HomeDesktop /> : <HomeMobile />}
        </Suspense>
      );
    };

    export default HomePage;
    ```

2.  **Platform Implementations (`desktop/` and `mobile/`):**
    *   These folders contain the actual JSX, logic, and components for each specific platform.
    *   `desktop/[FeatureName].tsx` is the root component for the desktop view.
    *   `mobile/[FeatureName].tsx` is the root component for the mobile view.

3.  **Platform-Specific Components (`components/`):**
    *   Any component used *only* by the desktop version of a feature goes into `src/features/[feature-name]/desktop/components/`.
    *   Any component used *only* by the mobile version goes into `src/features/[feature-name]/mobile/components/`.

## The Golden Rule: Strict Platform Isolation

**NEVER import a component across platform boundaries.**

-   A file inside `mobile/` **MUST NOT** import anything from a `desktop/` folder.
-   A file inside `desktop/` **MUST NOT** import anything from a `mobile/` folder.

Violation of this rule breaks the architecture and defeats its performance benefits.

## Shared Code

If a component, hook, or utility is truly universal and can be used by **both** desktop and mobile without modification, it belongs in the `src/shared/` directory.

-   **`src/shared/ui/`**: For simple, universal UI primitives (e.g., `Button.tsx`, `Card.tsx`).
-   **`src/shared/hooks/`**: For hooks used across multiple features (e.g., `useAnalytics.ts`).
-   **`src/shared/lib/`**: For utility functions and libraries.

Do not create "shared" component folders inside a feature directory. If a component is shared, it should be promoted to `src/shared`.
