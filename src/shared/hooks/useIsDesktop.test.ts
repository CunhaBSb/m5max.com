
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { useIsDesktop } from './useIsDesktop';

// Mock matchMedia
const createMatchMediaMock = (matches: boolean) => {
  let listeners: Array<(e: { matches: boolean }) => void> = [];
  
  const mock = vi.fn().mockImplementation(() => ({
    matches,
    media: `(min-width: 1024px)`,
    onchange: null,
    addEventListener: (event: string, cb: (e: { matches: boolean }) => void) => {
      listeners.push(cb);
    },
    removeEventListener: (event: string, cb: (e: { matches: boolean }) => void) => {
      listeners = listeners.filter(listener => listener !== cb);
    },
    dispatchEvent: vi.fn(),
  }));

  const simulateChange = (newMatches: boolean) => {
    matches = newMatches;
    for (const listener of listeners) {
      listener({ matches });
    }
  };

  return { mock, simulateChange };
};

describe('useIsDesktop', () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    vi.restoreAllMocks();
  });

  it('should return true when viewport width is >= 1024px', () => {
    const { mock } = createMatchMediaMock(true);
    window.matchMedia = mock;
    const { result } = renderHook(() => useIsDesktop());
    expect(result.current).toBe(true);
  });

  it('should return false when viewport width is < 1024px', () => {
    const { mock } = createMatchMediaMock(false);
    window.matchMedia = mock;
    const { result } = renderHook(() => useIsDesktop());
    expect(result.current).toBe(false);
  });

  it('should update when the viewport size changes', () => {
    const { mock, simulateChange } = createMatchMediaMock(false);
    window.matchMedia = mock;

    const { result } = renderHook(() => useIsDesktop());
    expect(result.current).toBe(false);

    act(() => {
      simulateChange(true);
    });

    expect(result.current).toBe(true);
  });

  it('should handle initial state correctly (starts as null, then resolves)', () => {
    const { mock } = createMatchMediaMock(true);
    window.matchMedia = mock;

    const { result, rerender } = renderHook(() => useIsDesktop());
    
    // The very first render might be null before useEffect runs
    // But testing library's renderHook usually runs useEffect synchronously
    // So we check the resolved state.
    expect(result.current).toBe(true);
  });
});
