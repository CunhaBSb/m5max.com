import { useEffect } from 'react';
import { useAnalytics } from './useAnalytics';

/**
 * Hook para rastrear Core Web Vitals automaticamente
 *
 * Usa a biblioteca web-vitals do Google (se disponível) ou
 * Performance Observer API como fallback
 *
 * Métricas rastreadas:
 * - FCP (First Contentful Paint): Quando o primeiro conteúdo é renderizado
 * - LCP (Largest Contentful Paint): Quando o maior elemento é renderizado
 * - CLS (Cumulative Layout Shift): Estabilidade visual
 * - FID (First Input Delay): Responsividade a interações
 * - TTFB (Time to First Byte): Tempo de resposta do servidor
 * - INP (Interaction to Next Paint): Responsividade geral
 */
export const useWebVitals = () => {
  const { trackWebVitals } = useAnalytics();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Função para determinar rating baseado em thresholds do Google
    const getRating = (metric: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
      const thresholds = {
        FCP: { good: 1800, poor: 3000 },
        LCP: { good: 2500, poor: 4000 },
        CLS: { good: 0.1, poor: 0.25 },
        FID: { good: 100, poor: 300 },
        TTFB: { good: 800, poor: 1800 },
        INP: { good: 200, poor: 500 }
      };

      const threshold = thresholds[metric as keyof typeof thresholds];
      if (!threshold) return 'good';

      if (value <= threshold.good) return 'good';
      if (value <= threshold.poor) return 'needs-improvement';
      return 'poor';
    };

    // Tentar usar web-vitals library se disponível
    const loadWebVitals = async () => {
      try {
        // @ts-expect-error - web-vitals pode não estar tipado
        const { onCLS, onFID, onFCP, onLCP, onTTFB, onINP } = await import('web-vitals');

        onCLS((metric: { value: number; delta: number }) => {
          trackWebVitals({
            name: 'CLS',
            value: metric.value,
            rating: getRating('CLS', metric.value),
            delta: metric.delta
          });
        });

        onFID((metric: { value: number; delta: number }) => {
          trackWebVitals({
            name: 'FID',
            value: metric.value,
            rating: getRating('FID', metric.value),
            delta: metric.delta
          });
        });

        onFCP((metric: { value: number; delta: number }) => {
          trackWebVitals({
            name: 'FCP',
            value: metric.value,
            rating: getRating('FCP', metric.value),
            delta: metric.delta
          });
        });

        onLCP((metric: { value: number; delta: number }) => {
          trackWebVitals({
            name: 'LCP',
            value: metric.value,
            rating: getRating('LCP', metric.value),
            delta: metric.delta
          });
        });

        onTTFB((metric: { value: number; delta: number }) => {
          trackWebVitals({
            name: 'TTFB',
            value: metric.value,
            rating: getRating('TTFB', metric.value),
            delta: metric.delta
          });
        });

        if (onINP) {
          onINP((metric: { value: number; delta: number }) => {
            trackWebVitals({
              name: 'INP',
              value: metric.value,
              rating: getRating('INP', metric.value),
              delta: metric.delta
            });
          });
        }
      } catch (error) {
        // Fallback: usar Performance Observer API
        if (import.meta.env.DEV) {
          console.debug('[WebVitals] web-vitals library not available, using Performance Observer fallback');
        }

        // FCP via Performance Observer
        const fcpObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              const value = entry.startTime;
              trackWebVitals({
                name: 'FCP',
                value,
                rating: getRating('FCP', value)
              });
              fcpObserver.disconnect();
            }
          }
        });

        try {
          fcpObserver.observe({ type: 'paint', buffered: true });
        } catch (e) {
          // Navegador não suporta
          if (import.meta.env.DEV) {
            console.debug('[WebVitals] Paint timing not supported');
          }
        }

        // LCP via Performance Observer
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };
          const value = lastEntry.renderTime || lastEntry.loadTime || lastEntry.startTime;

          trackWebVitals({
            name: 'LCP',
            value,
            rating: getRating('LCP', value)
          });
        });

        try {
          lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        } catch (e) {
          if (import.meta.env.DEV) {
            console.debug('[WebVitals] LCP timing not supported');
          }
        }

        // CLS via Performance Observer
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as { hadRecentInput?: boolean }).hadRecentInput) {
              clsValue += (entry as { value: number }).value;
            }
          }
        });

        try {
          clsObserver.observe({ type: 'layout-shift', buffered: true });
        } catch (e) {
          if (import.meta.env.DEV) {
            console.debug('[WebVitals] Layout shift timing not supported');
          }
        }

        // Rastrear CLS ao sair da página
        window.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'hidden' && clsValue > 0) {
            trackWebVitals({
              name: 'CLS',
              value: clsValue,
              rating: getRating('CLS', clsValue)
            });
          }
        });
      }
    };

    loadWebVitals();
  }, [trackWebVitals]);
};
