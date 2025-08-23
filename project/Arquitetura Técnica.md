# Arquitetura Técnica - M5 Max Produções

## 1. Stack Técnico Detalhado

### 1.1 Frontend Core
```json
{
  "runtime": "Node.js 18+",
  "bundler": "Vite 5+",
  "framework": "React 18+",
  "language": "TypeScript 5+",
  "styling": "TailwindCSS 3.4.17",
  "routing": "React Router DOM 6+",
  "forms": "React Hook Form + Zod",
  "state": "Zustand (global) + React State (local)"
}
```

### 1.2 Analytics & Tracking
```json
{
  "tag_manager": "Google Tag Manager",
  "analytics": "GA4 Enhanced Ecommerce",
  "social_pixels": "Meta Pixel",
  "consent": "Consent Mode v2",
  "attribution": "gclid + fbclid preservation"
}
```

### 1.3 Integrations
```json
{
  "whatsapp": "WhatsApp Business API",
  "video": "YouTube Data API v3",
  "email": "React Email (optional)",
  "cms": "Markdown files (static)"
}
```

## 2. Estrutura de Pastas

```
src/
├── components/           # Componentes reutilizáveis
│   ├── ui/              # Design system base
│   ├── forms/           # Formulários específicos
│   ├── modals/          # Modals e overlays
│   ├── analytics/       # Tracking components
│   └── layout/          # Layout components
├── pages/               # Páginas/rotas principais
│   ├── home/
│   ├── shows-pirotecnicos/
│   ├── cha-revelacao/
│   ├── kits/
│   └── shared/
├── hooks/               # Custom hooks
├── utils/               # Utilities e helpers
│   ├── analytics.ts     # GA4 + Meta tracking
│   ├── utm.ts          # UTM handling
│   ├── whatsapp.ts     # WhatsApp integration
│   └── validation.ts   # Zod schemas
├── types/               # TypeScript types
├── data/                # Static data/content
└── assets/              # Imagens, ícones, etc.
```

## 3. Componentes Principais

### 3.1 Layout Components

#### Header
```typescript
interface HeaderProps {
  variant: 'default' | 'transparent' | 'sticky';
  showCTA?: boolean;
  audience?: 'b2b' | 'cha' | 'kits';
}
```

#### Footer
```typescript
interface FooterProps {
  showWhatsApp?: boolean;
  complianceLevel: 'basic' | 'full';
}
```

### 3.2 Conversion Components

#### ConversionModal
```typescript
interface ConversionModalProps {
  isOpen: boolean;
  onClose: () => void;
  audience: 'b2b' | 'cha' | 'kits';
  source: 'header' | 'hero' | 'cta' | 'exit-intent';
  context?: {
    page: string;
    eventType?: string;
  };
}
```

#### QualificationForm
```typescript
interface QualificationFormProps {
  audience: 'b2b' | 'cha' | 'kits';
  onSubmit: (data: FormData) => void;
  initialData?: Partial<FormData>;
}

type FormData = B2BFormData | ChaFormData | KitsFormData;
```

#### WhatsAppCTA
```typescript
interface WhatsAppCTAProps {
  message: string;
  utm: UTMParams;
  variant: 'button' | 'floating' | 'inline';
  audience: 'b2b' | 'cha' | 'kits';
}
```

### 3.3 Content Components

#### VideoPlayer
```typescript
interface VideoPlayerProps {
  youtubeId: string;
  title: string;
  trackingEvents?: boolean;
  autoplay?: boolean;
  controls?: boolean;
}
```

#### CaseStudyCard
```typescript
interface CaseStudyCardProps {
  case: {
    id: string;
    title: string;
    description: string;
    videoId: string;
    thumbnail: string;
    tags: string[];
    audience: 'b2b' | 'cha' | 'kits';
  };
  onClick?: () => void;
}
```

#### ProductCard
```typescript
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price?: string;
    features: string[];
    audience: 'cha' | 'kits';
  };
  onSelect: () => void;
}
```

## 4. Roteamento e Pages

### 4.1 Router Setup
```typescript
// Router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "shows-pirotecnicos",
        element: <ShowsPirotecnicosLayout />,
        children: [
          { index: true, element: <ShowsPirotecnicosPage /> },
          { path: "reveillon", element: <ReveillonPage /> },
          { path: "festa-junina", element: <FestaJuninaPage /> },
          { path: "casamentos", element: <CasamentosPage /> },
          { path: "festivais", element: <FestivaisPage /> },
          { path: "clubes-e-condominios", element: <ClubesPage /> }
        ]
      },
      {
        path: "cha-revelacao",
        element: <ChaRevelacaoLayout />,
        children: [
          { index: true, element: <ChaRevelacaoPage /> },
          { path: "kits", element: <ChaKitsPage /> },
          { path: "seguranca", element: <ChaSegurancaPage /> }
        ]
      },
      {
        path: "kits",
        element: <KitsLayout />,
        children: [
          { index: true, element: <KitsPage /> },
          { path: "reveillon", element: <KitsReveillonPage /> },
          { path: "confraternizacao", element: <KitsConfraternizacaoPage /> },
          { path: "aniversario", element: <KitsAniversarioPage /> }
        ]
      },
      { path: "cases", element: <CasesPage /> },
      { path: "contato", element: <ContatoPage /> },
      { path: "sobre", element: <SobrePage /> },
      { path: "faq", element: <FAQPage /> },
      { path: "legal", element: <LegalPage /> }
    ]
  }
]);
```

