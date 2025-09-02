import { render, screen } from '@testing-library/react';
import { PlatformSwitch } from './PlatformSwitch';
import { useIsDesktop } from '@/shared/hooks/useIsDesktop';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the useIsDesktop hook
vi.mock('@/shared/hooks/useIsDesktop');
const mockUseIsDesktop = vi.mocked(useIsDesktop);

describe('PlatformSwitch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const desktopContent = <div data-testid="desktop-content">Desktop Component</div>;
  const mobileContent = <div data-testid="mobile-content">Mobile Component</div>;
  const fallbackContent = <div data-testid="fallback-content">Loading...</div>;

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

  it('renders default loading state when isDesktop is null (SSR)', () => {
    mockUseIsDesktop.mockReturnValue(null);

    const { container } = render(
      <PlatformSwitch
        desktop={desktopContent}
        mobile={mobileContent}
      />
    );

    // Check for the loading spinner
    const loadingSpinner = container.querySelector('.animate-spin');
    expect(loadingSpinner).toBeInTheDocument();
    
    expect(screen.queryByTestId('desktop-content')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mobile-content')).not.toBeInTheDocument();
  });

  it('renders custom fallback when provided and isDesktop is null', () => {
    mockUseIsDesktop.mockReturnValue(null);

    render(
      <PlatformSwitch
        desktop={desktopContent}
        mobile={mobileContent}
        fallback={fallbackContent}
      />
    );

    expect(screen.getByTestId('fallback-content')).toBeInTheDocument();
    expect(screen.queryByTestId('desktop-content')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mobile-content')).not.toBeInTheDocument();
  });

  it('properly handles SSR-safe rendering pattern', () => {
    // Simulate SSR phase (null)
    mockUseIsDesktop.mockReturnValue(null);
    
    const { rerender, container } = render(
      <PlatformSwitch
        desktop={desktopContent}
        mobile={mobileContent}
      />
    );

    // Should show loading state
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();

    // Simulate hydration with desktop
    mockUseIsDesktop.mockReturnValue(true);
    rerender(
      <PlatformSwitch
        desktop={desktopContent}
        mobile={mobileContent}
      />
    );

    // Should show desktop content
    expect(screen.getByTestId('desktop-content')).toBeInTheDocument();
    expect(container.querySelector('.animate-spin')).not.toBeInTheDocument();
  });

  it('maintains M5 branding in loading state', () => {
    mockUseIsDesktop.mockReturnValue(null);

    const { container } = render(
      <PlatformSwitch
        desktop={desktopContent}
        mobile={mobileContent}
      />
    );

    // Check for M5 brand colors in spinner - look for the border-t-fire-orange class
    const spinner = container.querySelector('.border-t-fire-orange');
    expect(spinner).toBeInTheDocument();
    
    // Also check for the animate-spin class
    expect(spinner).toHaveClass('animate-spin');
    
    // Check for proper centering by checking multiple classes
    const loadingContainer = container.querySelector('.min-h-screen');
    expect(loadingContainer).toBeInTheDocument();
    expect(loadingContainer).toHaveClass('flex', 'items-center', 'justify-center');
  });
});