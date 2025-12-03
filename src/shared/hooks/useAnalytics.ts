import { useEffect } from 'react';
import config from '@/shared/lib/config';
import { useAppStore } from '@/shared/store/appStore';
import { 
  PageViewParams, 
  VideoParams, 
  WhatsAppParams, 
  FormParams, 
  ProductParams,
  ProductInteractionParams,
  QuoteRequestParams,
  DataLayerEvent 
} from '@/shared/types/analytics';
import { AudienceType } from '@/shared/types/common';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    fbq: (...args: unknown[]) => void;
  }
}

export const useAnalytics = () => {
  const { consent: userConsent, attribution } = useAppStore();

  const safeLocation = () => {
    if (typeof window !== 'undefined' && window.location) {
      return window.location;
    }
    return { pathname: '', href: '', search: '' } as Location;
  };

  const safeTitle = () => (typeof document !== 'undefined' ? document.title : '');

  // Inicializar dataLayer se não existir
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.dataLayer) {
      window.dataLayer = [];
    }
  }, []);

  const pushToDataLayer = (data: DataLayerEvent) => {
    if (typeof window === 'undefined' || !window.dataLayer) return;

    // Consent: em produção respeitamos; em dev/staging liberamos para QA
    const isProd = config.environment === 'production';
    if (userConsent && userConsent.analytics_storage === 'denied' && isProd) {
      console.debug('[Analytics] Tracking blocked - analytics consent denied');
      return;
    }

    // Adicionar dados de attribution se disponível
    const enrichedData = {
      ...data,
      ...attribution?.utm,
      gclid: attribution?.gclid,
      fbclid: attribution?.fbclid,
      event_id: `${data.event}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    window.dataLayer.push(enrichedData);
  };

  const trackPageView = (params: PageViewParams) => {
    const loc = safeLocation();

    pushToDataLayer({
      event: 'page_view',
      page_category: params.page_category,
      page_slug: loc.pathname,
      page_title: params.page_title,
      content_name: params.page_title,
      content_category: params.page_category
    });

    // GA4 pageview
    const debugMode =
      typeof window !== 'undefined' && typeof loc.search === 'string' && loc.search.includes('debug_ga=1');

    if (consentAllowsPixels() && typeof window !== 'undefined' && window.gtag && config.ga4Id) {
      const gaConfig: Record<string, unknown> = {
        page_title: params.page_title,
        page_location: params.page_location,
        content_group1: params.page_category,
      };

      if (debugMode) gaConfig.debug_mode = true;

      window.gtag('config', config.ga4Id, gaConfig);
    }

    // Meta Pixel PageView
    if (consentAllowsPixels() && typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView', {
        content_name: params.page_title,
        content_category: params.page_category
      });
    }
  };

  const trackVideoEvent = (
    eventType: 'start' | 'progress_25' | 'progress_50' | 'progress_75' | 'progress_90' | 'complete' | 'click_to_play',
    params: VideoParams
  ) => {
    const eventName = `video_${eventType}`;
    const loc = safeLocation();
    const debugMode =
      typeof window !== 'undefined' && typeof loc.search === 'string' && loc.search.includes('debug_ga=1');
    
    pushToDataLayer({
      event: eventName,
      page_category: 'general',
      page_slug: loc.pathname,
      page_title: safeTitle(),
      content_name: params.video_title,
      content_category: 'video'
    });

    // GA4 video events
    if (!config.ga4Id) {
      console.warn('[Analytics] GA4 ID ausente, evento não enviado para GA4:', eventType);
    }

    if (consentAllowsPixels() && typeof window !== 'undefined' && window.gtag && config.ga4Id) {
      const gaEvent =
        eventType === 'start' ? 'video_start' :
        eventType === 'complete' ? 'video_complete' :
        eventType === 'click_to_play' ? 'video_click' : 'video_progress';

      const isProgress = ['progress_25','progress_50','progress_75','progress_90'].includes(eventType);
      window.gtag('event', gaEvent, {
        video_title: params.video_title,
        video_provider: params.video_provider,
        video_percent: isProgress ? Number(eventType.split('_')[1]) : undefined,
        page_location: loc.href,
        debug_mode: debugMode
      });
    }

    // Meta Pixel video events
    if (consentAllowsPixels() && typeof window !== 'undefined' && window.fbq) {
      const fbEventName = eventType === 'start' ? 'VideoView' : 
                         eventType === 'progress_50' ? 'Video50Percent' : 
                         eventType === 'complete' ? 'VideoComplete' :
                         eventType === 'click_to_play' ? 'VideoView' : 'VideoProgress';
      window.fbq('track', fbEventName, {
        content_name: params.video_title,
        video_provider: params.video_provider
      });
    }
  };

  const trackWhatsAppClick = (params: WhatsAppParams) => {
    pushToDataLayer({
      event: 'whatsapp_click',
      page_category: params.audience,
      page_slug: safeLocation().pathname,
      page_title: safeTitle(),
      content_name: 'whatsapp_button',
      content_category: 'conversion'
    });

    // GA4 Contact
    if (consentAllowsPixels() && typeof window !== 'undefined' && window.gtag && config.ga4Id) {
      window.gtag('event', 'contact', {
        method: 'whatsapp',
        content_type: params.audience,
        source: params.source,
        page_location: safeLocation().href,
        page_title: safeTitle()
      });
    }

    // Meta Pixel Contact event
    if (consentAllowsPixels() && typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Contact', {
        content_name: 'whatsapp',
        content_category: params.audience
      });
    }
  };

  const trackFormEvent = (eventType: 'start' | 'submit', params: FormParams) => {
    const eventName = `lead_form_${eventType}`;
    
    pushToDataLayer({
      event: eventName,
      page_category: params.page_category || params.form_type,
      page_slug: safeLocation().pathname,
      page_title: safeTitle(),
      content_name: params.form_name,
      content_category: 'form',
      value: params.lead_score
    });

    // GA4 Lead funnel
    if (consentAllowsPixels() && typeof window !== 'undefined' && window.gtag && config.ga4Id) {
      if (eventType === 'start') {
        window.gtag('event', 'begin_checkout', {
          item_list_name: params.form_type,
          value: params.lead_score,
          currency: 'BRL',
          source: params.source,
          page_location: safeLocation().href
        });
      } else {
        window.gtag('event', 'generate_lead', {
          value: params.lead_score,
          currency: 'BRL',
          form_name: params.form_name,
          form_type: params.form_type,
          source: params.source,
          page_location: safeLocation().href
        });
      }
    }

    // Meta Pixel form events
    if (consentAllowsPixels() && typeof window !== 'undefined' && window.fbq) {
      const fbEventName = eventType === 'start' ? 'InitiateCheckout' : 'Lead';
      window.fbq('track', fbEventName, {
        content_name: params.form_name,
        content_category: params.form_type,
        value: params.lead_score
      });
    }
  };

  const trackProductEvent = (eventType: 'view' | 'select', params: ProductParams) => {
    const eventName = eventType === 'view' ? 'view_item' : 'select_item';
    
    pushToDataLayer({
      event: eventName,
      page_category: params.audience,
      page_slug: safeLocation().pathname,
      page_title: safeTitle(),
      content_name: params.item_name,
      content_category: params.item_category,
      value: params.price,
      currency: params.currency || 'BRL'
    });

    // GA4 ecommerce events
    if (consentAllowsPixels() && typeof window !== 'undefined' && window.gtag && config.ga4Id) {
      const items = [
        {
          item_id: params.item_id,
          item_name: params.item_name,
          item_category: params.item_category,
          item_variant: params.item_variant,
          price: params.price,
          currency: params.currency || 'BRL'
        }
      ];

      window.gtag('event', eventName, {
        items,
        value: params.price,
        currency: params.currency || 'BRL',
        source: params.source
      });
    }

    // Meta Pixel product events
    if (consentAllowsPixels() && typeof window !== 'undefined' && window.fbq) {
      const fbEventName = eventType === 'view' ? 'ViewContent' : 'AddToCart';
      window.fbq('track', fbEventName, {
        content_name: params.item_name,
        content_category: params.item_category,
        content_ids: [params.item_id],
        value: params.price,
        currency: params.currency || 'BRL'
      });
    }
  };

  const trackConversionModalOpen = (audience: AudienceType, source: string) => {
    const loc = safeLocation();
    pushToDataLayer({
      event: 'conversion_modal_open',
      page_category: audience,
      page_slug: loc.pathname,
      page_title: safeTitle(),
      content_name: 'conversion_modal',
      content_category: 'conversion'
    });
  };

  const trackScrollDepth = (depth: 25 | 50 | 75 | 100) => {
    const loc = safeLocation();
    pushToDataLayer({
      event: `scroll_depth_${depth}`,
      page_category: 'general',
      page_slug: loc.pathname,
      page_title: safeTitle()
    });
  };

  // Novos eventos específicos para produtos
  const trackProductInteraction = (eventType: 'select' | 'view_details' | 'compare', params: ProductInteractionParams) => {
    const eventName = `product_${eventType}`;
    const loc = safeLocation();

    pushToDataLayer({
      event: eventName,
      page_category: params.audience === 'b2b' ? 'b2b' : 'b2c',
      page_slug: loc.pathname,
      page_title: safeTitle(),
      content_name: params.product_name,
      content_category: params.product_category,
      value: params.price || 0,
      currency: 'BRL'
    });

    // GA4 Enhanced Ecommerce
    if (consentAllowsPixels() && typeof window !== 'undefined' && window.gtag && config.ga4Id) {
      window.gtag('event', eventName, {
        items: [
          {
            item_id: params.product_id,
            item_name: params.product_name,
            item_category: params.product_category,
            item_category2: params.product_type,
            price: params.price || 0,
            currency: 'BRL'
          }
        ],
        value: params.price || 0,
        currency: 'BRL',
        source: params.source
      });
    }

    // Meta Pixel
    if (consentAllowsPixels() && typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_name: params.product_name,
        content_category: params.product_category,
        content_ids: [params.product_id],
        content_type: 'product',
        value: params.price || 0,
        currency: 'BRL'
      });
    }
  };

  const trackQuoteRequest = (params: QuoteRequestParams) => {
    pushToDataLayer({
      event: 'quote_request',
      page_category: params.audience,
      page_slug: window.location.pathname,
      page_title: document.title,
      content_name: params.product_name || 'Quote Request',
      content_category: params.category || 'general',
      value: params.estimated_value || 0,
      currency: 'BRL'
    });

    // GA4 Lead Generation
    if (consentAllowsPixels() && typeof window !== 'undefined' && window.gtag && config.ga4Id) {
      window.gtag('event', 'generate_lead', {
        item_id: params.product_id,
        item_name: params.product_name,
        item_category: params.category,
        value: params.estimated_value || 0,
        currency: 'BRL',
        source: params.source,
        audience: params.audience
      });
    }

    // Meta Pixel Lead
    if (consentAllowsPixels() && typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Lead', {
        content_name: params.product_name || 'Quote Request',
        content_category: params.category || 'general',
        content_ids: params.product_id ? [params.product_id] : [],
        value: params.estimated_value || 0,
        currency: 'BRL',
        source: params.source
      });
    }
  };

  const trackCategorySwitch = (fromCategory: string, toCategory: string, source: string) => {
    pushToDataLayer({
      event: 'category_switch',
      page_category: 'produtos',
      page_slug: window.location.pathname,
      page_title: document.title,
      content_name: `${fromCategory}_to_${toCategory}`,
      content_category: 'navigation'
    });
  };

  // Método genérico para eventos customizados
  const trackEvent = (
    eventName: string,
    properties?: Record<string, unknown> & { page_category?: DataLayerEvent['page_category'] }
  ) => {
    pushToDataLayer({
      event: eventName,
      page_category: properties?.page_category || 'general',
      page_slug: window.location.pathname,
      page_title: document.title,
      ...properties
    });
  };

  // FASE 3: OTIMIZAÇÕES

  /**
   * Platform Detection - Rastreia mudanças entre desktop/mobile
   */
  const trackPlatformSwitch = (from: 'desktop' | 'mobile', to: 'desktop' | 'mobile') => {
    pushToDataLayer({
      event: 'platform_switch',
      page_category: 'general',
      page_slug: window.location.pathname,
      page_title: document.title,
      content_name: 'platform_detection',
      content_category: 'ux',
      from_platform: from,
      to_platform: to,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight
    });

    // GA4 custom event
    if (consentAllowsPixels() && typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'platform_switch', {
        from_platform: from,
        to_platform: to,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`
      });
    }
  };

  /**
   * Core Web Vitals - Rastreia métricas de performance
   */
  const trackWebVitals = (metric: {
    name: 'FCP' | 'LCP' | 'CLS' | 'FID' | 'TTFB' | 'INP';
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
    delta?: number;
  }) => {
    pushToDataLayer({
      event: 'web_vitals',
      page_category: 'general',
      page_slug: window.location.pathname,
      page_title: document.title,
      content_name: metric.name,
      content_category: 'core_web_vitals',
      metric_name: metric.name,
      metric_value: metric.value,
      metric_rating: metric.rating,
      metric_delta: metric.delta || 0
    });

    // GA4 web vitals
    if (consentAllowsPixels() && typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: metric.name,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        metric_rating: metric.rating,
        non_interaction: true
      });
    }
  };

  /**
   * Session Quality - Calcula e rastreia score de engajamento
   */
  const trackSessionQuality = (metrics: {
    timeOnPage: number;      // em segundos
    scrollDepth: number;      // 0-100%
    interactionCount: number; // cliques, scrolls, etc
    pagesViewed: number;
  }) => {
    // Algoritmo de scoring (max 100 pontos)
    const calculateScore = () => {
      let score = 0;

      // Tempo na página (max 40 pontos)
      // 10 pontos por minuto, max 4 minutos
      score += Math.min((metrics.timeOnPage / 60) * 10, 40);

      // Profundidade de scroll (max 30 pontos)
      score += (metrics.scrollDepth / 100) * 30;

      // Interações (max 20 pontos)
      // 5 pontos por interação, max 4 interações
      score += Math.min(metrics.interactionCount * 5, 20);

      // Páginas visitadas (max 10 pontos)
      // 2 pontos por página, max 5 páginas
      score += Math.min(metrics.pagesViewed * 2, 10);

      return Math.round(score);
    };

    const engagementScore = calculateScore();
    const engagementLevel =
      engagementScore >= 70 ? 'high' :
      engagementScore >= 40 ? 'medium' : 'low';

    pushToDataLayer({
      event: 'session_quality',
      page_category: 'general',
      page_slug: window.location.pathname,
      page_title: document.title,
      content_name: 'session_metrics',
      content_category: 'quality',
      time_on_page: metrics.timeOnPage,
      scroll_depth: metrics.scrollDepth,
      interaction_count: metrics.interactionCount,
      pages_viewed: metrics.pagesViewed,
      engagement_score: engagementScore,
      engagement_level: engagementLevel
    });

    // GA4 engagement event
    if (consentAllowsPixels() && typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'session_quality', {
        engagement_score: engagementScore,
        engagement_level: engagementLevel,
        time_on_page: metrics.timeOnPage,
        scroll_depth: metrics.scrollDepth,
        interaction_count: metrics.interactionCount,
        pages_viewed: metrics.pagesViewed
      });
    }

    // Meta Pixel custom event
    if (consentAllowsPixels() && typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', 'SessionQuality', {
        engagement_score: engagementScore,
        engagement_level: engagementLevel
      });
    }
  };

  // Google Ads conversion helper (gtag)
  const trackAdsConversion = (sendTo: string, value = 1, currency = 'BRL') => {
    if (!consentAllowsPixels()) return;
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: sendTo,
        value,
        currency,
      });
    }
  };

  const consentAllowsPixels = () => {
    const isProd = config.environment === 'production';
    if (!userConsent || !isProd) return true; // Em dev liberamos para QA
    const { analytics_storage, ad_storage, ad_user_data, ad_personalization } = userConsent;
    return [analytics_storage, ad_storage, ad_user_data, ad_personalization].every((v) => v !== 'denied');
  };

  return {
    trackPageView,
    trackVideoEvent,
    trackWhatsAppClick,
    trackFormEvent,
    trackProductEvent,
    trackConversionModalOpen,
    trackScrollDepth,
    // Novos métodos para produtos
    trackProductInteraction,
    trackQuoteRequest,
    trackCategorySwitch,
    trackEvent,
    trackAdsConversion,
    // FASE 3: Otimizações
    trackPlatformSwitch,
    trackWebVitals,
    trackSessionQuality
  };
};
