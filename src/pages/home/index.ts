// src/pages/home/index.ts

// Main page container with PlatformSwitch integration
export { default as Home } from './HomePage';

// Desktop specific exports
export { default as HomeDesktop } from './desktop/Home';
export { default as Hero } from './desktop/components/Hero';
export { default as Portfolio } from './desktop/components/Services'; // Mudança aqui - agora exporta Portfolio
export { default as FAQ } from './desktop/components/FAQ';

// Mobile specific exports
export { default as HomeMobile } from './mobile/Home';