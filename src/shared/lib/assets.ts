interface MediaAsset {
  type: 'video' | 'image';
  src: string;
  poster?: string;
  fallback?: string;
  sources?: { src: string; type: string }[];
  alt: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
}

interface GetMediaOptions {
  isDesktop: boolean;
  preferReducedMotion?: boolean;
}

/**
 * Get hero media assets based on platform
 */
export const getHeroMedia = ({ isDesktop, preferReducedMotion = false }: GetMediaOptions): MediaAsset => {
  if (isDesktop && !preferReducedMotion) {
    return {
      type: 'video',
      src: '/assets/desktop/hero.mp4',
      poster: '/assets/desktop/hero_poster.jpg',
      fallback: '/assets/desktop/hero_fallback.webp',
      sources: [
        { src: '/assets/desktop/hero.webm', type: 'video/webm' },
        { src: '/assets/desktop/hero.mp4', type: 'video/mp4' }
      ],
      alt: 'Professional fireworks display - M5 Max Produções'
    };
  }

  return {
    type: 'image',
    src: isDesktop ? '/assets/desktop/hero_fallback.webp' : '/assets/mobile/hero_mobile.webp',
    alt: 'Professional fireworks display - M5 Max Produções',
    width: isDesktop ? 1920 : 768,
    height: isDesktop ? 1080 : 1024,
    loading: 'eager'
  };
};

/**
 * Get services media assets based on platform
 */
export const getServicesMedia = (serviceType: 'show' | 'cha' | 'kits', isDesktop: boolean): MediaAsset => {
  const basePath = isDesktop ? '/assets/desktop' : '/assets/mobile';
  const suffix = isDesktop ? '' : '_mobile';
  
  return {
    type: 'image',
    src: `${basePath}/${serviceType}${suffix}.webp`,
    alt: `${serviceType} - M5 Max Produções`,
    width: isDesktop ? 800 : 400,
    height: isDesktop ? 600 : 300,
    loading: 'lazy'
  };
};

/**
 * Get portfolio media assets based on platform
 */
export const getPortfolioMedia = (itemId: string, isDesktop: boolean): MediaAsset => {
  const basePath = isDesktop ? '/assets/desktop/portfolio' : '/assets/mobile/portfolio';
  const suffix = isDesktop ? '' : '_m';
  
  return {
    type: 'image',
    src: `${basePath}/${itemId}${suffix}.webp`,
    alt: `Portfolio item ${itemId} - M5 Max Produções`,
    width: isDesktop ? 600 : 300,
    height: isDesktop ? 400 : 200,
    loading: 'lazy'
  };
};

/**
 * Preload critical assets for faster loading
 */
export const preloadCriticalAssets = (isDesktop: boolean, preferReducedMotion = false) => {
  const heroMedia = getHeroMedia({ isDesktop, preferReducedMotion });
  
  if (typeof window === 'undefined') return;
  
  // Preload hero assets
  if (heroMedia.type === 'video' && heroMedia.poster) {
    const posterLink = document.createElement('link');
    posterLink.rel = 'preload';
    posterLink.href = heroMedia.poster;
    posterLink.as = 'image';
    document.head.appendChild(posterLink);
  } else if (heroMedia.type === 'image') {
    const imageLink = document.createElement('link');
    imageLink.rel = 'preload';
    imageLink.href = heroMedia.src;
    imageLink.as = 'image';
    document.head.appendChild(imageLink);
  }
  
  // Preload logo
  const logoLink = document.createElement('link');
  logoLink.rel = 'preload';
  logoLink.href = '/m5logo.svg';
  logoLink.as = 'image';
  document.head.appendChild(logoLink);
};

/**
 * Get optimized srcSet for responsive images
 */
export const getSrcSet = (basePath: string, filename: string, sizes: number[]): string => {
  return sizes
    .map(size => `${basePath}/${filename}_${size}w.webp ${size}w`)
    .join(', ');
};

/**
 * Get sizes attribute for responsive images
 */
export const getSizesAttribute = (isDesktop: boolean): string => {
  if (isDesktop) {
    return '(min-width: 1280px) 600px, (min-width: 1024px) 500px, 400px';
  }
  return '(min-width: 640px) 400px, 300px';
};

/**
 * Asset paths constants
 */
export const ASSET_PATHS = {
  DESKTOP: {
    HERO: '/assets/desktop',
    SERVICES: '/assets/desktop',
    PORTFOLIO: '/assets/desktop/portfolio'
  },
  MOBILE: {
    HERO: '/assets/mobile',
    SERVICES: '/assets/mobile', 
    PORTFOLIO: '/assets/mobile/portfolio'
  },
  SHARED: {
    LOGOS: '/assets/shared/logos',
    ICONS: '/assets/shared/icons'
  }
} as const;