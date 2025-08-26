import { useEffect, useRef } from 'react';
import { useAnalytics } from './useAnalytics';

interface UseScrollTrackingOptions {
  trackDepths?: number[];
  throttleMs?: number;
}

export const useScrollTracking = ({
  trackDepths = [25, 50, 75, 100],
  throttleMs = 250
}: UseScrollTrackingOptions = {}) => {
  const { trackScrollDepth } = useAnalytics();
  const trackedDepths = useRef(new Set<number>());
  const throttleRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleScroll = () => {
      // Throttle scroll events
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
      }

      throttleRef.current = setTimeout(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = (scrollTop / documentHeight) * 100;

        trackDepths.forEach(depth => {
          if (scrollPercentage >= depth && !trackedDepths.current.has(depth)) {
            trackedDepths.current.add(depth);
            trackScrollDepth(depth as 25 | 50 | 75 | 100);
          }
        });
      }, throttleMs);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
      }
    };
  }, [trackDepths, throttleMs, trackScrollDepth]);

  // Reset tracking when component unmounts or page changes
  useEffect(() => {
    trackedDepths.current.clear();
  }, []);
};