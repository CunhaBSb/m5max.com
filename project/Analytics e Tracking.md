# Analytics e Tracking - M5 Max Produções

## 1. Arquitetura de Analytics

### 1.1 Stack Completo
```
Usuario → Website → GTM → GA4 + Meta Pixel
                 ↓
            Consent Mode v2
                 ↓
         Server-Side Tagging (Futuro)
                 ↓
          Conversions API (Meta)
```

### 1.2 Implementação GTM
```typescript
// src/lib/gtm.ts
interface GTMEvent {
  event: string;
  [key: string]: any;
}

class GTMManager {
  private gtmId: string;
  private isInitialized = false;

  constructor(gtmId: string) {
    this.gtmId = gtmId;
  }

  // Inicializar GTM
  init() {
    if (this.isInitialized || !this.gtmId) return;

    // Criar dataLayer
    window.dataLayer = window.dataLayer || [];

    // Consent Mode v2 - configuração padrão
    this.gtag('consent', 'default', {
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      ad_storage: 'denied',
      analytics_storage: 'denied',
      functionality_storage: 'granted',
      security_storage: 'granted',
      wait_for_update: 500
    });

    // Inserir script GTM
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${this.gtmId}`;
    
    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode?.insertBefore(script, firstScript);

    // Configurar dataLayer inicial
    this.gtag('js', new Date());
    this.gtag('config', this.gtmId);

    this.isInitialized = true;
  }

  // Função gtag helper
  private gtag(...args: any[]) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
  }

  // Enviar evento customizado
  pushEvent(event: GTMEvent) {
    if (!this.isInitialized) {
      console.warn('GTM not initialized');
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(event);
  }

  // Atualizar consentimento
  updateConsent(consent: Record<string, 'granted' | 'denied'>) {
    this.gtag('consent', 'update', consent);
  }

  // Configurar usuário ID
  setUserId(userId: string) {
    this.gtag('config', this.gtmId, {
      user_id: userId
    });
  }
}

export default GTMManager;
```

### 1.3 Hook de Analytics
```typescript
// src/hooks/useAnalytics.ts
import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import GTMManager from '@/lib/gtm';
import config from '@/utils/config';

const gtmManager = new GTMManager(config.gtmId);

interface TrackEventProps {
  event: string;
  properties?: Record<string, any>;
}

