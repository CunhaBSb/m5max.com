import React, { useState, useRef, useEffect } from 'react';

interface UseLazyImageOptions {
  rootMargin?: string;
  threshold?: number;
  placeholder?: string;
}

export const useLazyImage = (
  src: string,
  options: UseLazyImageOptions = {}
) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const {
    rootMargin = '50px',
    threshold = 0.1,
    placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlZGVkZWQiLz48L3N2Zz4='
  } = options;

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(img);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(img);

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setError('Failed to load image');
    img.src = src;
  }, [src, isInView]);

  return {
    imgRef,
    src: isLoaded ? src : placeholder,
    isLoaded,
    isInView,
    error
  };
};

// Component wrapper for easy use
interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  rootMargin?: string;
  threshold?: number;
  onLoad?: () => void;
  onError?: (error: string) => void;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className,
  placeholder,
  rootMargin,
  threshold,
  onLoad,
  onError,
  ...props
}) => {
  const { 
    imgRef, 
    src: lazySrc, 
    isLoaded, 
    error 
  } = useLazyImage(src, { placeholder, rootMargin, threshold });

  useEffect(() => {
    if (isLoaded && onLoad) {
      onLoad();
    }
  }, [isLoaded, onLoad]);

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  return React.createElement('img', {
    ref: imgRef,
    src: lazySrc,
    alt: alt,
    className: `transition-opacity duration-300 ${
      isLoaded ? 'opacity-100' : 'opacity-70'
    } ${className || ''}`,
    loading: "lazy" as const,
    ...props
  });
};