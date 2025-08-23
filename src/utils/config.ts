interface Config {
  gtmId: string;
  ga4Id: string;
  metaPixelId: string;
  whatsappNumber: string;
  youtubeChannelId: string;
  youtubeApiKey: string;
  siteUrl: string;
  siteName: string;
  contactEmail: string;
  contactPhone: string;
  environment: 'development' | 'production' | 'staging';
}

const config: Config = {
  gtmId: import.meta.env.VITE_GTM_ID || '',
  ga4Id: import.meta.env.VITE_GA4_ID || '',
  metaPixelId: import.meta.env.VITE_META_PIXEL_ID || '',
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '556182735575',
  youtubeChannelId: import.meta.env.VITE_YOUTUBE_CHANNEL_ID || '',
  youtubeApiKey: import.meta.env.VITE_YOUTUBE_API_KEY || '',
  siteUrl: import.meta.env.VITE_SITE_URL || 'https://m5max.com',
  siteName: import.meta.env.VITE_SITE_NAME || 'M5 Max Produções',
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || 'fogosm5.max@gmail.com',
  contactPhone: import.meta.env.VITE_CONTACT_PHONE || '+556182735575',
  environment: (import.meta.env.VITE_NODE_ENV as Config['environment']) || 'development'
};

export default config;