export const useAnalytics = () => {
  const location = useLocation();
  const { attribution, consent, currentAudience } = useAppStore();

  // Inicializar GTM na primeira execução
  useEffect(() => {
    gtmManager.init();
  }, []);

  // Trackear mudanças de página
  useEffect(() => {
    trackPageView();
  }, [location.pathname]);

  // Atualizar consentimento quando mudar
  useEffect(() => {
    gtmManager.updateConsent(consent);
  }, [consent]);

  const trackPageView = useCallback(() => {
    const pageData = {
      event: 'page_view',
      page_category: currentAudience,
      page_slug: location.pathname,
      page_title: document.title,
      page_referrer: document.referrer,
      ...attribution?.utm
    };

    gtmManager.pushEvent(pageData);
  }, [location, currentAudience, attribution]);

  const trackEvent = useCallback((eventName: string, properties: Record<string, any> = {}) => {
    const eventData = {
      event: eventName,
      audience_segment: currentAudience,
      page_slug: location.pathname,
      timestamp: Date.now(),
      ...properties,
      ...attribution?.utm
    };

    gtmManager.pushEvent(eventData);
  }, [currentAudience, location, attribution]);

  const trackConversion = useCallback((conversionData: {
    type: 'whatsapp' | 'form';
    audience: string;
    source: string;
    value?: number;
    leadScore?: number;
  }) => {
    const eventData = {
      event: conversionData.type === 'whatsapp' ? 'whatsapp_click' : 'lead_form_submit',
      conversion_type: conversionData.type,
      audience_segment: conversionData.audience,
      source: conversionData.source,
      value: conversionData.value || 0,
      currency: 'BRL',
      lead_score: conversionData.leadScore || 0,
      ...attribution?.utm
    };

    gtmManager.pushEvent(eventData);

    // Enviar também como Meta Pixel
    if (conversionData.type === 'form') {
      trackMetaPixelEvent('Lead', {
        value: conversionData.value,
        currency: 'BRL',
        content_category: conversionData.audience
      });
    } else {
      trackMetaPixelEvent('Contact', {
        content_category: conversionData.audience
      });
    }
  }, [attribution]);

  const trackProductInteraction = useCallback((productData: {
    action: 'view' | 'select' | 'checkout';
    productId: string;
    productName: string;
    price?: number;
    category: string;
  }) => {
    const eventMapping = {
      view: 'view_item',
      select: 'select_item',
      checkout: 'begin_checkout'
    };

    const eventData = {
      event: eventMapping[productData.action],
      item_id: productData.productId,
      item_name: productData.productName,
      item_category: productData.category,
      price: productData.price || 0,
      currency: 'BRL',
      ...attribution?.utm
    };

    gtmManager.pushEvent(eventData);

    // Meta Pixel equivalente
    if (productData.action === 'view') {
      trackMetaPixelEvent('ViewContent', {
        content_ids: [productData.productId],
        content_name: productData.productName,
        content_category: productData.category,
        value: productData.price,
        currency: 'BRL'
      });
    } else if (productData.action === 'checkout') {
      trackMetaPixelEvent('InitiateCheckout', {
        content_ids: [productData.productId],
        value: productData.price,
        currency: 'BRL'
      });
    }
  }, [attribution]);

  const trackVideoEngagement = useCallback((videoData: {
    action: 'start' | 'progress_25' | 'progress_50' | 'progress_75' | 'complete';
    videoId: string;
    videoTitle: string;
    progress?: number;
  }) => {
    const eventData = {
      event: `video_${videoData.action}`,
      video_id: videoData.videoId,
      video_title: videoData.videoTitle,
      video_progress: videoData.progress || 0,
      ...attribution?.utm
    };

    gtmManager.pushEvent(eventData);
  }, [attribution]);

  // Meta Pixel helper
  const trackMetaPixelEvent = (eventName: string, parameters: Record<string, any> = {}) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', eventName, parameters);
    }
  };

  return {
    trackEvent,
    trackPageView,
    trackConversion,
    trackProductInteraction,
    trackVideoEngagement,
    trackMetaPixelEvent
  };
};
```

## 2. Consent Management

### 2.1 Consent Banner Component
```typescript
// src/components/analytics/ConsentBanner.tsx
import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Shield, Settings, X } from 'lucide-react';

export const ConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { consent, updateConsent } = useAppStore();

  useEffect(() => {
    // Verificar se já deu consentimento
    const hasConsented = localStorage.getItem('m5_consent_given');
    if (!hasConsented) {
      setIsVisible(true);
    }
  }, []);

  const acceptAll = () => {
    const newConsent = {
      ad_storage: 'granted' as const,
      ad_user_data: 'granted' as const,
      ad_personalization: 'granted' as const,
      analytics_storage: 'granted' as const,
      functionality_storage: 'granted' as const,
      security_storage: 'granted' as const
    };

    updateConsent(newConsent);
    localStorage.setItem('m5_consent_given', 'all');
    setIsVisible(false);
  };

  const acceptEssential = () => {
    const newConsent = {
      ad_storage: 'denied' as const,
      ad_user_data: 'denied' as const,
      ad_personalization: 'denied' as const,
      analytics_storage: 'granted' as const,
      functionality_storage: 'granted' as const,
      security_storage: 'granted' as const
    };

    updateConsent(newConsent);
    localStorage.setItem('m5_consent_given', 'essential');
    setIsVisible(false);
  };

  const saveCustomSettings = (customConsent: Record<string, 'granted' | 'denied'>) => {
    updateConsent(customConsent);
    localStorage.setItem('m5_consent_given', 'custom');
    localStorage.setItem('m5_consent_settings', JSON.stringify(customConsent));
    setIsVisible(false);
    setShowSettings(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card variant="elevated" padding="lg" className="max-w-4xl mx-auto">
        {!showSettings ? (
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Shield className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Cookies e Privacidade
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Utilizamos cookies essenciais para o funcionamento do site e cookies 
                  opcionais para melhorar sua experiência e personalizar anúncios. 
                  Você pode escolher quais aceitar.
                </p>
                <button
                  onClick={() => setShowSettings(true)}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2"
                >
                  Ver detalhes e configurações
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
              <Button
                variant="outline"
                onClick={acceptEssential}
                size="md"
              >
                Apenas Essenciais
              </Button>
              <Button
                variant="primary"
                onClick={acceptAll}
                size="md"
              >
                Aceitar Todos
              </Button>
            </div>
          </div>
        ) : (
          <ConsentSettings
            onSave={saveCustomSettings}
            onBack={() => setShowSettings(false)}
            currentConsent={consent}
          />
        )}
      </Card>
    </div>
  );
};

