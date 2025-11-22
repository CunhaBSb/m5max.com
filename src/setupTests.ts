// Vitest setup for jsdom environment
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Ensure dataLayer/gtag/fbq exist for analytics-related tests
if (typeof window !== 'undefined') {
  if (!('dataLayer' in window)) {
    // @ts-expect-error - jsdom window typing
    window.dataLayer = [];
  }
  // @ts-expect-error - jsdom window typing
  window.gtag = window.gtag || vi.fn();
  // @ts-expect-error - jsdom window typing
  window.fbq = window.fbq || vi.fn();

  // matchMedia polyfill used by useIsDesktop
  if (!('matchMedia' in window)) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }),
    });
  }
}

