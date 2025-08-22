// Tipos globais do projeto M5 Max

export type PublicSegment = 'b2b' | 'cha' | 'kits';

export interface Lead {
  id?: string;
  name: string;
  email: string;
  phone: string;
  segment: PublicSegment;
  eventType?: string;
  eventDate?: string;
  city: string;
  state: string;
  budget?: string;
  message?: string;
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  gclid?: string;
  fbclid?: string;
  createdAt?: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  segment: PublicSegment;
  images: string[];
  videoUrl?: string;
}

export interface Kit {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'reveillon' | 'aniversario' | 'casamento' | 'cha-revelacao';
  images: string[];
  includes: string[];
  safetyInfo: string[];
  inStock: boolean;
}

export interface ContactData {
  whatsapp: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface SeoData {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  schema?: Record<string, unknown>;
}

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export interface TrackingEvent {
  event: string;
  event_category?: string;
  event_label?: string;
  value?: number;
  audience_segment?: PublicSegment;
  custom_parameters?: Record<string, unknown>;
}