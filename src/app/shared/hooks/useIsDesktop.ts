import { useState, useEffect } from 'react';

const DESKTOP_BREAKPOINT = 1024;

export const useIsDesktop = (): boolean | null => {
  // null = SSR/unknown, boolean = resolved
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    // SSR-safe: only run on client
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    
    const handleChange = () => {
      setIsDesktop(mediaQuery.matches);
    };

    // Set initial value
    handleChange();
    
    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return isDesktop;
};