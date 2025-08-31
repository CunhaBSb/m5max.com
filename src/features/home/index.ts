// src/pages/home/index.ts

// Main page container with PlatformSwitch integration
export { default as Home } from './pages/HomePage';

// Desktop specific exports
export { default as HomeDesktop } from './desktop/Home';
export { default as Hero } from './desktop/components/Hero';


// Mobile specific exports
export { default as HomeMobile } from './mobile/Home';