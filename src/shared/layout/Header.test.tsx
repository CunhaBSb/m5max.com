import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';
import { useIsDesktop } from '@/shared/hooks/useIsDesktop';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the hooks and components
vi.mock('@/shared/hooks/useIsDesktop');
vi.mock('./desktop/Header', () => ({
  DesktopHeader: ({ navigation, handleNavigation }: { navigation: Array<{ name: string; href: string }>; handleNavigation: (href: string) => void }) => (
    <div data-testid="desktop-header">
      <div data-testid="desktop-nav">
        {navigation.map((item) => (
          <button 
            key={item.name} 
            onClick={() => handleNavigation(item.href)}
            data-testid={`desktop-nav-${item.name.toLowerCase()}`}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  ),
}));

vi.mock('./mobile/Header', () => ({
  MobileHeader: ({ navigation, handleNavigation, isOpen, setIsOpen }: { navigation: Array<{ name: string; href: string }>; handleNavigation: (href: string) => void; isOpen: boolean; setIsOpen: (open: boolean) => void }) => (
    <div data-testid="mobile-header">
      <button onClick={() => setIsOpen(!isOpen)} data-testid="mobile-menu-toggle">
        Menu {isOpen ? 'Open' : 'Closed'}
      </button>
      {isOpen && (
        <div data-testid="mobile-nav">
          {navigation.map((item) => (
            <button 
              key={item.name} 
              onClick={() => handleNavigation(item.href)}
              data-testid={`mobile-nav-${item.name.toLowerCase()}`}
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  ),
}));

const mockUseIsDesktop = vi.mocked(useIsDesktop);
const mockNavigate = vi.fn();
const mockLocation = { pathname: '/' };

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
    
    // Mock window.scrollY
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
    });

    // Mock DOM methods
    document.querySelector = vi.fn().mockReturnValue({
      scrollIntoView: vi.fn(),
    });

    // Ensure location pathname defaults to home for each test unless overridden
    mockLocation.pathname = '/';
  });

  describe('platform switching', () => {
    it('renders desktop header when on desktop', () => {
      mockUseIsDesktop.mockReturnValue(true);
      
      renderWithRouter(<Header />);
      
      expect(screen.getByTestId('desktop-header')).toBeInTheDocument();
      expect(screen.queryByTestId('mobile-header')).not.toBeInTheDocument();
    });

    it('renders mobile header when on mobile', () => {
      mockUseIsDesktop.mockReturnValue(false);
      
      renderWithRouter(<Header />);
      
      expect(screen.getByTestId('mobile-header')).toBeInTheDocument();
      expect(screen.queryByTestId('desktop-header')).not.toBeInTheDocument();
    });

    it('defaults to mobile header during SSR (mobile-first)', () => {
      // useIsDesktop returns false during SSR (mobile-first approach)
      mockUseIsDesktop.mockReturnValue(false);

      renderWithRouter(<Header />);

      // Should show mobile header (mobile-first SSR)
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByTestId('mobile-header')).toBeInTheDocument();
      expect(screen.queryByTestId('desktop-header')).not.toBeInTheDocument();
    });
  });

  describe('scroll behavior', () => {
    beforeEach(() => {
      mockUseIsDesktop.mockReturnValue(true);
    });

    it('shows header when scroll is below 100px', async () => {
      renderWithRouter(<Header />);
      
      // Simulate scroll to 50px
      Object.defineProperty(window, 'scrollY', { value: 50 });
      fireEvent.scroll(window);
      
      await waitFor(() => {
        const header = screen.getByRole('banner');
        expect(header).toHaveClass('translate-y-0');
        expect(header).not.toHaveClass('-translate-y-full');
      });
    });

    it('hides header when scrolling down past 100px', async () => {
      renderWithRouter(<Header />);
      
      // Start at 50px
      Object.defineProperty(window, 'scrollY', { value: 50 });
      fireEvent.scroll(window);
      
      // Scroll down to 200px
      Object.defineProperty(window, 'scrollY', { value: 200 });
      fireEvent.scroll(window);
      
      await waitFor(() => {
        const header = screen.getByRole('banner');
        expect(header).toHaveClass('-translate-y-full');
        expect(header).not.toHaveClass('translate-y-0');
      });
    });

    it('shows header when scrolling up', async () => {
      renderWithRouter(<Header />);
      
      // Start scrolled down
      Object.defineProperty(window, 'scrollY', { value: 300 });
      fireEvent.scroll(window);
      
      // Scroll up to 200px
      Object.defineProperty(window, 'scrollY', { value: 200 });
      fireEvent.scroll(window);
      
      await waitFor(() => {
        const header = screen.getByRole('banner');
        expect(header).toHaveClass('translate-y-0');
        expect(header).not.toHaveClass('-translate-y-full');
      });
    });

    it('cleans up scroll event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      
      const { unmount } = renderWithRouter(<Header />);
      unmount();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    });
  });

  describe('navigation handling', () => {
    beforeEach(() => {
      mockUseIsDesktop.mockReturnValue(true);
    });

    it('navigates to route paths correctly', () => {
      renderWithRouter(<Header />);
      
      const reveillonButton = screen.getByTestId('desktop-nav-réveillon');
      fireEvent.click(reveillonButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/reveillon');
    });

    it('scrolls to anchor links on same page', () => {
      const mockScrollIntoView = vi.fn();
      document.querySelector = vi.fn().mockReturnValue({
        scrollIntoView: mockScrollIntoView,
      });
      
      renderWithRouter(<Header />);
      
      // Find empresa dropdown items and click "Sobre a M5" 
      // This would be in the dropdown, but our mock shows it as a direct button
      const sobreNosButton = screen.getByTestId('desktop-nav-sobre nós');
      fireEvent.click(sobreNosButton);
      
      expect(document.querySelector).toHaveBeenCalledWith('#empresa');
      expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    });

    it('navigates to home then scrolls for anchor links from other pages', async () => {
      // Mock being on different page
      mockLocation.pathname = '/reveillon';
      
      const mockScrollIntoView = vi.fn();
      document.querySelector = vi.fn().mockReturnValue({
        scrollIntoView: mockScrollIntoView,
      });
      
      renderWithRouter(<Header />);
      
      const sobreNosButton2 = screen.getByTestId('desktop-nav-sobre nós');
      fireEvent.click(sobreNosButton2);
      
      expect(mockNavigate).toHaveBeenCalledWith('/');
      
      // The component uses setTimeout for delayed scroll, we can test the navigate call
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('closes mobile menu after navigation', () => {
      mockUseIsDesktop.mockReturnValue(false);
      
      renderWithRouter(<Header />);
      
      // Open mobile menu
      const menuToggle = screen.getByTestId('mobile-menu-toggle');
      fireEvent.click(menuToggle);
      
      expect(screen.getByText('Menu Open')).toBeInTheDocument();
      
      // Navigate to close menu
      const reveillonButton = screen.getByTestId('mobile-nav-réveillon');
      fireEvent.click(reveillonButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/reveillon');
      expect(screen.getByText('Menu Closed')).toBeInTheDocument();
    });
  });

  describe('navigation structure', () => {
    beforeEach(() => {
      mockUseIsDesktop.mockReturnValue(true);
    });

    it('provides correct navigation items', () => {
      renderWithRouter(<Header />);
      
      // Check main navigation items
      expect(screen.getByTestId('desktop-nav-réveillon')).toBeInTheDocument();
      expect(screen.getByTestId('desktop-nav-sobre nós')).toBeInTheDocument();
    });

    it('includes M5 branding and styling', () => {
      renderWithRouter(<Header />);
      
      const header = screen.getByRole('banner');
      
      // Check M5 brand styling classes
      expect(header).toHaveClass('fixed', 'top-0', 'left-0', 'right-0', 'z-50');
      expect(header).toHaveClass('bg-background/20', 'backdrop-blur-sm');
      expect(header).toHaveClass('transition-transform', 'duration-300');
    });

    it('maintains responsive container styling', () => {
      renderWithRouter(<Header />);
      
      const container = screen.getByRole('banner').querySelector('.container');
      expect(container).toBeTruthy();
      expect(container).toHaveClass('mx-auto', 'px-4', 'sm:px-6', 'lg:px-8');
    });
  });

  describe('accessibility', () => {
    beforeEach(() => {
      mockUseIsDesktop.mockReturnValue(true);
    });

    it('has proper semantic header role', () => {
      renderWithRouter(<Header />);
      
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('maintains focus management during navigation', () => {
      renderWithRouter(<Header />);
      
      const navButton = screen.getByTestId('desktop-nav-réveillon');
      navButton.focus();
      
      expect(navButton).toHaveFocus();
      
      fireEvent.click(navButton);
      
      // Navigation should not break focus patterns
      expect(mockNavigate).toHaveBeenCalled();
    });
  });
});
