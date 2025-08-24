import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { initGTM } from '@/lib/gtm';
import { useAttribution } from '@/hooks/useAttribution';
import { useAppStore } from '@/store/appStore';
import config from '@/utils/config';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const { consent } = useAppStore();
  const { attribution } = useAttribution();

  useEffect(() => {
    // Inicializar GTM
    initGTM();

    // Configurar consent mode
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'default', {
        ad_storage: 'denied',
        ad_user_data: 'denied', 
        ad_personalization: 'denied',
        analytics_storage: 'denied',
        functionality_storage: 'granted',
        security_storage: 'granted'
      });
    }

    // Inicializar Meta Pixel se consentido
    if (config.metaPixelId && consent.ad_storage === 'granted') {
      // Simple Meta Pixel initialization
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(script);

      // Initialize dataLayer for fbq if not exists
      if (!window.fbq) {
        window.fbq = function(...args) {
          (window.fbq.queue = window.fbq.queue || []).push(args);
        };
      }

      window.fbq('init', config.metaPixelId);
      window.fbq('track', 'PageView');
    }
  }, [consent.ad_storage]);

  // Atualizar consent quando mudado
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', consent);
    }
  }, [consent]);

  return (
    <>
      <Helmet>
        {/* Google Analytics GA4 */}
        {config.ga4Id && consent.analytics_storage === 'granted' && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${config.ga4Id}`}
            />
            <script>
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${config.ga4Id}', {
                  send_page_view: false
                });
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
        {/* GTM NoScript */}
        {config.gtmId && (
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${config.gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`
            }}
          />
        )}
      </Helmet>
      
      {children}
    </>
  );
};