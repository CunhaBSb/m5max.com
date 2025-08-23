import { useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { getAttributionData } from '@/utils/utm';

export const useAttribution = () => {
  const { attribution, setAttribution } = useAppStore();

  useEffect(() => {
    // Só capturar attribution uma vez por sessão
    if (!attribution) {
      const attributionData = getAttributionData();
      if (attributionData) {
        setAttribution(attributionData);
      }
    }
  }, [attribution, setAttribution]);

  return { attribution };
};