interface ConsentSettingsProps {
  onSave: (consent: Record<string, 'granted' | 'denied'>) => void;
  onBack: () => void;
  currentConsent: Record<string, 'granted' | 'denied'>;
}

const ConsentSettings: React.FC<ConsentSettingsProps> = ({
  onSave,
  onBack,
  currentConsent
}) => {
  const [settings, setSettings] = useState(currentConsent);

  const cookieCategories = [
    {
      key: 'functionality_storage',
      name: 'Cookies Essenciais',
      description: 'Necessários para o funcionamento básico do site',
      required: true
    },
    {
      key: 'security_storage',
      name: 'Cookies de Segurança',
      description: 'Protegem contra ataques e fraudes',
      required: true
    },
    {
      key: 'analytics_storage',
      name: 'Cookies de Analytics',
      description: 'Nos ajudam a entender como você usa o site'
    },
    {
      key: 'ad_storage',
      name: 'Cookies de Publicidade',
      description: 'Permitem anúncios personalizados'
    },
    {
      key: 'ad_personalization',
      name: 'Personalização de Anúncios',
      description: 'Personalizam anúncios baseados em seus interesses'
    }
  ];

  const handleToggle = (key: string) => {
    if (key === 'functionality_storage' || key === 'security_storage') return;
    
    setSettings(prev => ({
      ...prev,
      [key]: prev[key] === 'granted' ? 'denied' : 'granted'
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Configurações de Cookies</h3>
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {cookieCategories.map(category => (
          <div key={category.key} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{category.name}</h4>
                {category.required && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    Obrigatório
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">{category.description}</p>
            </div>
            
            <label className="flex items-center ml-4">
              <input
                type="checkbox"
                checked={settings[category.key] === 'granted'}
                onChange={() => handleToggle(category.key)}
                disabled={category.required}
                className="sr-only"
              />
              <div className={`
                relative w-12 h-6 rounded-full transition-colors duration-200
                ${settings[category.key] === 'granted' ? 'bg-primary-600' : 'bg-gray-300'}
                ${category.required ? 'opacity-50' : 'cursor-pointer'}
              `}>
                <div className={`
                  absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200
                  ${settings[category.key] === 'granted' ? 'translate-x-7' : 'translate-x-1'}
                `} />
              </div>
            </label>
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Voltar
        </Button>
        <Button variant="primary" onClick={() => onSave(settings)} className="flex-1">
          Salvar Preferências
        </Button>
      </div>
    </div>
  );
};
```

## 3. Attribution Tracking

### 3.1 Hook de Attribution
```typescript
// src/hooks/useAttribution.ts
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';

interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

interface AttributionData {
  utm: UTMParams;
  gclid?: string;
  fbclid?: string;
  referrer: string;
  landingPage: string;
  timestamp: number;
  sessionId: string;
}

export const useAttribution = () => {
  const location = useLocation();
  const { attribution, setAttribution } = useAppStore();
  const [sessionId] = useState(() => generateSessionId());

  useEffect(() => {
    captureAttribution();
  }, [location.search]);

  const generateSessionId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const captureAttribution = () => {
    const urlParams = new URLSearchParams(location.search);
    
    // Capturar UTMs
    const utm: UTMParams = {
      utm_source: urlParams.get('utm_source') || undefined,
      utm_medium: urlParams.get('utm_medium') || undefined,
      utm_campaign: urlParams.get('utm_campaign') || undefined,
      utm_content: urlParams.get('utm_content') || undefined,
      utm_term: urlParams.get('utm_term') || undefined
    };

    // Capturar click IDs
    const gclid = urlParams.get('gclid') || undefined;
    const fbclid = urlParams.get('fbclid') || undefined;

    // Detectar source automático se não tiver UTM
    if (!utm.utm_source) {
      utm.utm_source = detectTrafficSource();
    }

    const newAttribution: AttributionData = {
      utm,
      gclid,
      fbclid,
      referrer: document.referrer,
      landingPage: window.location.href,
      timestamp: Date.now(),
      sessionId
    };

    // Salvar attribution apenas se houver dados relevantes
    const hasAttributionData = Object.values(utm).some(value => value) || gclid || fbclid;
    
    if (hasAttributionData || !attribution) {
      setAttribution(newAttribution);
      
      // Persistir no localStorage (com expiração de 30 dias)
      const expirationTime = Date.now() + (30 * 24 * 60 * 60 * 1000);
      localStorage.setItem('m5_attribution', JSON.stringify({
        ...newAttribution,
        expires: expirationTime
      }));
    }
  };

  const detectTrafficSource = (): string => {
    const referrer = document.referrer.toLowerCase();
    
    if (!referrer) return 'direct';
    
    if (referrer.includes('google.')) return 'google';
    if (referrer.includes('facebook.') || referrer.includes('fb.')) return 'facebook';
    if (referrer.includes('instagram.')) return 'instagram';
    if (referrer.includes('youtube.')) return 'youtube';
    if (referrer.includes('linkedin.')) return 'linkedin';
    if (referrer.includes('twitter.') || referrer.includes('t.co')) return 'twitter';
    
    return 'referral';
  };

  // Recuperar attribution do localStorage se não existir
  useEffect(() => {
    if (!attribution) {
      const stored = localStorage.getItem('m5_attribution');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.expires > Date.now()) {
            setAttribution(parsed);
          } else {
            localStorage.removeItem('m5_attribution');
          }
        } catch (error) {
          console.error('Error parsing stored attribution:', error);
          localStorage.removeItem('m5_attribution');
        }
      }
    }
  }, [attribution, setAttribution]);

  const getAttributionForWhatsApp = (): string => {
    if (!attribution?.utm) return '';

    const params = new URLSearchParams();
    Object.entries(attribution.utm).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    if (attribution.gclid) params.append('gclid', attribution.gclid);
    if (attribution.fbclid) params.append('fbclid', attribution.fbclid);

    return params.toString();
  };

  return {
    attribution,
    getAttributionForWhatsApp,
    sessionId
  };
};
```

## 4. WhatsApp Integration com Tracking

### 4.1 WhatsApp Utilities
```typescript
// src/utils/whatsapp.ts
import { COMPANY_INFO } from './constants';
import { AttributionData } from '@/types/analytics';

interface WhatsAppMessageData {
  audience: 'b2b' | 'cha' | 'kits';
  context?: {
    eventType?: string;
    cityUF?: string;
    eventDate?: string;
    productId?: string;
    kitType?: string;
  };
}

export const generateWhatsAppMessage = (data: WhatsAppMessageData): string => {
  const { audience, context = {} } = data;

  switch (audience) {
    case 'b2b':
      return `Olá M5! Quero orçamento para ${context.eventType || 'evento'} em ${context.cityUF || '[cidade/UF]'} dia ${context.eventDate || '[data]'}.`;
    
    case 'cha':
      return `Olá M5! Quero kit ${context.kitType || 'chá revelação'} para ${context.eventDate || '[data]'}.`;
    
    case 'kits':
      return `Olá M5! Quero kit ${context.eventType || 'DIY'} para ${context.eventDate || '[data]'}.`;
    
    default:
      return 'Olá M5! Gostaria de mais informações sobre seus serviços.';
  }
};

export const generateWhatsAppURL = (
  message: string,
  attribution: AttributionData | null,
  trackingData: {
    audience: string;
    source: string;
    page?: string;
  }
): string => {
  const baseUrl = `https://wa.me/${COMPANY_INFO.whatsapp}`;
  const encodedMessage = encodeURIComponent(message);
  
  const params = new URLSearchParams({
    text: encodedMessage
  });

  // Adicionar UTMs se existir attribution
  if (attribution?.utm) {
    Object.entries(attribution.utm).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
  }

  // Adicionar tracking específico do WhatsApp
  params.append('utm_source', attribution?.utm?.utm_source || 'website');
  params.append('utm_medium', 'whatsapp');
  params.append('utm_campaign', `${trackingData.audience}-whatsapp-${new Date().getFullYear()}`);
  params.append('utm_content', trackingData.source);

  // Adicionar click IDs se existirem
  if (attribution?.gclid) params.append('gclid', attribution.gclid);
  if (attribution?.fbclid) params.append('fbclid', attribution.fbclid);

  // Adicionar dados de tracking interno
  params.append('wa_source', trackingData.source);
  params.append('wa_audience', trackingData.audience);
  if (trackingData.page) params.append('wa_page', trackingData.page);

  return `${baseUrl}?${params.toString()}`;
};

export const trackWhatsAppClick = (
  trackingData: {
    audience: string;
    source: string;
    page?: string;
    productId?: string;
  },
  attribution: AttributionData | null
) => {
  // Enviar evento para GTM/GA4
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'whatsapp_click',
      audience_segment: trackingData.audience,
      source: trackingData.source,
      page_slug: trackingData.page || window.location.pathname,
      product_id: trackingData.productId,
      utm_source: attribution?.utm?.utm_source,
      utm_medium: attribution?.utm?.utm_medium,
      utm_campaign: attribution?.utm?.utm_campaign,
      gclid: attribution?.gclid,
      fbclid: attribution?.fbclid,
      timestamp: Date.now()
    });
  }

  // Enviar para Meta Pixel
  if (window.fbq) {
    window.fbq('track', 'Contact', {
      content_category: trackingData.audience,
      content_name: `WhatsApp from ${trackingData.source}`
    });
  }
};
```

## 5. Enhanced Ecommerce Tracking

### 5.1 Product Tracking
```typescript
// src/hooks/useProductTracking.ts
import { useAnalytics } from './useAnalytics';
import { useCallback } from 'react';

interface Product {
  id: string;
  name: string;
  category: string;
  price?: number;
  brand?: string;
  variant?: string;
}

export const useProductTracking = () => {
  const { trackEvent, trackProductInteraction } = useAnalytics();

  const trackProductView = useCallback((product: Product, listName?: string, position?: number) => {
    trackProductInteraction({
      action: 'view',
      productId: product.id,
      productName: product.name,
      price: product.price,
      category: product.category
    });

    // Enhanced Ecommerce para GA4
    trackEvent('view_item', {
      currency: 'BRL',
      value: product.price || 0,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        item_brand: product.brand || 'M5 Max',
        item_variant: product.variant,
        price: product.price || 0,
        quantity: 1,
        index: position,
        item_list_name: listName
      }]
    });
  }, [trackEvent, trackProductInteraction]);

  const trackProductSelect = useCallback((product: Product, listName?: string, position?: number) => {
    trackProductInteraction({
      action: 'select',
      productId: product.id,
      productName: product.name,
      price: product.price,
      category: product.category
    });

    trackEvent('select_item', {
      item_list_name: listName,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        item_brand: product.brand || 'M5 Max',
        price: product.price || 0,
        quantity: 1,
        index: position
      }]
    });
  }, [trackEvent, trackProductInteraction]);

  const trackAddToCart = useCallback((product: Product, quantity: number = 1) => {
    trackEvent('add_to_cart', {
      currency: 'BRL',
      value: (product.price || 0) * quantity,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        item_brand: product.brand || 'M5 Max',
        price: product.price || 0,
        quantity
      }]
    });
  }, [trackEvent]);

  const trackBeginCheckout = useCallback((products: Product[]) => {
    const totalValue = products.reduce((sum, product) => sum + (product.price || 0), 0);

    trackEvent('begin_checkout', {
      currency: 'BRL',
      value: totalValue,
      items: products.map(product => ({
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        item_brand: product.brand || 'M5 Max',
        price: product.price || 0,
        quantity: 1
      }))
    });
  }, [trackEvent]);

  const trackPurchase = useCallback((
    transactionId: string, 
    products: Product[], 
    totalValue: number,
    coupon?: string
  ) => {
    trackEvent('purchase', {
      transaction_id: transactionId,
      value: totalValue,
      currency: 'BRL',
      coupon,
      items: products.map(product => ({
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        item_brand: product.brand || 'M5 Max',
        price: product.price || 0,
        quantity: 1
      }))
    });
  }, [trackEvent]);

  return {
    trackProductView,
    trackProductSelect,
    trackAddToCart,
    trackBeginCheckout,
    trackPurchase
  };
};
```

## 6. Lead Scoring e Qualification

### 6.1 Lead Scoring System
```typescript
// src/utils/leadScoring.ts
import { LEAD_SCORING } from './constants';

