import React, { useRef, useEffect, useState } from 'react';

interface LazySectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  className?: string;
}

export const LazySection: React.FC<LazySectionProps> = ({
  children,
  fallback,
  rootMargin = '100px',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [rootMargin, hasLoaded]);

  const defaultFallback = (
    <div className="flex items-center justify-center py-20">
      <img
        src="/m5logo.svg"
        alt="Carregando..."
        className="w-12 h-12 opacity-60 animate-pulse"
        style={{ willChange: 'opacity' }}
      />
    </div>
  );

  return (
    <div ref={ref} className={className}>
      <div
        className={`
          transition-opacity duration-400 ease-in-out
          ${isVisible ? 'opacity-100' : 'opacity-0'}
        `}
      >
        {isVisible ? children : (fallback || defaultFallback)}
      </div>
    </div>
  );
};

export default LazySection;