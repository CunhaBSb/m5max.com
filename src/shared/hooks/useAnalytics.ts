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
  const { consent, attribution } = useAppStore();

  // Inicializar dataLayer se não existir
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.dataLayer) {
      window.dataLayer = [];
    }
  }, []);

  const pushToDataLayer = (data: DataLayerEvent) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      // Adicionar dados de attribution se disponível
      const enrichedData = {
        ...data,
        ...attribution?.utm,
        gclid: attribution?.gclid,
        fbclid: attribution?.fbclid,
        event_id: `${data.event}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      
      window.dataLayer.push(enrichedData);
    }
  };

  const trackPageView = (params: PageViewParams) => {
    pushToDataLayer({
      event: 'page_view',
      page_category: params.page_category,
      page_slug: window.location.pathname,
      page_title: params.page_title,
      content_name: params.page_title,
      content_category: params.page_category
    });

    // GA4 pageview
    if (typeof window !== 'undefined' && window.gtag && config.ga4Id) {
      window.gtag('config', config.ga4Id, {
        page_title: params.page_title,
        page_location: params.page_location,
        content_group1: params.page_category
      });
    }

    // Meta Pixel PageView
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView', {
        content_name: params.page_title,
        content_category: params.page_category
      });
    }
  };

  const trackVideoEvent = (eventType: 'start' | 'progress_25' | 'progress_50' | 'progress_75' | 'complete' | 'click_to_play', params: VideoParams) => {
    const eventName = `video_${eventType}`;
    
    pushToDataLayer({
      event: eventName,
      page_category: 'general',
      page_slug: window.location.pathname,
      page_title: document.title,
      content_name: params.video_title,
      content_category: 'video'
    });

    // Meta Pixel video events
    if (typeof window !== 'undefined' && window.fbq) {
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
      page_slug: window.location.pathname,
      page_title: document.title,
      content_name: 'whatsapp_button',
      content_category: 'conversion'
    });

    // Meta Pixel Contact event
    if (typeof window !== 'undefined' && window.fbq) {
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
      page_category: params.form_type,
      page_slug: window.location.pathname,
      page_title: document.title,
      content_name: params.form_name,
      content_category: 'form',
      value: params.lead_score
    });

    // Meta Pixel form events
    if (typeof window !== 'undefined' && window.fbq) {
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
      page_slug: window.location.pathname,
      page_title: document.title,
      content_name: params.item_name,
      content_category: params.item_category,
      value: params.price,
      currency: params.currency || 'BRL'
    });

    // Meta Pixel product events
    if (typeof window !== 'undefined' && window.fbq) {
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
    pushToDataLayer({
      event: 'conversion_modal_open',
      page_category: audience,
      page_slug: window.location.pathname,
      page_title: document.title,
      content_name: 'conversion_modal',
      content_category: 'conversion'
    });
  };

  const trackScrollDepth = (depth: 25 | 50 | 75 | 100) => {
    pushToDataLayer({
      event: `scroll_depth_${depth}`,
      page_category: 'general',
      page_slug: window.location.pathname,
      page_title: document.title
    });
  };

  // Novos eventos específicos para produtos
  const trackProductInteraction = (eventType: 'select' | 'view_details' | 'compare', params: ProductInteractionParams) => {
    const eventName = `product_${eventType}`;
    
    pushToDataLayer({
      event: eventName,
      page_category: params.audience === 'b2b' ? 'b2b' : 'b2c',
      page_slug: window.location.pathname,
      page_title: document.title,
      content_name: params.product_name,
      content_category: params.product_category,
      value: params.price || 0,
      currency: 'BRL'
    });

    // GA4 Enhanced Ecommerce
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        item_id: params.product_id,
        item_name: params.product_name,
        item_category: params.product_category,
        item_category2: params.product_type,
        price: params.price || 0,
        currency: 'BRL',
        source: params.source
      });
    }

    // Meta Pixel
    if (typeof window !== 'undefined' && window.fbq) {
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
    if (typeof window !== 'undefined' && window.gtag) {
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
    if (typeof window !== 'undefined' && window.fbq) {
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
  const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
    pushToDataLayer({
      event: eventName,
      page_category: 'produtos',
      page_slug: window.location.pathname,
      page_title: document.title,
      ...properties
    });
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
    trackEvent
  };
};