interface LeadData {
  audience: 'b2b' | 'cha' | 'kits';
  budgetRange?: string;
  eventDate?: string;
  attendeesRange?: string;
  eventType?: string;
  cityUF?: string;
  hasUrgency?: boolean;
  referralSource?: string;
}

export const calculateLeadScore = (data: LeadData): number => {
  let score = 0;

  // Score por orçamento
  if (data.budgetRange && LEAD_SCORING.budgetRanges[data.budgetRange]) {
    score += LEAD_SCORING.budgetRanges[data.budgetRange];
  }

  // Score por data do evento
  if (data.eventDate) {
    const eventDate = new Date(data.eventDate);
    const now = new Date();
    const diffDays = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 30) {
      score += LEAD_SCORING.eventDates['next-30d'];
    } else if (diffDays <= 90) {
      score += LEAD_SCORING.eventDates['next-90d'];
    } else if (diffDays <= 180) {
      score += LEAD_SCORING.eventDates['next-180d'];
    } else {
      score += LEAD_SCORING.eventDates['future'];
    }
  }

  // Score por número de participantes (B2B)
  if (data.audience === 'b2b' && data.attendeesRange && LEAD_SCORING.attendeesRanges[data.attendeesRange]) {
    score += LEAD_SCORING.attendeesRanges[data.attendeesRange];
  }

  // Bonus por urgência
  if (data.hasUrgency) {
    score += 10;
  }

  // Bonus por referência
  if (data.referralSource === 'client_referral') {
    score += 15;
  }

  // Bonus por eventos premium (B2B)
  if (data.audience === 'b2b') {
    const premiumEvents = ['reveillon', 'festival', 'casamento'];
    if (data.eventType && premiumEvents.includes(data.eventType)) {
      score += 5;
    }
  }

  // Bonus por localização (Brasília e região)
  if (data.cityUF?.toLowerCase().includes('brasília') || data.cityUF?.toLowerCase().includes('df')) {
    score += 5;
  }

  return Math.min(score, 100); // Máximo 100 pontos
};

