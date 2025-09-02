import { renderHook, act } from '@testing-library/react';
import { useAppStore } from './appStore';
import { AttributionData, ConsentState } from '@/shared/types/analytics';
import { beforeEach, describe, expect, it } from 'vitest';

// Mock localStorage for Zustand persist
const localStorageMock = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useAppStore', () => {
  // Note: No beforeEach reset - tests should handle their own state cleanup

  describe('initial state', () => {
    it('has correct default values', () => {
      const { result } = renderHook(() => useAppStore());
      
      expect(result.current.attribution).toBeNull();
      expect(result.current.conversionModalOpen).toBe(false);
      expect(result.current.currentAudience).toBe('general');
    });

    it('has GDPR-compliant default consent state', () => {
      const { result } = renderHook(() => useAppStore());
      
      const consent = result.current.consent;
      
      // Should deny all tracking by default (GDPR compliant)
      expect(consent.ad_storage).toBe('denied');
      expect(consent.ad_user_data).toBe('denied');
      expect(consent.ad_personalization).toBe('denied');
      expect(consent.analytics_storage).toBe('denied');
      
      // Should allow functional and security storage (necessary)
      expect(consent.functionality_storage).toBe('granted');
      expect(consent.security_storage).toBe('granted');
    });
  });

  describe('setAttribution', () => {
    it('updates attribution data correctly', () => {
      const { result } = renderHook(() => useAppStore());
      
      const attributionData: AttributionData = {
        utm: {
          utm_source: 'google',
          utm_medium: 'cpc',
          utm_campaign: 'brand_campaign',
          utm_term: 'fogos de artificio',
          utm_content: 'homepage_banner',
        },
        gclid: 'test_gclid_123',
        fbclid: 'test_fbclid_456',
        referrer: 'https://google.com',
        landing_page: '/',
        timestamp: Date.now(),
      };
      
      act(() => {
        result.current.setAttribution(attributionData);
      });
      
      expect(result.current.attribution).toEqual(attributionData);
      expect(result.current.attribution?.utm.utm_source).toBe('google');
      expect(result.current.attribution?.gclid).toBe('test_gclid_123');
    });

    it('overwrites previous attribution data', () => {
      const { result } = renderHook(() => useAppStore());
      
      const firstAttribution: AttributionData = {
        utm: { utm_source: 'facebook', utm_medium: 'social' },
        gclid: 'old_gclid',
        referrer: 'https://facebook.com',
        landing_page: '/reveillon',
        timestamp: Date.now() - 1000,
      };
      
      const secondAttribution: AttributionData = {
        utm: { utm_source: 'google', utm_medium: 'organic' },
        referrer: 'https://google.com',
        landing_page: '/',
        timestamp: Date.now(),
      };
      
      act(() => {
        result.current.setAttribution(firstAttribution);
      });
      
      act(() => {
        result.current.setAttribution(secondAttribution);
      });
      
      expect(result.current.attribution?.utm.utm_source).toBe('google');
      expect(result.current.attribution?.gclid).toBeUndefined();
    });
  });

  describe('updateConsent', () => {
    it('updates consent partially while preserving other values', () => {
      const { result } = renderHook(() => useAppStore());
      
      act(() => {
        result.current.updateConsent({
          analytics_storage: 'granted',
          ad_storage: 'granted',
        });
      });
      
      const consent = result.current.consent;
      
      // Should update specified values
      expect(consent.analytics_storage).toBe('granted');
      expect(consent.ad_storage).toBe('granted');
      
      // Should preserve other values
      expect(consent.ad_user_data).toBe('denied');
      expect(consent.functionality_storage).toBe('granted');
    });

    it('handles full consent acceptance', () => {
      const { result } = renderHook(() => useAppStore());
      
      const fullConsent: ConsentState = {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        analytics_storage: 'granted',
        functionality_storage: 'granted',
        security_storage: 'granted',
      };
      
      act(() => {
        result.current.updateConsent(fullConsent);
      });
      
      expect(result.current.consent).toEqual(fullConsent);
    });

    it('handles consent withdrawal', () => {
      const { result } = renderHook(() => useAppStore());
      
      // First grant consent
      act(() => {
        result.current.updateConsent({
          analytics_storage: 'granted',
          ad_storage: 'granted',
        });
      });
      
      // Then withdraw
      act(() => {
        result.current.updateConsent({
          analytics_storage: 'denied',
          ad_storage: 'denied',
        });
      });
      
      expect(result.current.consent.analytics_storage).toBe('denied');
      expect(result.current.consent.ad_storage).toBe('denied');
    });
  });

  describe('conversion modal management', () => {
    it('opens conversion modal with correct context', () => {
      const { result } = renderHook(() => useAppStore());
      
      act(() => {
        result.current.openConversionModal({
          source: 'hero_button',
          audience: 'b2b',
          page: 'home',
        });
      });
      
      expect(result.current.conversionModalOpen).toBe(true);
      expect(result.current.currentAudience).toBe('b2b');
    });

    it('closes conversion modal and preserves audience', () => {
      const { result } = renderHook(() => useAppStore());
      
      // First open modal
      act(() => {
        result.current.openConversionModal({
          source: 'hero_button',
          audience: 'b2c',
          page: 'home',
        });
      });
      
      // Then close
      act(() => {
        result.current.closeConversionModal();
      });
      
      expect(result.current.conversionModalOpen).toBe(false);
      // Audience should be preserved for analytics
      expect(result.current.currentAudience).toBe('b2c');
    });

    it('handles multiple modal open/close cycles', () => {
      const { result } = renderHook(() => useAppStore());
      
      // Open -> Close -> Open -> Close
      act(() => {
        result.current.openConversionModal({
          source: 'header',
          audience: 'general',
          page: 'reveillon',
        });
      });
      expect(result.current.conversionModalOpen).toBe(true);
      
      act(() => {
        result.current.closeConversionModal();
      });
      expect(result.current.conversionModalOpen).toBe(false);
      
      act(() => {
        result.current.openConversionModal({
          source: 'footer',
          audience: 'b2b',
          page: 'home',
        });
      });
      
      expect(result.current.conversionModalOpen).toBe(true);
      expect(result.current.currentAudience).toBe('b2b');
    });
  });

  describe('setCurrentAudience', () => {
    it('updates current audience correctly', () => {
      const { result } = renderHook(() => useAppStore());
      
      act(() => {
        result.current.setCurrentAudience('b2b');
      });
      
      expect(result.current.currentAudience).toBe('b2b');
      
      act(() => {
        result.current.setCurrentAudience('b2c');
      });
      
      expect(result.current.currentAudience).toBe('b2c');
    });

    it('handles all audience types', () => {
      const { result } = renderHook(() => useAppStore());
      const audiences = ['general', 'b2b', 'b2c'] as const;
      
      audiences.forEach((audience) => {
        act(() => {
          result.current.setCurrentAudience(audience);
        });
        
        expect(result.current.currentAudience).toBe(audience);
      });
    });
  });

  describe('state integration', () => {
    it('maintains state consistency across multiple updates', () => {
      const { result } = renderHook(() => useAppStore());
      
      const attribution: AttributionData = {
        utm: { utm_source: 'google', utm_medium: 'organic' },
        referrer: 'https://google.com',
        landing_page: '/',
        timestamp: Date.now(),
      };
      
      // Perform multiple state updates
      act(() => {
        result.current.setAttribution(attribution);
        result.current.updateConsent({ analytics_storage: 'granted' });
        result.current.openConversionModal({
          source: 'multi_test',
          audience: 'b2b',
          page: 'home',
        });
        result.current.setCurrentAudience('b2c'); // This should overwrite modal audience
      });
      
      // Verify all state is correctly maintained
      expect(result.current.attribution).toEqual(attribution);
      expect(result.current.consent.analytics_storage).toBe('granted');
      expect(result.current.conversionModalOpen).toBe(true);
      expect(result.current.currentAudience).toBe('b2c'); // setCurrentAudience was called after modal
    });

    it('handles edge cases gracefully', () => {
      const { result } = renderHook(() => useAppStore());
      
      // Reset to known state for this test
      act(() => {
        result.current.updateConsent({
          analytics_storage: 'denied',
          ad_storage: 'denied'
        });
      });
      
      // Test empty consent update
      act(() => {
        result.current.updateConsent({});
      });
      
      // Should not change consent
      expect(result.current.consent.analytics_storage).toBe('denied');
      
      // Test closing modal when already closed
      act(() => {
        result.current.closeConversionModal();
        result.current.closeConversionModal(); // Double close
      });
      
      expect(result.current.conversionModalOpen).toBe(false);
    });
  });
});