import { lazy } from 'react';
import { withLayoutLoading } from './lazy-layout-utils';

// Desktop-specific lazy components
export const LazyServicesDesktop = withLayoutLoading(lazy(() => import('./desktop/Services')));
export const LazyFAQDesktop = withLayoutLoading(lazy(() => import('./desktop/FAQ')));
export const LazyFogosM5CompleteDesktop = withLayoutLoading(lazy(() => import('./desktop/FogosM5Complete')));

// Mobile-specific lazy components  
export const LazyServicesMobile = withLayoutLoading(lazy(() => import('./mobile/Services')));
export const LazyFAQMobile = withLayoutLoading(lazy(() => import('./mobile/FAQ')));
export const LazyFogosM5CompleteMobile = withLayoutLoading(lazy(() => import('./mobile/FogosM5Complete')));