import { renderHook, act } from '@testing-library/react';
import { useAnalytics } from './useAnalytics';
import { useAppStore } from '@/shared/store/appStore';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the store
vi.mock('@/shared/store/appStore');
const mockUseAppStore = vi.mocked(useAppStore);

// Mock window globals
const mockDataLayer: unknown[] = [];
const mockGtag = vi.fn();
const mockFbq = vi.fn();

Object.defineProperty(window, 'dataLayer', {
  value: mockDataLayer,
  writable: true,
});

Object.defineProperty(window, 'gtag', {
  value: mockGtag,
  writable: true,
});

Object.defineProperty(window, 'fbq', {
  value: mockFbq,
  writable: true,
});

// Mock document.title
Object.defineProperty(document, 'title', {
  value: 'Test Page Title',
  writable: true,
});

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    pathname: '/test-path',
    href: 'https://test.com/test-path',
  },
  writable: true,
});

describe('useAnalytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDataLayer.length = 0;
    
    // Default mock store values
    mockUseAppStore.mockReturnValue({
      consent: { analytics: true },
      attribution: {
        utm: {
          utm_source: 'test-source',
          utm_medium: 'test-medium',
          utm_campaign: 'test-campaign',
        },
        gclid: 'test-gclid',
        fbclid: 'test-fbclid',
      },
    } as ReturnType<typeof useAppStore>);
  });

  describe('initialization', () => {
    it('initializes dataLayer if not present', () => {
      // Temporarily set dataLayer to undefined
      const originalDataLayer = window.dataLayer;
      // @ts-expect-error - intentionally setting to undefined for test
      window.dataLayer = undefined;
      
      renderHook(() => useAnalytics());
      
      expect(window.dataLayer).toBeDefined();
      expect(Array.isArray(window.dataLayer)).toBe(true);
      
      // Restore original
      window.dataLayer = originalDataLayer;
    });
  });

  describe('trackPageView', () => {
    it('pushes page view event to dataLayer with attribution data', () => {
      const { result } = renderHook(() => useAnalytics());
      
      act(() => {
        result.current.trackPageView({
          page_title: 'Test Page',
          page_location: 'https://test.com/page',
          page_category: 'general',
        });
      });

      expect(mockDataLayer).toHaveLength(1);
      const event = mockDataLayer[0];
      
      expect(event.event).toBe('page_view');
      expect(event.page_title).toBe('Test Page');
      expect(event.page_category).toBe('general');
      expect(event.utm_source).toBe('test-source');
      expect(event.gclid).toBe('test-gclid');
      expect(event.event_id).toMatch(/^page_view_\d+_[a-z0-9]+$/);
    });

    it('calls gtag for GA4 tracking', () => {
      const { result } = renderHook(() => useAnalytics());
      
      act(() => {
        result.current.trackPageView({
          page_title: 'Test Page',
          page_location: 'https://test.com/page',
          page_category: 'general',
        });
      });

      expect(mockGtag).toHaveBeenCalledWith('config', 'GA_MEASUREMENT_ID', {
        page_title: 'Test Page',
        page_location: 'https://test.com/page',
        content_group1: 'general',
      });
    });

    it('calls fbq for Meta Pixel tracking', () => {
      const { result } = renderHook(() => useAnalytics());
      
      act(() => {
        result.current.trackPageView({
          page_title: 'Test Page',
          page_location: 'https://test.com/page',
          page_category: 'general',
        });
      });

      expect(mockFbq).toHaveBeenCalledWith('track', 'PageView', {
        content_name: 'Test Page',
        content_category: 'general',
      });
    });
  });

  describe('trackVideoEvent', () => {
    it('tracks video start event correctly', () => {
      const { result } = renderHook(() => useAnalytics());
      
      act(() => {
        result.current.trackVideoEvent('start', {
          video_title: 'M5 Max Showcase',
          video_provider: 'youtube',
          video_duration: 120,
          video_current_time: 0,
        });
      });

      expect(mockDataLayer).toHaveLength(1);
      const event = mockDataLayer[0];
      
      expect(event.event).toBe('video_start');
      expect(event.content_name).toBe('M5 Max Showcase');
      expect(event.content_category).toBe('video');
    });

    it('maps video events to correct Meta Pixel events', () => {
      const { result } = renderHook(() => useAnalytics());
      
      // Test different video events
      const testCases = [
        { type: 'start' as const, expectedFbEvent: 'VideoView' },
        { type: 'progress_50' as const, expectedFbEvent: 'Video50Percent' },
        { type: 'complete' as const, expectedFbEvent: 'VideoComplete' },
        { type: 'click_to_play' as const, expectedFbEvent: 'VideoView' },
        { type: 'progress_25' as const, expectedFbEvent: 'VideoProgress' },
      ];

      testCases.forEach(({ type, expectedFbEvent }, index) => {
        act(() => {
          result.current.trackVideoEvent(type, {
            video_title: 'Test Video',
            video_provider: 'youtube',
            video_duration: 120,
            video_current_time: 60,
          });
        });

        expect(mockFbq).toHaveBeenNthCalledWith(index + 1, 'track', expectedFbEvent, {
          content_name: 'Test Video',
          video_provider: 'youtube',
        });
      });
    });
  });

  describe('trackWhatsAppClick', () => {
    it('tracks WhatsApp click with correct parameters', () => {
      const { result } = renderHook(() => useAnalytics());
      
      act(() => {
        result.current.trackWhatsAppClick({
          audience: 'b2b',
          source: 'hero_button',
          message_template: 'Olá, gostaria de um orçamento',
          phone_number: '5561982735575',
        });
      });

      expect(mockDataLayer).toHaveLength(1);
      const event = mockDataLayer[0];
      
      expect(event.event).toBe('whatsapp_click');
      expect(event.page_category).toBe('b2b');
      expect(event.content_category).toBe('conversion');
    });

    it('calls Meta Pixel Contact event', () => {
      const { result } = renderHook(() => useAnalytics());
      
      act(() => {
        result.current.trackWhatsAppClick({
          audience: 'b2c',
          source: 'footer',
          message_template: 'Test message',
          phone_number: '5561982735575',
        });
      });

      expect(mockFbq).toHaveBeenCalledWith('track', 'Contact', {
        content_name: 'whatsapp',
        content_category: 'b2c',
      });
    });
  });

  describe('trackFormEvent', () => {
    it('tracks form start and submit events correctly', () => {
      const { result } = renderHook(() => useAnalytics());
      
      const formParams = {
        form_name: 'b2b_qualification_form',
        form_type: 'lead_generation',
        lead_score: 85,
      };

      // Test form start
      act(() => {
        result.current.trackFormEvent('start', formParams);
      });

      expect(mockDataLayer).toHaveLength(1);
      expect(mockDataLayer[0].event).toBe('lead_form_start');
      expect(mockDataLayer[0].value).toBe(85);

      // Test form submit
      act(() => {
        result.current.trackFormEvent('submit', formParams);
      });

      expect(mockDataLayer).toHaveLength(2);
      expect(mockDataLayer[1].event).toBe('lead_form_submit');
    });

    it('maps form events to correct Meta Pixel events', () => {
      const { result } = renderHook(() => useAnalytics());
      
      const formParams = {
        form_name: 'test_form',
        form_type: 'lead_generation',
        lead_score: 75,
      };

      // Test form start -> InitiateCheckout
      act(() => {
        result.current.trackFormEvent('start', formParams);
      });

      expect(mockFbq).toHaveBeenCalledWith('track', 'InitiateCheckout', {
        content_name: 'test_form',
        content_category: 'lead_generation',
        value: 75,
      });

      // Test form submit -> Lead
      act(() => {
        result.current.trackFormEvent('submit', formParams);
      });

      expect(mockFbq).toHaveBeenCalledWith('track', 'Lead', {
        content_name: 'test_form',
        content_category: 'lead_generation',
        value: 75,
      });
    });
  });

  describe('trackScrollDepth', () => {
    it('tracks scroll depth milestones correctly', () => {
      const { result } = renderHook(() => useAnalytics());
      
      const depths = [25, 50, 75, 100] as const;
      
      depths.forEach((depth, index) => {
        act(() => {
          result.current.trackScrollDepth(depth);
        });

        expect(mockDataLayer).toHaveLength(index + 1);
        const event = mockDataLayer[index];
        
        expect(event.event).toBe(`scroll_depth_${depth}`);
        expect(event.page_category).toBe('general');
      });
    });
  });

  describe('error handling', () => {
    it('handles missing dataLayer gracefully', () => {
      // Temporarily set dataLayer to undefined
      const originalDataLayer = window.dataLayer;
      // @ts-expect-error - intentionally setting to undefined for test
      window.dataLayer = undefined;
      
      const { result } = renderHook(() => useAnalytics());
      
      // Should not throw error
      expect(() => {
        result.current.trackPageView({
          page_title: 'Test',
          page_location: 'https://test.com',
          page_category: 'general',
        });
      }).not.toThrow();
      
      // Restore original
      window.dataLayer = originalDataLayer;
    });

    it('handles missing gtag gracefully', () => {
      // Temporarily set gtag to undefined
      const originalGtag = window.gtag;
      // @ts-expect-error - intentionally setting to undefined for test
      window.gtag = undefined;
      
      const { result } = renderHook(() => useAnalytics());
      
      // Should not throw error
      expect(() => {
        result.current.trackPageView({
          page_title: 'Test',
          page_location: 'https://test.com',
          page_category: 'general',
        });
      }).not.toThrow();
      
      // Restore original
      window.gtag = originalGtag;
    });

    it('handles missing fbq gracefully', () => {
      // Temporarily set fbq to undefined
      const originalFbq = window.fbq;
      // @ts-expect-error - intentionally setting to undefined for test
      window.fbq = undefined;
      
      const { result } = renderHook(() => useAnalytics());
      
      // Should not throw error
      expect(() => {
        result.current.trackPageView({
          page_title: 'Test',
          page_location: 'https://test.com',
          page_category: 'general',
        });
      }).not.toThrow();
      
      // Restore original
      window.fbq = originalFbq;
    });
  });
});