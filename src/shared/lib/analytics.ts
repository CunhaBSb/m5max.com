import { 
  PageViewParams, 
  VideoParams, 
  WhatsAppParams, 
  FormParams, 
  ProductParams,
  DataLayerEvent 
} from '@shared/types/analytics';
import config from '@/shared/lib/config';

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
    if (typeof window !== 'undefined' && window.gtag && config.ga4Id) {
      window.gtag('config', config.ga4Id, {
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

// E-commerce specific tracking functions
export class EcommerceAnalytics extends PlatformAnalytics {
  
  /**
   * Track product view events
   */
  trackProductView(product: {
    id: string;
    name: string;
    category: string;
    price: number;
    brand?: string;
  }) {
    this.pushToDataLayer({
      event: 'view_item',
      page_category: 'ecommerce',
      page_slug: window.location.pathname,
      page_title: document.title,
      content_name: product.name,
      content_category: product.category,
      item_name: product.name,
      item_id: product.id,
      item_category: product.category,
      item_brand: product.brand || 'M5 Max',
      price: product.price,
      value: product.price,
      currency: 'BRL'
    });

    // Enhanced ecommerce for GA4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'view_item', {
        currency: 'BRL',
        value: product.price,
        items: [{
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          item_brand: product.brand || 'M5 Max',
          price: product.price,
          quantity: 1
        }]
      });
    }

    // Meta Pixel ViewContent
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_ids: [product.id],
        content_name: product.name,
        content_category: product.category,
        value: product.price,
        currency: 'BRL'
      });
    }
  }

  /**
   * Track add to cart events (for quote cart)
   */
  trackAddToQuote(product: {
    id: string;
    name: string;
    category: string;
    price: number;
    quantity?: number;
  }) {
    this.pushToDataLayer({
      event: 'add_to_cart',
      page_category: 'ecommerce',
      page_slug: window.location.pathname,
      page_title: document.title,
      content_name: product.name,
      content_category: product.category,
      item_name: product.name,
      item_id: product.id,
      item_category: product.category,
      price: product.price,
      value: product.price * (product.quantity || 1),
      currency: 'BRL',
      quantity: product.quantity || 1
    });

    // GA4 enhanced ecommerce
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'add_to_cart', {
        currency: 'BRL',
        value: product.price * (product.quantity || 1),
        items: [{
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          price: product.price,
          quantity: product.quantity || 1
        }]
      });
    }

    // Meta Pixel AddToCart
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'AddToCart', {
        content_ids: [product.id],
        content_name: product.name,
        content_category: product.category,
        value: product.price * (product.quantity || 1),
        currency: 'BRL'
      });
    }
  }

  /**
   * Track quote request initiation
   */
  trackQuoteInitiation(products: Array<{
    id: string;
    name: string;
    category: string;
    price: number;
    quantity?: number;
  }>, totalValue: number) {
    const items = products.map(product => ({
      item_id: product.id,
      item_name: product.name,
      item_category: product.category,
      price: product.price,
      quantity: product.quantity || 1
    }));

    this.pushToDataLayer({
      event: 'begin_checkout',
      page_category: 'ecommerce',
      page_slug: window.location.pathname,
      page_title: document.title,
      content_name: 'quote_request',
      content_category: 'conversion',
      value: totalValue,
      currency: 'BRL',
      items: items,
      num_items: products.length
    });

    // GA4 enhanced ecommerce
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'begin_checkout', {
        currency: 'BRL',
        value: totalValue,
        items: items
      });
    }

    // Meta Pixel InitiateCheckout
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        content_ids: products.map(p => p.id),
        value: totalValue,
        currency: 'BRL',
        num_items: products.length
      });
    }
  }

  /**
   * Track quote submission/lead generation
   */
  trackQuoteSubmission(
    products: Array<{
      id: string;
      name: string;
      category: string;
      price: number;
      quantity?: number;
    }>, 
    formData: {
      eventType?: string;
      eventDate?: string;
      guests?: number;
      budget?: string;
      leadScore?: number;
    },
    totalValue: number
  ) {
    const items = products.map(product => ({
      item_id: product.id,
      item_name: product.name,
      item_category: product.category,
      price: product.price,
      quantity: product.quantity || 1
    }));

    this.pushToDataLayer({
      event: 'generate_lead',
      page_category: 'ecommerce',
      page_slug: window.location.pathname,
      page_title: document.title,
      content_name: 'quote_submission',
      content_category: 'conversion',
      value: totalValue,
      currency: 'BRL',
      items: items,
      lead_score: formData.leadScore || 0,
      event_type: formData.eventType,
      event_date: formData.eventDate,
      guest_count: formData.guests,
      budget_range: formData.budget
    });

    // GA4 conversion event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL',
        value: totalValue,
        currency: 'BRL',
        transaction_id: `quote_${Date.now()}`
      });

      // Custom lead event
      window.gtag('event', 'generate_lead', {
        currency: 'BRL',
        value: totalValue,
        items: items
      });
    }

    // Meta Pixel Lead
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Lead', {
        content_ids: products.map(p => p.id),
        value: totalValue,
        currency: 'BRL',
        content_name: 'quote_request',
        content_category: 'pirotecnica'
      });
    }
  }

  /**
   * Track product comparison events
   */
  trackProductComparison(products: Array<{
    id: string;
    name: string;
    category: string;
    price: number;
  }>) {
    this.pushToDataLayer({
      event: 'compare_products',
      page_category: 'ecommerce',
      page_slug: window.location.pathname,
      page_title: document.title,
      content_name: 'product_comparison',
      content_category: 'engagement',
      item_ids: products.map(p => p.id),
      item_names: products.map(p => p.name),
      comparison_count: products.length
    });

    // Custom event for GA4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'compare_products', {
        items: products.map(product => ({
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          price: product.price
        }))
      });
    }
  }

  /**
   * Track search events
   */
  trackProductSearch(searchTerm: string, resultsCount: number) {
    this.pushToDataLayer({
      event: 'search',
      page_category: 'ecommerce',
      page_slug: window.location.pathname,
      page_title: document.title,
      content_name: 'product_search',
      content_category: 'engagement',
      search_term: searchTerm,
      search_results_count: resultsCount
    });

    // GA4 search event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'search', {
        search_term: searchTerm
      });
    }
  }

  /**
   * Track filter usage
   */
  trackFilterUsage(filterType: string, filterValue: string, resultsCount: number) {
    this.pushToDataLayer({
      event: 'filter_products',
      page_category: 'ecommerce',
      page_slug: window.location.pathname,
      page_title: document.title,
      content_name: 'product_filter',
      content_category: 'engagement',
      filter_type: filterType,
      filter_value: filterValue,
      results_count: resultsCount
    });
  }

  /**
   * Track session quality metrics
   */
  trackSessionQuality(metrics: {
    timeOnPage: number;
    scrollDepth: number;
    interactionCount: number;
    pagesViewed: number;
  }) {
    this.pushToDataLayer({
      event: 'session_quality',
      page_category: 'engagement',
      page_slug: window.location.pathname,
      page_title: document.title,
      time_on_page: metrics.timeOnPage,
      scroll_depth: metrics.scrollDepth,
      interaction_count: metrics.interactionCount,
      pages_viewed: metrics.pagesViewed,
      engagement_score: this.calculateEngagementScore(metrics)
    });
  }

  private calculateEngagementScore(metrics: {
    timeOnPage: number;
    scrollDepth: number;
    interactionCount: number;
    pagesViewed: number;
  }): number {
    // Simple engagement scoring algorithm
    let score = 0;
    
    // Time on page (max 40 points)
    score += Math.min(metrics.timeOnPage / 1000 / 60 * 10, 40); // 10 points per minute, max 4 minutes
    
    // Scroll depth (max 30 points)
    score += metrics.scrollDepth * 30 / 100;
    
    // Interactions (max 20 points)
    score += Math.min(metrics.interactionCount * 5, 20); // 5 points per interaction, max 4 interactions
    
    // Pages viewed (max 10 points)
    score += Math.min(metrics.pagesViewed * 2, 10); // 2 points per page, max 5 pages
    
    return Math.round(score);
  }
}

/**
 * Create e-commerce analytics instance
 */
export const createEcommerceAnalytics = (platform: 'desktop' | 'mobile', attribution?: Record<string, unknown>) => {
  return new EcommerceAnalytics(platform, attribution);
};
