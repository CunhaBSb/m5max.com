import { useState, useEffect, useCallback } from 'react';

const DESKTOP_BREAKPOINT = 1024;

export const useIsDesktop = (): boolean | null => {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  const handleChange = useCallback((event: MediaQueryListEvent | MediaQueryList) => {
    setIsDesktop(event.matches);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    
    handleChange(mediaQuery);
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [handleChange]);

  return isDesktop;
};