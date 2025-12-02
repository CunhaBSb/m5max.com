import { useEffect, useRef } from 'react';
import { useAnalytics } from './useAnalytics';
import { useIsDesktop } from './useIsDesktop';

/**
 * Hook para rastrear mudanças de plataforma (desktop ↔ mobile)
 *
 * Monitora mudanças no breakpoint 1024px e rastreia quando o usuário
 * redimensiona a janela de desktop para mobile ou vice-versa.
 *
 * Útil para:
 * - Entender quantos usuários usam múltiplos dispositivos
 * - Validar bifurcated architecture
 * - Otimizar experiências cross-device
 */
export const usePlatformDetection = () => {
  const isDesktop = useIsDesktop();
  const { trackPlatformSwitch } = useAnalytics();
  const previousPlatform = useRef<'desktop' | 'mobile' | null>(null);

  useEffect(() => {
    const currentPlatform = isDesktop ? 'desktop' : 'mobile';

    // Só rastrear mudanças, não o carregamento inicial
    if (previousPlatform.current !== null && previousPlatform.current !== currentPlatform) {
      trackPlatformSwitch(previousPlatform.current, currentPlatform);
    }

    previousPlatform.current = currentPlatform;
  }, [isDesktop, trackPlatformSwitch]);
};
