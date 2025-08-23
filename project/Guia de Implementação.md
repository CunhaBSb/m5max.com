# Guia de Implementação - M5 Max Produções

## 1. Roadmap de Desenvolvimento

### 1.1 Sprint 1 - Fundação (Semana 1)
```markdown
**Objetivos:** Setup inicial e estrutura base
**Duração:** 5 dias úteis
**Entregáveis:**
- [x] Projeto inicializado com Vite + React + TypeScript
- [x] Configuração Tailwind CSS
- [x] Estrutura de pastas definida
- [x] Design system básico (Button, Card, Input)
- [x] Roteamento configurado
- [x] Store Zustand configurado
```

#### Dia 1: Setup Inicial
```bash
# 1. Criar projeto
npm create vite@latest m5-max-website -- --template react-ts
cd m5-max-website

# 2. Instalar dependências
npm install react-router-dom react-hook-form @hookform/resolvers zod
npm install @radix-ui/react-dialog @radix-ui/react-tabs 
npm install lucide-react clsx tailwind-merge zustand
npm install -D tailwindcss autoprefixer postcss @types/node

# 3. Configurar Tailwind
npx tailwindcss init -p
```

#### Dia 2: Estrutura Base
```typescript
// Criar estrutura de pastas conforme documentação
// Implementar configurações base (vite.config.ts, tailwind.config.js)
// Setup inicial do store Zustand
// Configurar aliases TypeScript
```

#### Dia 3: Design System
```typescript
// Implementar componentes base:
// - Button com variantes
// - Card com variantes 
// - Input e FormField
// - Badge e LoadingSpinner
// Configurar CSS global
```

#### Dia 4: Layout Base
```typescript
// Implementar:
// - Header responsivo
// - Footer completo
// - Layout wrapper
// - Navigation components
```

#### Dia 5: Roteamento
```typescript
// Configurar:
// - React Router com todas as rotas
// - Layout routing
// - 404 page
// - Redirects básicos
```

---

### 1.2 Sprint 2 - Analytics & Tracking (Semana 2)
```markdown
**Objetivos:** Implementar sistema de analytics completo
**Duração:** 5 dias úteis
**Entregáveis:**
- [x] GTM integrado e funcionando
- [x] Consent Mode v2 implementado
- [x] Attribution tracking funcionando
- [x] Eventos customizados configurados
- [x] Meta Pixel ativo
```

#### Dia 1: GTM Setup
```typescript
// 1. Implementar GTMManager class
// 2. Configurar consent mode v2
// 3. Criar hook useAnalytics
// 4. Setup inicial dataLayer
```

#### Dia 2: Consent Management
```typescript
// 1. Implementar ConsentBanner component
// 2. ConsentSettings modal
// 3. Integração com store
// 4. Persistência de preferências
```

#### Dia 3: Attribution System
```typescript
// 1. Implementar useAttribution hook
// 2. UTM capture e storage
// 3. Click ID tracking (gclid/fbclid)
// 4. Session management
```

#### Dia 4: Custom Events
```typescript
// 1. Page view tracking
// 2. Scroll depth tracking
// 3. Video engagement events
// 4. Conversion events base
```

#### Dia 5: Meta Pixel
```typescript
// 1. Meta Pixel integration
// 2. Custom conversions setup
// 3. Event mapping GA4 ↔ Meta
// 4. Testing e validation
```

---

### 1.3 Sprint 3 - Homepage & Conversão (Semana 3)
```markdown
**Objetivos:** Implementar página inicial e sistema de conversão
**Duração:** 5 dias úteis
**Entregáveis:**
- [x] Homepage completa e responsiva
- [x] Modal de conversão funcionando
- [x] Formulários de qualificação
- [x] Integração WhatsApp
- [x] Lead scoring implementado
```

#### Dia 1: Homepage Structure
```typescript
// 1. HeroSection component
// 2. SegmentationCards (3 cartões)
// 3. TrustSection com social proof
// 4. VideoPlayer component
```

