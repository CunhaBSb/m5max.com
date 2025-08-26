import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AttributionData, ConsentState } from '@/shared/types/analytics';
import { ConversionContext } from '@/shared/types/forms';
import { AudienceType } from '@/shared/types/common';

interface AppState {
  // Attribution & Analytics
  attribution: AttributionData | null;
  consent: ConsentState;
  
  // UI State
  conversionModalOpen: boolean;
  currentAudience: AudienceType;
  
  // Actions
  setAttribution: (data: AttributionData) => void;
  updateConsent: (consent: Partial<ConsentState>) => void;
  openConversionModal: (context: ConversionContext) => void;
  closeConversionModal: () => void;
  setCurrentAudience: (audience: AudienceType) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      attribution: null,
      consent: {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
        functionality_storage: 'granted',
        security_storage: 'granted'
      },
      conversionModalOpen: false,
      currentAudience: 'general',

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
      
      setCurrentAudience: (audience) => set({ currentAudience: audience })
    }),
    {
      name: 'm5max-storage',
      partialize: (state) => ({
        attribution: state.attribution,
        consent: state.consent,
        currentAudience: state.currentAudience
      }),
    }
  )
);