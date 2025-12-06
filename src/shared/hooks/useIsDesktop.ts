import { useState, useEffect, useCallback } from 'react';

const DESKTOP_BREAKPOINT = 1024;

/**
 * Synchronously detects desktop vs mobile viewport.
 * Returns boolean immediately - never null.
 *
 * This hook resolves platform on first render to prevent flash of loading states.
 * Safe for SSR: defaults to mobile-first (false) if window unavailable.
 */
export const useIsDesktop = (): boolean => {
  const getInitial = (): boolean => {
    // SSR-safe: default to mobile-first approach
    if (typeof window === 'undefined') return false;

    // Synchronous detection on first render
    return window.innerWidth >= DESKTOP_BREAKPOINT;
  };

  const [isDesktop, setIsDesktop] = useState<boolean>(getInitial);

  const handleChange = useCallback((event: MediaQueryListEvent | MediaQueryList) => {
    setIsDesktop(event.matches);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);

    // Double-check on mount in case initial detection was during SSR
    setIsDesktop(mediaQuery.matches);

    // Suporte a navegadores que ainda usam addListener/removeListener
    const add = (mq: MediaQueryList, fn: (e: MediaQueryListEvent) => void) => {
      try {
        mq.addEventListener('change', fn);
      } catch {
        // @ts-expect-error legacy
        mq.addListener(fn);
      }
    };

    const remove = (mq: MediaQueryList, fn: (e: MediaQueryListEvent) => void) => {
      try {
        mq.removeEventListener('change', fn);
      } catch {
        // @ts-expect-error legacy
        mq.removeListener(fn);
      }
    };

    add(mediaQuery, handleChange as (e: MediaQueryListEvent) => void);

    return () => {
      remove(mediaQuery, handleChange as (e: MediaQueryListEvent) => void);
    };
  }, [handleChange]);

  return isDesktop;
};