### 4.2 Page Context Provider
```typescript
interface PageContextType {
  audience: 'b2b' | 'cha' | 'kits' | 'general';
  pageName: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

const PageContext = createContext<PageContextType>();
```

## 5. Analytics Architecture

### 5.1 GTM DataLayer Structure
```typescript
interface DataLayerEvent {
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
```

### 5.2 Custom Events
```typescript
// GA4 + Meta Pixel events
const trackingEvents = {
  // Page events
  page_view: (params: PageViewParams) => void,
  scroll_depth_50: (params: ScrollParams) => void,
  
  // Engagement events
  video_start: (params: VideoParams) => void,
  video_progress_50: (params: VideoParams) => void,
  video_complete: (params: VideoParams) => void,
  
  // Conversion events
  whatsapp_click: (params: WhatsAppParams) => void,
  lead_form_start: (params: FormParams) => void,
  lead_form_submit: (params: FormParams) => void,
  
  // B2B specific
  view_case: (params: CaseParams) => void,
  request_quote: (params: QuoteParams) => void,
  
  // Chá/Kits specific
  view_item: (params: ProductParams) => void,
  select_item: (params: ProductParams) => void,
  begin_checkout: (params: CheckoutParams) => void
};
```

### 5.3 Consent Management
```typescript
interface ConsentState {
  ad_storage: 'granted' | 'denied';
  ad_user_data: 'granted' | 'denied';
  ad_personalization: 'granted' | 'denied';
  analytics_storage: 'granted' | 'denied';
  functionality_storage: 'granted' | 'denied';
  security_storage: 'granted' | 'denied';
}

// Consent Mode v2 implementation
const consentManager = {
  init: () => void,
  updateConsent: (consent: Partial<ConsentState>) => void,
  getConsent: () => ConsentState
};
```

## 6. Form Architecture

### 6.1 Zod Schemas
```typescript
// B2B Form Schema
const B2BFormSchema = z.object({
  eventType: z.enum(['reveillon', 'festa-junina', 'casamento', 'festival', 'outro']),
  cityUF: z.string().min(1, 'Cidade/UF obrigatório'),
  eventDate: z.string().min(1, 'Data obrigatória'),
  attendeesRange: z.enum(['ate-500', '500-5k', '5k-20k', '20k+']),
  budgetRange: z.enum(['5k-15k', '15k-50k', '50k-200k', '200k+']),
  venueType: z.enum(['indoor', 'outdoor']),
  hasNoiseRestrictions: z.boolean(),
  needsMusicSync: z.boolean(),
  contactName: z.string().min(1, 'Nome obrigatório'),
  contactEmail: z.string().email('Email inválido'),
  contactPhone: z.string().min(10, 'Telefone inválido'),
  companyName: z.string().optional(),
  additionalInfo: z.string().optional(),
  attachments: z.array(z.instanceof(File)).optional()
});

// Chá Revelação Schema
const ChaFormSchema = z.object({
  kitType: z.enum(['basico', 'popular', 'premium']),
  revealColor: z.enum(['rosa', 'azul', 'surpresa']),
  eventDate: z.string().min(1, 'Data obrigatória'),
  guestsCount: z.number().min(1).max(200),
  venueType: z.enum(['casa', 'salao', 'parque', 'praia']),
  needsRemoteControl: z.boolean(),
  needsPersonalization: z.boolean(),
  contactName: z.string().min(1, 'Nome obrigatório'),
  contactEmail: z.string().email('Email inválido'),
  contactPhone: z.string().min(10, 'Telefone inválido'),
  deliveryAddress: z.object({
    cep: z.string().min(8, 'CEP inválido'),
    street: z.string().min(1, 'Endereço obrigatório'),
    number: z.string().min(1, 'Número obrigatório'),
    city: z.string().min(1, 'Cidade obrigatória'),
    state: z.string().min(2, 'Estado obrigatório')
  })
});

// Kits DIY Schema
const KitsFormSchema = z.object({
  kitCategory: z.enum(['reveillon', 'confraternizacao', 'aniversario']),
  kitSize: z.enum(['pequeno', 'medio', 'grande']),
  spaceSize: z.enum(['quintal-pequeno', 'quintal-medio', 'area-grande']),
  eventDate: z.string().min(1, 'Data obrigatória'),
  isOver18: z.boolean().refine(val => val === true, 'Deve ser maior de 18 anos'),
  acceptsTerms: z.boolean().refine(val => val === true, 'Deve aceitar os termos'),
  contactName: z.string().min(1, 'Nome obrigatório'),
  contactEmail: z.string().email('Email inválido'),
  contactPhone: z.string().min(10, 'Telefone inválido'),
  deliveryAddress: z.object({
    cep: z.string().min(8, 'CEP inválido'),
    street: z.string().min(1, 'Endereço obrigatório'),
    number: z.string().min(1, 'Número obrigatório'),
    city: z.string().min(1, 'Cidade obrigatória'),
    state: z.string().min(2, 'Estado obrigatório')
  })
});
```