export const getLeadPriority = (score: number): 'low' | 'medium' | 'high' | 'hot' => {
  if (score >= 70) return 'hot';
  if (score >= 50) return 'high';
  if (score >= 30) return 'medium';
  return 'low';
};

export const getFollowUpStrategy = (score: number, audience: string): {
  urgency: 'immediate' | 'same_day' | 'next_day' | 'within_week';
  channel: 'whatsapp' | 'phone' | 'email';
  message: string;
} => {
  const priority = getLeadPriority(score);

  switch (priority) {
    case 'hot':
      return {
        urgency: 'immediate',
        channel: 'whatsapp',
        message: 'Lead quente! Responder em até 15 minutos.'
      };
    case 'high':
      return {
        urgency: 'same_day',
        channel: 'whatsapp',
        message: 'Lead prioritário! Responder no mesmo dia.'
      };
    case 'medium':
      return {
        urgency: 'next_day',
        channel: audience === 'b2b' ? 'phone' : 'whatsapp',
        message: 'Lead qualificado! Responder em até 24h.'
      };
    default:
      return {
        urgency: 'within_week',
        channel: 'email',
        message: 'Lead para nutrição! Responder na semana.'
      };
  }
};
```

---

*Esta implementação de analytics fornece tracking completo, LGPD compliance e insights detalhados para otimização das campanhas e conversões da M5 Max Produções.*