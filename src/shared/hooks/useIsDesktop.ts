import { useState, useEffect, useCallback } from 'react';

const DESKTOP_BREAKPOINT = 1024;

export const useIsDesktop = (): boolean | null => {
  const getInitial = () => {
    if (typeof window === 'undefined') return null;
    return window.innerWidth >= DESKTOP_BREAKPOINT;
  };

  const [isDesktop, setIsDesktop] = useState<boolean | null>(getInitial);

  const handleChange = useCallback((event: MediaQueryListEvent | MediaQueryList) => {
    setIsDesktop(event.matches);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);

    // Seta imediatamente para evitar tela em branco
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
