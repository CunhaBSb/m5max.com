import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAppStore } from '@/shared/store/appStore';
import config from '@/shared/lib/config';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

/**
 * AnalyticsProvider — GTM-only architecture.
 *
 * Injeta UM container (Google Tag Manager) que centraliza GA4, Google Ads e Meta Pixel.
 * O GTM é o único responsável por carregar scripts de tracking e respeitar consent.
 *
 * Fluxo:
 * 1. Helmet injeta o dataLayer stub + gtag consent default + gtm.js loader no <head>
 * 2. useEffect mantém `gtag('consent', 'update', consent)` em sincronia com o store
 *
 * Nenhum outro script (gtag.js, fbevents.js) é injetado direto.
 * Tags do GA4/Ads/Meta ficam configuradas dentro do container GTM.
 */
export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const { consent } = useAppStore();
  const gtmId = config.gtmId;

  useEffect(() => {
    // Sync consent com GTM/gtag quando muda
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('consent', 'update', consent);
    }
  }, [consent]);

  return (
    <>
      <Helmet>
        {/*
          Single source of truth: dataLayer + gtag consent default + GTM loader.
          Ordem importa: dataLayer stub ANTES do gtag() ser definido, gtag consent default
          ANTES do gtm.js carregar (para o container saber o consent na inicialização).
        */}
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            window.gtag = window.gtag || function gtag(){ dataLayer.push(arguments); };
            window.gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'denied',
              functionality_storage: 'granted',
              security_storage: 'granted'
            });
            window.gtag('set', 'ads_data_redaction', true);
            const __m5_debug_ga = window.location.search.includes('debug_ga=1');
            if (__m5_debug_ga) {
              window.gtag('set', 'debug_mode', true);
            }
          `}
        </script>

        {gtmId && (
          <script
            async
            src={`https://www.googletagmanager.com/gtm.js?id=${gtmId}`}
          />
        )}
      </Helmet>

      {children}
    </>
  );
};
