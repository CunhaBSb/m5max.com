import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AttributionData, ConsentState } from '@/shared/types/analytics';
import { ConversionContext } from '@/shared/types/forms';
import { AudienceType } from '@/shared/types/common';
import { TriageData } from '@/shared/types/audienceTriage';

interface AppState {
  // Attribution & Analytics
  attribution: AttributionData | null;
  consent: ConsentState;

  // UI State
  conversionModalOpen: boolean;
  formModalOpen: boolean;
  currentAudience: AudienceType;

  // Audience Triage System
  triageData: TriageData | null;

  // Actions
  setAttribution: (data: AttributionData) => void;
  updateConsent: (consent: Partial<ConsentState>) => void;
  openConversionModal: (context: ConversionContext) => void;
  closeConversionModal: () => void;
  openFormModal: (context: ConversionContext) => void;
  closeFormModal: () => void;
  setCurrentAudience: (audience: AudienceType) => void;
  setTriageData: (data: TriageData) => void;
}

// Attempt to load previously granted consent before first render to avoid
// dropping analytics events on page reloads (GA4 requires consent prior to send).
const loadInitialConsent = (): ConsentState => {
  if (typeof window === 'undefined') {
    return {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      functionality_storage: 'granted',
      security_storage: 'granted'
    };
  }

  try {
    const saved = window.localStorage.getItem('m5max-consent');
    if (saved) {
      return JSON.parse(saved) as ConsentState;
    }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn('[consent] Falha ao restaurar consentimento inicial', err);
    }
  }

  return {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted'
  };
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      attribution: null,
      consent: loadInitialConsent(),
      conversionModalOpen: false,
      formModalOpen: false,
      currentAudience: 'general',
      triageData: null,

      // Actions
      setAttribution: (data) => set({ attribution: data }),
      
      updateConsent: (newConsent) => set((state) => ({
        consent: { ...state.consent, ...newConsent }
      })),
      
      openConversionModal: (context) => set({ 
        conversionModalOpen: true,
        currentAudience: context.audience 
      }),
      
      closeConversionModal: () => set({ conversionModalOpen: false }),
      
      openFormModal: (context) => set((state) => {
        // Respeitar detecção automática se confiança alta
        let audience = context.audience || 'general';

        // Se há detecção com confiança >= 70%, usar audiência detectada
        if (state.triageData?.confidence && state.triageData.confidence >= 70 && state.triageData.detectedAudience) {
          audience = state.triageData.detectedAudience;
        }

        return {
          formModalOpen: true,
          currentAudience: audience
        };
      }),
      
      closeFormModal: () => set({ formModalOpen: false }),

      setCurrentAudience: (audience) => set({ currentAudience: audience }),

      setTriageData: (data) => set({ triageData: data })
    }),
    {
      name: 'm5max-storage',
      partialize: (state) => ({
        attribution: state.attribution,
        consent: state.consent,
        currentAudience: state.currentAudience,
        triageData: state.triageData
      }),
    }
  )
);
