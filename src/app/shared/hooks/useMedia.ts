import { useState, useEffect } from 'react';

export const useMedia = (query: string): boolean | null => {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    
    const handleChange = () => {
      setMatches(mediaQuery.matches);
    };

    // Set initial value
    handleChange();
    
    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
};

// Predefined hooks for common breakpoints
export const useIsMobile = () => useMedia('(max-width: 767px)');
export const useIsTablet = () => useMedia('(min-width: 768px) and (max-width: 1023px)');
export const useIsDesktop = () => useMedia('(min-width: 1024px)');
export const useIsLargeDesktop = () => useMedia('(min-width: 1280px)');

// Screen orientation
export const useIsPortrait = () => useMedia('(orientation: portrait)');
export const useIsLandscape = () => useMedia('(orientation: landscape)');

// Accessibility
export const usePrefersReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)');
export const usePrefersDarkMode = () => useMedia('(prefers-color-scheme: dark)');