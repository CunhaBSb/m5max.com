// Layout Components Export
export { default as Header } from './Header';
export { default as Footer } from './Footer';
export { default as DifferentialsSection } from './DifferentialsSection';
export { default as SectionSeparator } from './SectionSeparator';
export { default as LazySection } from './LazySection';
export { PlatformSwitch } from './switchers/PlatformSwitch';

// Desktop implementations
export { default as FAQDesktop } from './desktop/FAQ';
export { default as ServicesDesktop } from './desktop/Services';
export { default as FogosM5CompleteDesktop } from './desktop/FogosM5Complete';
export { default as FooterDesktop } from './desktop/Footer';
export { DesktopHeader } from './desktop/Header';

// Mobile implementations
export { default as FAQMobile } from './mobile/FAQ';
export { default as ServicesMobile } from './mobile/Services';
export { default as FogosM5CompleteMobile } from './mobile/FogosM5Complete';
export { default as FooterMobile } from './mobile/Footer';
export { MobileHeader } from './mobile/Header';

// Lazy loading system
export * from './lazy-layout';