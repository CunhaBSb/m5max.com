export interface UTMParams {
  utm_source: string;    // google, facebook, instagram, youtube, direct
  utm_medium: string;    // cpc, social, organic, email, referral
  utm_campaign: string;  // {audience}-{season}-{year}
  utm_content?: string;  // {creative-variant}
  utm_term?: string;     // {keyword}
}

export interface AttributionData {
  utm: UTMParams;
  gclid?: string;
  fbclid?: string;
  referrer: string;
  landingPage: string;
  timestamp: number;
}

export interface ConsentState {
  ad_storage: 'granted' | 'denied';
  ad_user_data: 'granted' | 'denied';
  ad_personalization: 'granted' | 'denied';
  analytics_storage: 'granted' | 'denied';
  functionality_storage: 'granted' | 'denied';
  security_storage: 'granted' | 'denied';
}

export interface DataLayerEvent {
  event: string;
  page_category: 'b2b' | 'cha' | 'kits' | 'general';
  page_slug: string;
  page_title: string;
  audience_segment?: string;
  content_name?: string;
  content_category?: string;
  value?: number;
  currency?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  gclid?: string;
  fbclid?: string;
  event_id?: string; // Para deduplicação CAPI
}

export interface PageViewParams {
  page_title: string;
  page_location: string;
  page_category: 'b2b' | 'cha' | 'kits' | 'general';
  content_group1?: string;
}

export interface VideoParams {
  video_title: string;
  video_provider: 'youtube' | 'vimeo' | 'custom';
  video_duration?: number;
  video_current_time?: number;
  video_percent?: number;
}

export interface WhatsAppParams {
  audience: 'b2b' | 'cha' | 'kits';
  source: string;
  message_template: string;
  phone_number: string;
}

export interface FormParams {
  form_type: 'b2b' | 'cha' | 'kits';
  form_name: string;
  form_step?: number;
  lead_score?: number;
}

export interface ProductParams {
  item_id: string;
  item_name: string;
  item_category: string;
  item_category2?: string;
  price?: number;
  currency?: string;
  audience: 'cha' | 'kits';
}