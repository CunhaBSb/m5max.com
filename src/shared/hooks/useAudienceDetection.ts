import { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppStore } from '@/shared/store/appStore';
import { useAttribution } from './useAttribution';
import { detectAudience } from '@/shared/lib/audienceDetection';
import { DetectionFactors, DetectionResult } from '@/shared/types/audienceTriage';

interface UseAudienceDetectionResult {
  detection: DetectionResult | null;
  isDetecting: boolean;
  redetect: () => void;
  updateFactors: (partial: Partial<DetectionFactors>) => void;
}

/**
 * Hook para detectar automaticamente a audiência do usuário
 *
 * Analisa múltiplos fatores:
 * - UTM params (fonte de tráfego)
 * - Contexto (página atual, produtos visualizados)
 * - Comportamento (tempo no site, páginas visitadas)
 *
 * @returns Detection result com audiência sugerida e nível de confiança
 */
export const useAudienceDetection = (): UseAudienceDetectionResult => {
  const location = useLocation();
  const { attribution } = useAttribution();
  const { triageData, setTriageData } = useAppStore();

  const [detection, setDetection] = useState<DetectionResult | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  // Track behavior
  const sessionStartRef = useRef<number>(Date.now());
  const [pagesVisited, setPagesVisited] = useState<Set<string>>(new Set([location.pathname]));
  const [productsViewed, setProductsViewed] = useState<string[]>([]);
  const [lastInteraction, setLastInteraction] = useState<'product' | 'service' | 'hero' | 'footer' | undefined>();

  // Track page changes
  useEffect(() => {
    setPagesVisited(prev => new Set([...prev, location.pathname]));
  }, [location.pathname]);

  // Detect products viewed from URL
  useEffect(() => {
    const pathSegments = location.pathname.split('/');

    // Check for product pages
    if (pathSegments.includes('produtos')) {
      const productSlug = pathSegments[pathSegments.length - 1];
      if (productSlug && productSlug !== 'produtos') {
        setProductsViewed(prev =>
          prev.includes(productSlug) ? prev : [...prev, productSlug]
        );
      }
    }

    // Detect interaction type from current page
    if (location.pathname === '/') {
      setLastInteraction('hero');
    } else if (location.pathname.includes('produtos')) {
      setLastInteraction('product');
    } else if (location.pathname.includes('servicos')) {
      setLastInteraction('service');
    }
  }, [location.pathname]);

  /**
   * Constrói fatores de detecção com base no estado atual
   */
  const buildDetectionFactors = useCallback((): DetectionFactors => {
    const timeOnSite = Date.now() - sessionStartRef.current;

    return {
      // UTM Analysis
      utmSource: attribution?.utm?.utm_source,
      utmCampaign: attribution?.utm?.utm_campaign,
      utmContent: attribution?.utm?.utm_content,
      utmMedium: attribution?.utm?.utm_medium,

      // Context
      currentPage: location.pathname,
      productsViewed: productsViewed,

      // Behavior
      timeOnSite: timeOnSite,
      pagesVisited: pagesVisited.size,
      lastInteraction: lastInteraction
    };
  }, [attribution, location.pathname, productsViewed, pagesVisited, lastInteraction]);

  /**
   * Executa detecção de audiência
   */
  const performDetection = useCallback(() => {
    setIsDetecting(true);

    try {
      const factors = buildDetectionFactors();
      const result = detectAudience(factors);

      setDetection(result);

      // Update store with triage data
      setTriageData({
        detectedAudience: result.suggestedAudience,
        confidence: result.confidence,
        detectionMethod: result.method,
        detectedAt: new Date().toISOString(),
        userCorrected: false
      });

      return result;
    } finally {
      setIsDetecting(false);
    }
  }, [buildDetectionFactors, setTriageData]);

  /**
   * Permite forçar re-detecção manual
   */
  const redetect = useCallback(() => {
    performDetection();
  }, [performDetection]);

  /**
   * Permite atualizar fatores específicos (ex: produtos visualizados)
   */
  const updateFactors = useCallback((partial: Partial<DetectionFactors>) => {
    if (partial.productsViewed) {
      setProductsViewed(partial.productsViewed);
    }
    if (partial.lastInteraction) {
      setLastInteraction(partial.lastInteraction);
    }

    // Auto-redetect após atualização
    performDetection();
  }, [performDetection]);

  // Auto-detect on mount and when key factors change
  useEffect(() => {
    // Só executar detecção se ainda não foi feita ou se confiança é baixa
    if (!triageData || (triageData.confidence && triageData.confidence < 70)) {
      performDetection();
    } else if (triageData) {
      // Usar detecção anterior se já existe com alta confiança
      setDetection({
        suggestedAudience: triageData.detectedAudience || 'general',
        confidence: triageData.confidence || 0,
        reasons: [],
        breakdown: { utmScore: 0, contextScore: 0, behaviorScore: 0 },
        method: triageData.detectionMethod || 'manual'
      });
    }
  }, [attribution?.utm?.utm_campaign, pagesVisited.size]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    detection,
    isDetecting,
    redetect,
    updateFactors
  };
};

/**
 * Hook simplificado que apenas retorna a detecção atual
 * (útil para components que só precisam ler, não manipular)
 */
export const useCurrentAudienceDetection = () => {
  const { triageData } = useAppStore();

  return {
    detectedAudience: triageData?.detectedAudience || 'general',
    confidence: triageData?.confidence || 0,
    method: triageData?.detectionMethod || 'manual'
  };
};
