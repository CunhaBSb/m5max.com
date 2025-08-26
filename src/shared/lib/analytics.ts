import { 
  PageViewParams, 
  VideoParams, 
  WhatsAppParams, 
  FormParams, 
  ProductParams,
  DataLayerEvent 
} from '@/shared/types/analytics';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    fbq: (...args: unknown[]) => void;
  }
}

interface PlatformTrackingParams extends PageViewParams {
  platform: 'desktop' | 'mobile';
  viewport_width: number;
  viewport_height: number;
  user_agent: string;
}

/**
 * Enhanced analytics with platform tracking
 */
export class PlatformAnalytics {
  private platform: 'desktop' | 'mobile';
  private attribution: Record<string, unknown>;

  constructor(platform: 'desktop' | 'mobile', attribution?: Record<string, unknown>) {
    this.platform = platform;
    this.attribution = attribution || {};
    
    // Initialize dataLayer if not exists
    if (typeof window !== 'undefined' && !window.dataLayer) {
      window.dataLayer = [];
    }
  }

  private pushToDataLayer(data: DataLayerEvent) {
    if (typeof window === 'undefined' || !window.dataLayer) return;
    
    // Enrich with platform and attribution data
    const enrichedData = {
      ...data,
      platform: this.platform,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      ...this.attribution?.utm,
      gclid: this.attribution?.gclid,
      fbclid: this.attribution?.fbclid,
      event_id: `${data.event}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    window.dataLayer.push(enrichedData);
  }

  trackPlatformView() {
    this.pushToDataLayer({
      event: 'platform_view',
      page_category: 'platform',
      page_slug: window.location.pathname,
      page_title: `${this.platform} Experience`,
      content_name: 'platform_experience',
      content_category: 'platform'
    });

    // GA4 custom event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'platform_view', {
        custom_parameter_platform: this.platform,
        custom_parameter_viewport: `${window.innerWidth}x${window.innerHeight}`
      });
    }

    // Meta Pixel custom event
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', 'PlatformView', {
        platform: this.platform,
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight
      });
    }
  }

  trackPageView(params: PageViewParams) {
    this.pushToDataLayer({
      event: 'page_view',
      page_category: params.page_category,
      page_slug: window.location.pathname,
      page_title: params.page_title,
      content_name: params.page_title,
      content_category: params.page_category
    });

    // GA4 pageview with platform info
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: params.page_title,
        page_location: params.page_location,
        content_group1: params.page_category,
        custom_parameter_platform: this.platform
      });
    }

    // Meta Pixel PageView with platform
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView', {
        content_name: params.page_title,
        content_category: params.page_category,
        platform: this.platform
      });
    }
  }

  trackVideoEvent(eventType: 'start' | 'progress_50' | 'complete', params: VideoParams) {
    const eventName = `video_${eventType}`;
    
    this.pushToDataLayer({
      event: eventName,
      page_category: 'video',
      page_slug: window.location.pathname,
      page_title: document.title,
      content_name: params.video_title,
      content_category: 'video'
    });

    // Meta Pixel video events with platform
    if (typeof window !== 'undefined' && window.fbq) {
      const fbEventName = eventType === 'start' ? 'VideoView' : 
                         eventType === 'progress_50' ? 'Video50Percent' : 'VideoComplete';
      window.fbq('track', fbEventName, {
        content_name: params.video_title,
        video_provider: params.video_provider,
        platform: this.platform
      });
    }
  }

  trackWhatsAppClick(params: WhatsAppParams) {
    this.pushToDataLayer({
      event: 'whatsapp_click',
      page_category: params.audience,
      page_slug: window.location.pathname,
      page_title: document.title,
      content_name: 'whatsapp_button',
      content_category: 'conversion'
    });

    // Meta Pixel Contact event with platform
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Contact', {
        content_name: 'whatsapp',
        content_category: params.audience,
        platform: this.platform,
        source: params.source
      });
    }
  }

  trackFormEvent(eventType: 'start' | 'submit', params: FormParams) {
    const eventName = `lead_form_${eventType}`;
    
    this.pushToDataLayer({
      event: eventName,
      page_category: params.form_type,
      page_slug: window.location.pathname,
      page_title: document.title,
      content_name: params.form_name,
      content_category: 'form',
      value: params.lead_score
    });

    // Meta Pixel form events with platform
    if (typeof window !== 'undefined' && window.fbq) {
      const fbEventName = eventType === 'start' ? 'InitiateCheckout' : 'Lead';
      window.fbq('track', fbEventName, {
        content_name: params.form_name,
        content_category: params.form_type,
        value: params.lead_score,
        platform: this.platform
      });
    }
  }

  trackPerformanceMetrics(metrics: {
    loadTime: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    cumulativeLayoutShift: number;
  }) {
    this.pushToDataLayer({
      event: 'performance_metrics',
      page_category: 'performance',
      page_slug: window.location.pathname,
      page_title: document.title,
      load_time: metrics.loadTime,
      fcp: metrics.firstContentfulPaint,
      lcp: metrics.largestContentfulPaint,
      cls: metrics.cumulativeLayoutShift
    });
  }

  trackBundleSize(bundleInfo: {
    totalSize: number;
    jsSize: number;
    cssSize: number;
    chunkCount: number;
  }) {
    this.pushToDataLayer({
      event: 'bundle_metrics',
      page_category: 'performance',
      page_slug: window.location.pathname,
      page_title: document.title,
      bundle_total_size: bundleInfo.totalSize,
      bundle_js_size: bundleInfo.jsSize,
      bundle_css_size: bundleInfo.cssSize,
      bundle_chunk_count: bundleInfo.chunkCount
    });
  }
}

/**
 * Create platform-specific analytics instance
 */
export const createPlatformAnalytics = (platform: 'desktop' | 'mobile', attribution?: Record<string, unknown>) => {
  return new PlatformAnalytics(platform, attribution);
};

/**
 * Initialize analytics for platform
 */
export const initializePlatformAnalytics = (platform: 'desktop' | 'mobile') => {
  if (typeof window === 'undefined') return;

  // Track platform detection
  const analytics = createPlatformAnalytics(platform);
  analytics.trackPlatformView();

  // Performance tracking
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        analytics.trackPerformanceMetrics({
          loadTime: perfData.loadEventEnd - perfData.navigationStart,
          firstContentfulPaint: 0, // Would need to be measured differently
          largestContentfulPaint: 0, // Would need PerformanceObserver
          cumulativeLayoutShift: 0 // Would need PerformanceObserver
        });
      }, 0);
    });
  }

  return analytics;
};