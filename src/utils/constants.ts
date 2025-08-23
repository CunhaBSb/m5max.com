export const COMPANY_INFO = {
  name: 'M5 Max Produções',
  fullName: 'M5 Max Produções Pirotécnicas Ltda',
  tagline: 'Pirotecnia Profissional com Equipamentos de Última Geração',
  experienceYears: 40,
  phone: '(61) 98273-5575',
  whatsapp: '5561982735575',
  email: 'fogosm5.max@gmail.com',
  address: {
    city: 'Luziânia',
    state: 'GO',
    country: 'Brasil',
    fullAddress: 'AV. GOVERNADOR HENRIQUE SANTILLO QD. 53 LT 03 – JOFRE PARADA'
  },
  cnpj: '04.286.098/0001-46',
  social: {
    youtube: 'https://www.youtube.com/@FogosM5Max',
    instagram: '@m5maxproducoes',
    facebook: '/m5maxproducoes'
  }
};

export const UTM_SOURCES = {
  google: 'google',
  facebook: 'facebook',
  instagram: 'instagram',
  youtube: 'youtube',
  direct: 'direct',
  referral: 'referral'
} as const;

export const UTM_MEDIUMS = {
  cpc: 'cpc',
  social: 'social',
  organic: 'organic',
  email: 'email',
  referral: 'referral'
} as const;

export const AUDIENCES = {
  b2b: 'b2b',
  cha: 'cha',
  kits: 'kits',
  general: 'general'
} as const;

export const CONVERSION_SOURCES = {
  header: 'header',
  hero: 'hero',
  cta: 'cta',
  exitIntent: 'exit-intent',
  floating: 'floating',
  footer: 'footer'
} as const;

export const ANALYTICS_EVENTS = {
  // Page events
  pageView: 'page_view',
  scrollDepth50: 'scroll_depth_50',
  
  // Engagement events
  videoStart: 'video_start',
  videoProgress50: 'video_progress_50',
  videoComplete: 'video_complete',
  
  // Conversion events
  whatsappClick: 'whatsapp_click',
  leadFormStart: 'lead_form_start',
  leadFormSubmit: 'lead_form_submit',
  conversionModalOpen: 'conversion_modal_open',
  
  // Product events
  viewItem: 'view_item',
  selectItem: 'select_item',
  beginCheckout: 'begin_checkout',
  
  // B2B specific
  viewCase: 'view_case',
  requestQuote: 'request_quote',
  downloadChecklist: 'download_checklist'
} as const;

export const LEAD_SCORING = {
  budgetRanges: {
    '200k+': 30,
    '50k-200k': 20,
    '15k-50k': 10,
    '5k-15k': 5
  },
  eventDates: {
    'next-30d': 20,
    'next-90d': 15,
    'next-180d': 10,
    'future': 5
  },
  attendeesRanges: {
    '20k+': 15,
    '5k-20k': 10,
    '500-5k': 5,
    'ate-500': 2
  }
} as const;

export const SAFETY_DISCLAIMERS = {
  general: 'Produtos pirotécnicos devem ser manuseados apenas por maiores de 18 anos.',
  usage: 'Siga sempre as instruções de segurança e verifique a regulamentação local.',
  responsibility: 'A M5 Max não se responsabiliza pelo uso inadequado dos produtos.',
  full: 'Produtos pirotécnicos devem ser manuseados apenas por maiores de 18 anos. Siga sempre as instruções de segurança e verifique a regulamentação local. A M5 Max não se responsabiliza pelo uso inadequado dos produtos.'
} as const;