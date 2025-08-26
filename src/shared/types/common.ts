export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  testId?: string;
}

export interface InteractiveComponentProps extends BaseComponentProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export interface TrackingProps {
  analytics?: {
    event: string;
    properties?: Record<string, unknown>;
  };
}

export type AudienceType = 'b2b' | 'cha' | 'kits' | 'general';

export type ConversionSource = 'header' | 'hero' | 'cta' | 'exit-intent' | 'floating' | 'footer';

export interface Product {
  id: string;
  name: string;
  description: string;
  price?: string;
  features: string[];
  audience: 'cha' | 'kits';
  category?: string;
  image?: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  description: string;
  videoId: string;
  thumbnail: string;
  tags: string[];
  audience: 'b2b' | 'cha' | 'kits';
  date: string;
  location?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  company?: string;
  role?: string;
  content: string;
  rating: number;
  image?: string;
  audience: AudienceType;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  audience?: AudienceType;
}