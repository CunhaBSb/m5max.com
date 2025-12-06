import { lazy, ComponentType, LazyExoticComponent } from 'react';
import { useIsDesktop } from '@/shared/hooks/useIsDesktop';
import { SuspenseTransition } from '../SuspenseTransition';

interface ConditionalLazyProps {
  /**
   * Desktop component factory (lazy import)
   * Example: () => import('../desktop/Home')
   */
  desktopLoader: () => Promise<{ default: ComponentType<unknown> }>;

  /**
   * Mobile component factory (lazy import)
   * Example: () => import('../mobile/Home')
   */
  mobileLoader: () => Promise<{ default: ComponentType<unknown> }>;

  /**
   * Loading fallback shown while chunk loads
   */
  fallback: React.ReactNode;
}

/**
 * Conditionally lazy loads desktop OR mobile component based on viewport.
 * Only loads the chunk that's actually needed - eliminates dual loading states.
 *
 * Platform detection happens synchronously BEFORE lazy loading starts,
 * so we show ONE consistent loading screen during chunk fetch.
 *
 * @example
 * ```tsx
 * <ConditionalLazy
 *   desktopLoader={() => import('../desktop/Home')}
 *   mobileLoader={() => import('../mobile/Home')}
 *   fallback={<PageLoading />}
 * />
 * ```
 */
export const ConditionalLazy = ({
  desktopLoader,
  mobileLoader,
  fallback
}: ConditionalLazyProps) => {
  const isDesktop = useIsDesktop();

  // Lazy load ONLY the component we need based on platform
  // This happens after platform detection, so no flash
  const Component: LazyExoticComponent<ComponentType<unknown>> = isDesktop
    ? lazy(desktopLoader)
    : lazy(mobileLoader);

  return (
    <SuspenseTransition fallback={fallback}>
      <Component />
    </SuspenseTransition>
  );
};
