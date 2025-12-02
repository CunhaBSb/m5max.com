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

// Tipo de audiência (específico)
export type AudienceType =
  | 'b2b-corporate'     // Eventos corporativos grandes (500+ pessoas, 50k+)
  | 'b2c-personal'      // Eventos pessoais/familiares (até 200 pessoas, até 30k)
  | 'b2b-specialized'   // Clientes especiais/privados (Iate Clube, projetos customizados)
  | 'general';          // Não classificado ainda

// Categoria de audiência (agregada para analytics)
export type AudienceCategory = 'b2b' | 'b2c' | 'general';

// Helper function para converter AudienceType em AudienceCategory
export function getAudienceCategory(audienceType: AudienceType): AudienceCategory {
  if (audienceType === 'b2b-corporate' || audienceType === 'b2b-specialized') {
    return 'b2b';
  }
  if (audienceType === 'b2c-personal') {
    return 'b2c';
  }
  return 'general';
}

export type ConversionSource = 'header' | 'hero' | 'cta' | 'exit-intent' | 'floating' | 'footer';

export interface Product {
  id: string;
  name: string;
  description: string;
  price?: string;
  features: string[];
  audience: 'b2b';
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
  audience: 'b2b';
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