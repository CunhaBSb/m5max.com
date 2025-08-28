
// Main page container with PlatformSwitch integration
export { default as Pyrotechnics } from './PyrotechnicsPage';

// Desktop specific exports
export { default as ShowsPageDesktop } from './desktop/ShowsPage';
export { PyroBanner } from './desktop/components/PyroBanner';
export { EventTypesGrid } from './desktop/components/EventTypesGrid';
export { StatsSection } from './desktop/components/StatsSection';
export { PyroCallToAction } from './desktop/components/PyroCallToAction';

// Mobile specific exports
export { default as ShowsPageMobile } from './mobile/ShowsPage';