### 6.2 Form Handlers
```typescript
interface FormSubmissionResult {
  success: boolean;
  leadScore: number;
  redirectUrl?: string;
  message: string;
}

const formHandlers = {
  submitB2BForm: (data: B2BFormData) => Promise<FormSubmissionResult>,
  submitChaForm: (data: ChaFormData) => Promise<FormSubmissionResult>,
  submitKitsForm: (data: KitsFormData) => Promise<FormSubmissionResult>
};
```

## 7. UTM & Attribution

### 7.1 UTM Standard
```typescript
interface UTMParams {
  utm_source: string;    // google, facebook, instagram, youtube, direct
  utm_medium: string;    // cpc, social, organic, email, referral
  utm_campaign: string;  // {audience}-{season}-{year}
  utm_content?: string;  // {creative-variant}
  utm_term?: string;     // {keyword}
}

// Example: utm_source=google&utm_medium=cpc&utm_campaign=b2b-reveillon-2025&utm_content=video-case&utm_term=show%20pirotecnico
```

### 7.2 Attribution Preservation
```typescript
const attributionManager = {
  captureAttribution: () => void,
  getAttribution: () => AttributionData,
  preserveInWhatsApp: (baseUrl: string, utms: UTMParams) => string,
  preserveInForms: (formData: any, attribution: AttributionData) => any
};

interface AttributionData {
  utm: UTMParams;
  gclid?: string;
  fbclid?: string;
  referrer: string;
  landingPage: string;
  timestamp: number;
}
```

## 8. WhatsApp Integration

### 8.1 Message Templates
```typescript
const whatsappTemplates = {
  b2b: (eventType: string, city: string, date: string) => 
    `Olá M5! Quero orçamento para ${eventType} em ${city} dia ${date}.`,
  
  cha: (kitType: string, color: string, date: string) => 
    `Olá M5! Quero kit ${kitType} para chá revelação ${color} dia ${date}.`,
  
  kits: (kitCategory: string, size: string, date: string) => 
    `Olá M5! Quero kit ${kitCategory} tamanho ${size} para ${date}.`
};
```

### 8.2 URL Generation
```typescript
const generateWhatsAppURL = (
  message: string,
  utms: UTMParams,
  context: { audience: string, source: string }
): string => {
  const phone = '556182735575';
  const encodedMessage = encodeURIComponent(message);
  const utmString = new URLSearchParams(utms).toString();
  
  return `https://wa.me/${phone}?text=${encodedMessage}&${utmString}`;
};
```

## 9. Performance & SEO

### 9.1 Code Splitting
```typescript
// Route-based code splitting
const HomePage = lazy(() => import('../pages/home/HomePage'));
const ShowsPirotecnicosPage = lazy(() => import('../pages/shows-pirotecnicos/ShowsPirotecnicosPage'));
// ... outros imports lazy
```

### 9.2 Image Optimization
```typescript
interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  sizes?: string;
}
```

### 9.3 Schema Markup
```typescript
const schemaTypes = {
  LocalBusiness: () => StructuredData,
  Event: (eventData: EventData) => StructuredData,
  Product: (productData: ProductData) => StructuredData,
  VideoObject: (videoData: VideoData) => StructuredData,
  FAQPage: (faqs: FAQ[]) => StructuredData
};
```

## 10. State Management

### 10.1 Global State (Zustand)
```typescript
interface AppState {
  // User tracking
  attribution: AttributionData | null;
  consent: ConsentState;
  
  // UI state
  conversionModalOpen: boolean;
  currentAudience: 'b2b' | 'cha' | 'kits' | 'general';
  
  // Form state
  lastFormSubmission: FormSubmissionResult | null;
  
  // Actions
  setAttribution: (data: AttributionData) => void;
  updateConsent: (consent: Partial<ConsentState>) => void;
  openConversionModal: (context: ConversionContext) => void;
  closeConversionModal: () => void;
}
```

### 10.2 Page-specific State
```typescript
// Individual pages mantêm estado local com useState/useReducer
interface PageState {
  loading: boolean;
  error: string | null;
  formData: any;
  selectedProducts: string[];
}
```

## 11. Development Workflow

### 11.1 Environment Setup
```bash
# Development
npm run dev          # Start dev server
npm run type-check   # TypeScript validation
npm run lint         # ESLint check
npm run test         # Run tests

# Build & Deploy
npm run build        # Production build
npm run preview      # Preview build locally
npm run deploy       # Deploy to Vercel/Netlify
```

### 11.2 Git Workflow
```
feature/setup-analytics
feature/conversion-modal
feature/b2b-forms
feature/whatsapp-integration
feature/seo-optimization
```

---

*Esta arquitetura fornece a base técnica sólida para desenvolvimento do website M5 Max Produções, com foco em conversão, tracking e experiência do usuário.*