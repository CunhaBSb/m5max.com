import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/shared/lib/utils';

interface OptimizedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  webpSrc?: string;
  fallbackSrc?: string;
  lazy?: boolean;
  quality?: number;
  className?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  webpSrc,
  fallbackSrc,
  lazy = true,
  quality = 85,
  className,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(!lazy);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || shouldLoad) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '50px' }
    );

    const currentRef = imgRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [lazy, shouldLoad]);

  // Generate optimized URLs
  const generateOptimizedSrc = (originalSrc: string, format?: string) => {
    if (originalSrc.startsWith('http')) {
      return originalSrc; // External images - no optimization
    }
    
    const basePath = originalSrc.replace(/\.[^/.]+$/, '');
    const extension = format || 'webp';
    return `${basePath}.${extension}`;
  };

  const optimizedWebpSrc = webpSrc || generateOptimizedSrc(src, 'webp');
  const optimizedFallbackSrc = fallbackSrc || src;

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setIsError(true);
  };

  return (
    <div className={cn("relative overflow-hidden", className)} ref={imgRef}>
      {shouldLoad && (
        <picture>
          {/* WebP source for modern browsers */}
          <source srcSet={optimizedWebpSrc} type="image/webp" />
          
          {/* Fallback image */}
          <img
            src={optimizedFallbackSrc}
            alt={alt}
            width={width}
            height={height}
            loading={lazy ? 'lazy' : 'eager'}
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              "transition-opacity duration-300",
              isLoaded ? "opacity-100" : "opacity-0",
              "w-full h-full object-cover"
            )}
            {...props}
          />
        </picture>
      )}
      
      {/* Loading placeholder */}
      {!isLoaded && shouldLoad && !isError && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {/* Error fallback */}
      {isError && (
        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center text-slate-500 text-sm">
          Failed to load image
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;