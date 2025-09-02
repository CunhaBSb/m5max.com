import { lazy } from 'react';
import { withLazyLoading } from './lazy-ui-utils';

// Lazy load heavy UI components
const LazyVideoPlayer = lazy(() => import('./video-player-optimized'));
const LazyMenubar = lazy(() => import('./menubar'));
const LazyDropdownMenu = lazy(() => import('./dropdown-menu'));
const LazyContextMenu = lazy(() => import('./context-menu'));
const LazyForm = lazy(() => import('./form'));
const LazySelect = lazy(() => import('./select'));
const LazyAlertDialog = lazy(() => import('./alert-dialog'));
const LazySheet = lazy(() => import('./sheet'));
const LazyTabs = lazy(() => import('./tabs'));
const LazyScrollArea = lazy(() => import('./scroll-area'));
const LazyToast = lazy(() => import('./toast'));
const LazyNavigationMenu = lazy(() => import('./navigation-menu'));

// Export optimized lazy components
export const VideoPlayer = withLazyLoading(LazyVideoPlayer, 'lg');
export const Menubar = withLazyLoading(LazyMenubar, 'md');
export const DropdownMenu = withLazyLoading(LazyDropdownMenu);
export const ContextMenu = withLazyLoading(LazyContextMenu);
export const Form = withLazyLoading(LazyForm);
export const Select = withLazyLoading(LazySelect);
export const AlertDialog = withLazyLoading(LazyAlertDialog, 'md');
export const Sheet = withLazyLoading(LazySheet, 'md');
export const Tabs = withLazyLoading(LazyTabs);
export const ScrollArea = withLazyLoading(LazyScrollArea);
export const Toast = withLazyLoading(LazyToast);
export const NavigationMenu = withLazyLoading(LazyNavigationMenu, 'md');

// Direct exports for components that are already lightweight
export { default as Button } from './button';
export { default as Input } from './input';
export { default as Card } from './card';
export { default as Badge } from './badge';
export { default as Avatar } from './avatar';
export { default as Slider } from './slider';
export { default as Checkbox } from './checkbox';
export { default as Dialog } from './dialog';
export { default as Textarea } from './textarea';
export { default as Label } from './label';
export { default as Switch } from './switch';
export { default as RadioGroup } from './radio-group';
export { default as Progress } from './progress';
export { default as Separator } from './separator';
export { default as Skeleton } from './skeleton';
export { default as Tooltip } from './tooltip';
export { default as Popover } from './popover';
export { default as HoverCard } from './hover-card';
export { default as Calendar } from './calendar';
export { default as Command } from './command';
export { default as AspectRatio } from './aspect-ratio';
export { default as Accordion } from './accordion';
export { default as Collapsible } from './collapsible';
export { default as Toggle } from './toggle';
export { default as ToggleGroup } from './toggle-group';
export { default as Table } from './table';
export { default as Breadcrumb } from './breadcrumb';
export { default as Drawer } from './drawer';
export { default as Sonner } from './sonner';
export { default as Resizable } from './resizable';
export { default as Sidebar } from './sidebar';

// Optimized YouTube embed for better performance
export { default as YouTubeEmbed } from './youtube-embed';
export { default as OptimizedImage } from './optimized-image';

// Re-export utility functions
// eslint-disable-next-line react-refresh/only-export-components
export * from './utils';

// Default export for convenience
export default {
  // Lazy components
  VideoPlayer,
  Menubar,
  DropdownMenu,
  ContextMenu,
  Form,
  Select,
  AlertDialog,
  Sheet,
  Tabs,
  ScrollArea,
  Toast,
  NavigationMenu,
  
  // Direct components (lightweight)
  Button: () => import('./button'),
  Input: () => import('./input'),
  Card: () => import('./card'),
  // ... other lightweight components
};