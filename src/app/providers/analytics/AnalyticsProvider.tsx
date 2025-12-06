import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { initGTM } from '@/shared/lib/gtm';
import { useAttribution } from '@/shared/hooks/useAttribution';
import { useAppStore } from '@/shared/store/appStore';
import config from '@/shared/lib/config';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const { consent } = useAppStore();
  const { attribution } = useAttribution();

  const canLoadGa4 = Boolean(config.ga4Id && consent.analytics_storage === 'granted');
  const canLoadGAds = Boolean(config.gAdsId && consent.ad_storage === 'granted');
  const primaryGtagId = config.gAdsId || config.ga4Id;

  useEffect(() => {
    // Inicializar GTM
    initGTM();
  }, []);

  // Atualizar consent quando mudado
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', consent);
    }
  }, [consent]);

  // Reconfigurar gtag quando o consentimento permitir
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      if (config.ga4Id && consent.analytics_storage === 'granted') {
        window.gtag('config', config.ga4Id, { send_page_view: false });
      }
      if (config.gAdsId && consent.ad_storage === 'granted') {
        window.gtag('config', config.gAdsId);
      }
    }
  }, [consent.analytics_storage, consent.ad_storage]);

  return (
    <>
      <Helmet>
        {/* Consent default (gtag) - must run before gtag.js */}
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'denied',
              functionality_storage: 'granted',
              security_storage: 'granted'
            });
          `}
        </script>

        {/* gtag loader (GA4 / Google Ads) */}
        {primaryGtagId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${primaryGtagId}`}
            />
            <script>
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                const __m5_debug_ga = window.location.search.includes('debug_ga=1');
                if (__m5_debug_ga) {
                  gtag('set', 'debug_mode', true);
                }
                ${canLoadGa4 ? `gtag('config', '${config.ga4Id}', { send_page_view: false });` : ''}
                ${canLoadGAds ? `gtag('config', '${config.gAdsId}');` : ''}
              `}
            </script>
          </>
        )}

        {/* Meta Pixel */}
        {config.metaPixelId && consent.ad_storage === 'granted' && (
          <script>
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window,document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${config.metaPixelId}');
              fbq('track', 'PageView');
            `}
          </script>
        )}
      </Helmet>
      
      {children}
    </>
  );
};