#### Dia 2: Conversion Modal
```typescript
// 1. ConversionModal component
// 2. Opções WhatsApp vs Formulário
// 3. Tracking de abertura e interações
// 4. Responsive design
```

#### Dia 3: Formulários de Qualificação
```typescript
// 1. B2BForm component
// 2. ChaForm component  
// 3. KitsForm component
// 4. Validation com Zod schemas
```

#### Dia 4: WhatsApp Integration
```typescript
// 1. WhatsApp URL generation
// 2. UTM preservation
// 3. Message templates
// 4. Click tracking
```

#### Dia 5: Lead Scoring
```typescript
// 1. Lead scoring algorithm
// 2. Priority classification
// 3. Follow-up strategy
// 4. Integration com forms
```

---
### 1.4 Sprint 4 - Páginas B2B (Semana 4)
```markdown
**Objetivos:** Implementar seção de shows profissionais
**Duração:** 5 dias úteis
**Entregáveis:**
- [x] Hub shows-pirotecnicos completo
- [x] Páginas sazonais (Réveillon, Festa Junina, etc)
- [x] Portfólio/Cases page
- [x] Integration YouTube
- [x] SEO optimization
```

#### Dia 1: B2B Hub Page
```typescript
// 1. ShowsPirotecnicosPage layout
// 2. Hero section B2B
// 3. Services grid
// 4. Differentials section
```

#### Dia 2: Páginas Sazonais
```typescript
// 1. ReveillonPage
// 2. FestaJuninaPage  
// 3. CasamentosPage
// 4. Template base sazonal
```

#### Dia 3: Cases/Portfólio
```typescript
// 1. CasesPage layout
// 2. CaseStudyCard component
// 3. Filtros por categoria
// 4. Featured case highlight
```

#### Dia 4: YouTube Integration
```typescript
// 1. YouTube API integration
// 2. VideoPlayer com tracking
// 3. Embed responsivo
// 4. Playlist integration
```

#### Dia 5: SEO B2B
```typescript
// 1. Meta tags dinâmicas
// 2. Schema markup implementation
// 3. Breadcrumbs
// 4. Internal linking
```

---

### 1.5 Sprint 5 - Páginas Chá & Kits (Semana 5)
```markdown
**Objetivos:** Implementar seções de produtos
**Duração:** 5 dias úteis
**Entregáveis:**
- [x] Hub chá-revelacao completo
- [x] Hub kits DIY completo
- [x] Product cards e seleção
- [x] Checkout flow
- [x] Product tracking
```

#### Dia 1: Chá Revelação Hub
```typescript
// 1. ChaRevelacaoPage layout
// 2. Hero emotivo
// 3. Kit options display
// 4. Safety instructions
```

#### Dia 2: Kits DIY Hub  
```typescript
// 1. KitsPage layout
// 2. Kit calculator/guide
// 3. Categories grid
// 4. Size guide component
```

#### Dia 3: Product Components
```typescript
// 1. ProductCard component
// 2. Product selection flow
// 3. Price display
// 4. Features comparison
```

#### Dia 4: Checkout Flow
```typescript
// 1. Product selection tracking
// 2. Begin checkout events
// 3. WhatsApp handoff
// 4. Upsell opportunities
```

#### Dia 5: Product Analytics
```typescript
// 1. Enhanced ecommerce tracking
// 2. Product view events
// 3. Selection tracking
// 4. Conversion attribution
```

---

### 1.6 Sprint 6 - Páginas de Apoio (Semana 6)
```markdown
**Objetivos:** Completar páginas de suporte e otimização
**Duração:** 5 dias úteis
**Entregáveis:**
- [x] Página Sobre Nós
- [x] Página Contato
- [x] FAQ Page
- [x] Página Legal/LGPD
- [x] 404 Page customizada
```

---

