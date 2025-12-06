import { render, screen } from '@testing-library/react';
import { PlatformSwitch } from './PlatformSwitch';
import { useIsDesktop } from '@/shared/hooks/useIsDesktop';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the useIsDesktop hook
vi.mock('@/shared/hooks/useIsDesktop');
const mockUseIsDesktop = vi.mocked(useIsDesktop);

/**
 * PlatformSwitch Tests (Updated for new behavior)
 *
 * Note: PlatformSwitch is now deprecated for lazy-loaded pages.
 * Use ConditionalLazy instead for page-level components.
 *
 * PlatformSwitch should only be used for non-lazy components like Header, Footer.
 * useIsDesktop() now returns boolean (never null), so no loading states.
 */
describe('PlatformSwitch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const desktopContent = <div data-testid="desktop-content">Desktop Component</div>;
  const mobileContent = <div data-testid="mobile-content">Mobile Component</div>;

  it('renders desktop content when isDesktop is true', () => {
    mockUseIsDesktop.mockReturnValue(true);

    render(
      <PlatformSwitch
        desktop={desktopContent}
        mobile={mobileContent}
      />
    );

    expect(screen.getByTestId('desktop-content')).toBeInTheDocument();
    expect(screen.queryByTestId('mobile-content')).not.toBeInTheDocument();
  });

  it('renders mobile content when isDesktop is false', () => {
    mockUseIsDesktop.mockReturnValue(false);

    render(
      <PlatformSwitch
        desktop={desktopContent}
        mobile={mobileContent}
      />
    );

    expect(screen.getByTestId('mobile-content')).toBeInTheDocument();
    expect(screen.queryByTestId('desktop-content')).not.toBeInTheDocument();
  });

  it('handles platform switching correctly (e.g., window resize)', () => {
    mockUseIsDesktop.mockReturnValue(true);

    const { rerender } = render(
      <PlatformSwitch
        desktop={desktopContent}
        mobile={mobileContent}
      />
    );

    // Should show desktop content
    expect(screen.getByTestId('desktop-content')).toBeInTheDocument();

    // Simulate window resize to mobile
    mockUseIsDesktop.mockReturnValue(false);
    rerender(
      <PlatformSwitch
        desktop={desktopContent}
        mobile={mobileContent}
      />
    );

    // Should show mobile content
    expect(screen.getByTestId('mobile-content')).toBeInTheDocument();
    expect(screen.queryByTestId('desktop-content')).not.toBeInTheDocument();
  });

  it('defaults to mobile-first on SSR (returns false)', () => {
    // useIsDesktop returns false during SSR (mobile-first approach)
    mockUseIsDesktop.mockReturnValue(false);

    render(
      <PlatformSwitch
        desktop={desktopContent}
        mobile={mobileContent}
      />
    );

    // Should show mobile content (mobile-first)
    expect(screen.getByTestId('mobile-content')).toBeInTheDocument();
    expect(screen.queryByTestId('desktop-content')).not.toBeInTheDocument();
  });
});