// Google Analytics 4 e tracking events

import type { TrackingEvent, PublicSegment } from "@/types";

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void;
    dataLayer: any[];
  }
}

// Initialize GA4
export const initializeGA4 = (measurementId: string) => {
  if (typeof window === 'undefined') return;

  // Create script tag
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    send_page_view: false, // We'll handle page views manually
  });
};

// Track page view
export const trackPageView = (url: string, title?: string, segment?: PublicSegment) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'page_view', {
    page_title: title || document.title,
    page_location: url,
    audience_segment: segment,
  });
};

// Track custom events
export const trackEvent = (eventData: TrackingEvent) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', eventData.event, {
    event_category: eventData.event_category,
    event_label: eventData.event_label,
    value: eventData.value,
    audience_segment: eventData.audience_segment,
    ...eventData.custom_parameters,
  });
};

// Predefined tracking functions
export const analytics = {
  // WhatsApp click
  whatsappClick: (segment?: PublicSegment, location?: string) => {
    trackEvent({
      event: 'whatsapp_click',
      event_category: 'Contact',
      event_label: location || 'Button',
      audience_segment: segment,
      value: 1,
    });
  },

  // Lead form submit
  leadFormSubmit: (segment: PublicSegment, formType?: string) => {
    trackEvent({
      event: 'lead_form_submit',
      event_category: 'Form',
      event_label: formType || 'Contact Form',
      audience_segment: segment,
      value: 1,
    });
  },

  // File download (lead magnets)
  fileDownload: (fileName: string, segment?: PublicSegment) => {
    trackEvent({
      event: 'file_download',
      event_category: 'Download',
      event_label: fileName,
      audience_segment: segment,
      value: 1,
    });
  },

  // Select item (service/kit selection)
  selectItem: (itemName: string, segment: PublicSegment, category?: string) => {
    trackEvent({
      event: 'select_item',
      event_category: category || 'Service',
      event_label: itemName,
      audience_segment: segment,
      custom_parameters: {
        item_name: itemName,
        item_category: category,
      },
    });
  },

  // Begin checkout (for kit purchases)
  beginCheckout: (value: number, currency: string = 'BRL', items?: string[]) => {
    trackEvent({
      event: 'begin_checkout',
      event_category: 'Ecommerce',
      value: value,
      custom_parameters: {
        currency,
        items: items?.join(','),
      },
    });
  },

  // Custom event for segment navigation
  segmentNavigation: (segment: PublicSegment, source: string) => {
    trackEvent({
      event: 'segment_navigation',
      event_category: 'Navigation',
      event_label: source,
      audience_segment: segment,
    });
  },
};

// Meta Pixel integration
export const initializeMetaPixel = (pixelId: string) => {
  if (typeof window === 'undefined') return;

  // Create fbq function
  const fbq = function() {
    // @ts-ignore
    fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
  };
  
  // @ts-ignore
  if (!window.fbq) window.fbq = fbq;
  // @ts-ignore
  fbq.push = fbq;
  // @ts-ignore
  fbq.loaded = true;
  // @ts-ignore
  fbq.version = '2.0';
  // @ts-ignore
  fbq.queue = [];

  // Load script
  const script = document.createElement('script');
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  script.async = true;
  document.head.appendChild(script);

  // Initialize pixel
  // @ts-ignore
  window.fbq('init', pixelId);
  // @ts-ignore
  window.fbq('track', 'PageView');
};

// Meta Pixel events
export const metaPixel = {
  track: (event: string, parameters?: any) => {
    if (typeof window === 'undefined' || !window.fbq) return;
    // @ts-ignore
    window.fbq('track', event, parameters);
  },

  trackCustom: (event: string, parameters?: any) => {
    if (typeof window === 'undefined' || !window.fbq) return;
    // @ts-ignore
    window.fbq('trackCustom', event, parameters);
  },

  // Predefined events
  lead: (segment?: PublicSegment) => {
    metaPixel.track('Lead', {
      content_category: segment,
      content_name: `Lead - ${segment}`,
    });
  },

  contact: (method: string, segment?: PublicSegment) => {
    metaPixel.trackCustom('Contact', {
      method: method,
      content_category: segment,
    });
  },
};

// Consent management (LGPD compliance)
export const consentManager = {
  // Check if user has given consent
  hasConsent: (): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('cookie-consent') === 'accepted';
  },

  // Grant consent
  grantConsent: () => {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());

    // Enable GA4 and Meta Pixel after consent
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
      });
    }
  },

  // Revoke consent
  revokeConsent: () => {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('cookie-consent', 'denied');
    localStorage.removeItem('cookie-consent-date');

    // Update consent for GA4
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
      });
    }
  },

  // Initialize with denied consent (LGPD requirement)
  initializeConsent: () => {
    if (typeof window === 'undefined') return;

    // Set default consent to denied
    if (window.gtag) {
      window.gtag('consent', 'default', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        wait_for_update: 500,
      });
    }

    // If user has already consented, update
    if (consentManager.hasConsent()) {
      consentManager.grantConsent();
    }
  },
};