### 1.7 Sprint 7 - Testing & Performance (Semana 7)
```markdown
**Objetivos:** Testing completo e otimização de performance
**Duração:** 5 dias úteis
**Entregáveis:**
- [x] Unit tests implementados
- [x] Integration tests
- [x] E2E tests críticos
- [x] Performance optimization
- [x] Lighthouse Score > 85
```

---

### 1.8 Sprint 8 - Deploy & Go Live (Semana 8)
```markdown
**Objetivos:** Deploy e configuração produção
**Duração:** 5 dias úteis
**Entregáveis:**
- [x] CI/CD pipeline configurado
- [x] Deploy Vercel/Netlify
- [x] Analytics produção
- [x] Monitoring ativo
- [x] Documentation final
```

## 2. Checklist de Implementação Detalhado

### 2.1 Phase 1: Setup & Foundation

#### ✅ Configuração Inicial
```bash
# Estrutura base criada
├── src/
│   ├── components/ui/          # Design system
│   ├── components/forms/       # Formulários
│   ├── components/layout/      # Layout
│   ├── components/analytics/   # Analytics
│   ├── pages/                  # Páginas
│   ├── hooks/                  # Custom hooks
│   ├── utils/                  # Utilities
│   ├── store/                  # Zustand store
│   └── types/                  # TypeScript types

# Configurações
├── vite.config.ts             # Vite configuration
├── tailwind.config.js         # Tailwind CSS
├── tsconfig.json             # TypeScript
└── package.json              # Dependencies
```

#### ✅ Design System Base
```typescript
// Componentes implementados:
- Button (variants: primary, secondary, outline, ghost, whatsapp)
- Card (variants: default, elevated, outlined, glass)
- Input/FormField (types: text, email, tel, select, radio, checkbox)
- Badge (variants: success, warning, info, error)
- LoadingSpinner & LoadingSkeleton
- Modal/Dialog base
```

#### ✅ Store Configuration
```typescript
// useAppStore configurado com:
- Attribution tracking
- Consent management  
- Conversion modal state
- Current audience tracking
- UTM preservation
```

### 2.2 Phase 2: Analytics Foundation

#### ✅ GTM Implementation
```typescript
// GTMManager class implementada:
- Initialization with consent mode
- Event pushing to dataLayer
- Consent updates
- User ID configuration
```

#### ✅ Consent Management
```typescript
// ConsentBanner implementado:
- LGPD compliant banner
- Granular consent options
- Preference persistence
- GTM integration
```

#### ✅ Attribution System
```typescript
// useAttribution hook:
- UTM parameter capture
- Click ID tracking (gclid/fbclid)
- Traffic source detection
- Session management
- localStorage persistence
```

### 2.3 Phase 3: Core Pages

#### ✅ Homepage Implementation
```typescript
// Componentes da Homepage:
- HeroSection: Video, headline, CTA
- SegmentationCards: 3 cartões por audience
- TrustSection: Stats, testimonials, certifications
- ConversionModal: WhatsApp vs Form options
```

#### ✅ B2B Pages
```typescript
// Shows Pirotécnicos:
- Hub page com services grid
- Páginas sazonais (Réveillon, Festa Junina, etc)
- Cases/Portfólio com YouTube integration
- B2B qualification form
```

#### ✅ Product Pages
```typescript
// Chá Revelação & Kits:
- Product hub pages
- ProductCard components
- Selection flow
- Checkout via WhatsApp
- Product analytics tracking
```

### 2.4 Phase 4: Conversion System

#### ✅ Form Implementation
```typescript
// Formulários com Zod validation:
- B2BForm: Event details, budget, attendees
- ChaForm: Kit selection, delivery details
- KitsForm: Category, size, eligibility
- Lead scoring calculation
```

#### ✅ WhatsApp Integration
```typescript
// WhatsApp system:
- URL generation with UTMs
- Message templates por audience
- Click tracking
- Attribution preservation
```

## 3. Testing Strategy Implementation

