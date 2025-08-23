import { UTMParams, AttributionData } from '@/types/analytics';

export const getUTMParams = (): UTMParams | null => {
  if (typeof window === 'undefined') return null;
  
  const urlParams = new URLSearchParams(window.location.search);
  
  const utm_source = urlParams.get('utm_source');
  const utm_medium = urlParams.get('utm_medium');
  const utm_campaign = urlParams.get('utm_campaign');
  
  if (!utm_source || !utm_medium || !utm_campaign) return null;
  
  return {
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content: urlParams.get('utm_content') || undefined,
    utm_term: urlParams.get('utm_term') || undefined
  };
};

export const getClickIds = (): { gclid?: string; fbclid?: string } => {
  if (typeof window === 'undefined') return {};
  
  const urlParams = new URLSearchParams(window.location.search);
  
  return {
    gclid: urlParams.get('gclid') || undefined,
    fbclid: urlParams.get('fbclid') || undefined
  };
};

export const getAttributionData = (): AttributionData | null => {
  if (typeof window === 'undefined') return null;
  
  const utm = getUTMParams();
  const clickIds = getClickIds();
  
  // Se não tem UTMs nem click IDs, consideramos tráfego direto
  if (!utm && !clickIds.gclid && !clickIds.fbclid) {
    return {
      utm: {
        utm_source: 'direct',
        utm_medium: 'none',
        utm_campaign: 'direct'
      },
      referrer: document.referrer || 'direct',
      landingPage: window.location.pathname,
      timestamp: Date.now()
    };
  }
  
  return {
    utm: utm || {
      utm_source: clickIds.gclid ? 'google' : clickIds.fbclid ? 'facebook' : 'direct',
      utm_medium: clickIds.gclid ? 'cpc' : clickIds.fbclid ? 'social' : 'none',
      utm_campaign: 'unknown'
    },
    gclid: clickIds.gclid,
    fbclid: clickIds.fbclid,
    referrer: document.referrer || 'direct',
    landingPage: window.location.pathname,
    timestamp: Date.now()
  };
};

export const preserveUTMsInURL = (baseUrl: string, utms: UTMParams): string => {
  const url = new URL(baseUrl);
  
  Object.entries(utms).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });
  
  return url.toString();
};

export const createCampaignUTM = (
  audience: 'b2b' | 'cha' | 'kits',
  source: string,
  medium: string,
  season?: string
): UTMParams => {
  const currentYear = new Date().getFullYear();
  const campaignSeason = season || getCurrentSeason();
  
  return {
    utm_source: source,
    utm_medium: medium,
    utm_campaign: `${audience}-${campaignSeason}-${currentYear}`
  };
};

const getCurrentSeason = (): string => {
  const month = new Date().getMonth() + 1; // getMonth() returns 0-11
  
  if (month >= 12 || month <= 2) return 'reveillon';
  if (month >= 3 && month <= 5) return 'festa-junina';
  if (month >= 6 && month <= 8) return 'casamento';
  if (month >= 9 && month <= 11) return 'confraternizacao';
  
  return 'geral';
};