### 3.1 Unit Testing Checklist
```typescript
// Components to test:
✅ Button - variants, onClick, disabled states
✅ ConversionModal - open/close, option selection
✅ ProductCard - view tracking, selection
✅ FormField - validation, error states
✅ WhatsAppButton - URL generation, tracking
```

### 3.2 Integration Testing
```typescript
// Flows to test:
✅ Homepage → B2B → Modal → WhatsApp
✅ Homepage → Chá → Product → Selection
✅ Analytics events chain
✅ Attribution preservation
✅ Consent flow
```

### 3.3 E2E Testing
```typescript
// Critical paths:
✅ B2B conversion flow complete
✅ Product selection and checkout
✅ Analytics tracking validation
✅ Mobile responsiveness
✅ Performance benchmarks
```

## 4. Performance Optimization Checklist

### 4.1 Core Web Vitals
```typescript
// Targets:
✅ LCP < 2.5s (Largest Contentful Paint)
✅ FID < 100ms (First Input Delay)  
✅ CLS < 0.1 (Cumulative Layout Shift)
✅ Overall Lighthouse Score > 85
```

### 4.2 Optimization Techniques
```typescript
// Implemented:
✅ Code splitting por rota
✅ Lazy loading de componentes
✅ Image optimization
✅ Bundle analysis e tree shaking
✅ Performance monitoring
```

## 5. SEO Implementation Checklist

### 5.1 Technical SEO
```typescript
// Implemented:
✅ Meta tags dinâmicas por página
✅ Schema markup (LocalBusiness, Product, Event)
✅ Sitemap.xml generation
✅ robots.txt configuration
✅ Canonical URLs
```

### 5.2 Content SEO
```typescript
// Content strategy:
✅ Keyword-optimized page titles
✅ Meta descriptions únicas
✅ H1-H6 hierarchy correct
✅ Alt text em todas imagens
✅ Internal linking strategy
```

## 6. Security & Compliance

### 6.1 Security Headers
```typescript
// Configured:
✅ X-Content-Type-Options: nosniff
✅ X-Frame-Options: DENY
✅ X-XSS-Protection: 1; mode=block
✅ Referrer-Policy: strict-origin-when-cross-origin
✅ HTTPS enforcement
```

### 6.2 LGPD Compliance
```typescript
// Implemented:
✅ Consent banner com granular options
✅ Privacy policy updated
✅ Cookie policy clear
✅ Opt-out functionality
✅ Data minimization
```

## 7. Deployment Checklist

### 7.1 Environment Setup
```bash
# Production environment:
✅ Vercel/Netlify project configured
✅ Environment variables set
✅ Domain DNS configured
✅ SSL certificate active
✅ CDN optimization enabled
```

### 7.2 Analytics Production
```bash
# Analytics configured:
✅ GTM container live
✅ GA4 property configured
✅ Meta Pixel active
✅ Conversion tracking working
✅ Custom audiences created
```

### 7.3 Monitoring Setup
```bash
# Monitoring active:
✅ Error tracking (Sentry/LogRocket)
✅ Performance monitoring
✅ Uptime monitoring
✅ Analytics alerts
✅ Conversion tracking alerts
```

## 8. Launch Preparation

### 8.1 Content Preparation
```markdown
# Content ready:
✅ All copy reviewed and approved
✅ Images optimized and uploaded
✅ Videos tested and embedded
✅ Product information complete
✅ Legal pages updated
```

### 8.2 Team Training
```markdown
# Team prepared:
✅ Analytics dashboard access
✅ Lead management process
✅ WhatsApp response templates
✅ Escalation procedures
✅ Performance monitoring
```

### 8.3 Go-Live Protocol
```markdown
# Launch sequence:
1. Final testing in staging
2. DNS cutover
3. SSL verification
4. Analytics verification
5. Conversion test
6. Team notification
7. Monitoring activation
8. Performance baseline
```

---
