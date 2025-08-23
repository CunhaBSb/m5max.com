# 🎆 M5 Max Produções - Website

> Website profissional para empresa de pirotecnia com 40+ anos de experiência, focado em conversão multi-segmento e tracking avançado.

[![Deploy Status](https://img.shields.io/badge/deploy-live-brightgreen)](https://m5max.com.br)
[![Lighthouse Score](https://img.shields.io/badge/lighthouse-90+-green)](https://pagespeed.web.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61dafb)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-38bdf8)](https://tailwindcss.com/)

## 🎯 Visão Geral

O website M5 Max Produções é uma solução completa de marketing digital para empresa de pirotecnia profissional, com foco em:

- **🎪 Shows Profissionais (B2B):** Réveillon, festivais, casamentos, eventos corporativos
- **👶 Chá Revelação:** Kits temáticos seguros para famílias
- **🎉 Kits DIY:** Fogos certificados para eventos pequenos

### ✨ Destaques Técnicos

- **Multi-segmento:** Jornadas personalizadas por tipo de público
- **Analytics Avançado:** GTM + GA4 + Meta Pixel com tracking completo
- **LGPD Compliant:** Consent Mode v2 e gestão de privacidade
- **Performance:** Core Web Vitals otimizados, Lighthouse Score >90
- **Mobile-first:** Design responsivo e touch-friendly
- **SEO Otimizado:** Schema markup e estratégia de conteúdo

## 🏗️ Arquitetura Técnica

### Stack Principal
```typescript
Frontend:     Vite + React 18 + TypeScript 5
Styling:      TailwindCSS 3.4 + Radix UI
Routing:      React Router DOM 6
Forms:        React Hook Form + Zod
State:        Zustand + React Context
Analytics:    GTM + GA4 + Meta Pixel
Deploy:       Vercel / Netlify
```

### Estrutura do Projeto
```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Design system (Button, Card, Input...)
│   ├── forms/          # Formulários de conversão
│   ├── layout/         # Header, Footer, Navigation
│   └── analytics/      # Tracking e consent management
├── pages/              # Páginas por segmento
│   ├── home/           # Homepage com segmentação
│   ├── shows-pirotecnicos/  # B2B hub + sazonais
│   ├── cha-revelacao/  # Produtos para chá revelação
│   └── kits/           # Kits DIY por categoria
├── hooks/              # Custom hooks (analytics, attribution...)
├── utils/              # Utilities (WhatsApp, UTM, validation...)
├── store/              # Zustand stores
└── types/              # TypeScript definitions
```

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Git

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/m5max/website.git
cd website

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas chaves de API

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

### Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build local
npm run type-check   # Verificação TypeScript
npm run lint         # ESLint
npm run test         # Testes unitários
npm run test:e2e     # Testes E2E
```

## 📊 Analytics e Tracking

### Eventos Principais
- **Page Views:** Tracking por segmento de audiência
- **Conversões:** WhatsApp clicks e form submissions
- **Produtos:** View, select e begin checkout
- **Vídeos:** Start, progress e complete
- **Lead Scoring:** Qualificação automática

### Configuração Analytics
```typescript
// Variáveis necessárias no .env
VITE_GTM_ID=GTM-XXXXXXX
VITE_GA4_ID=G-XXXXXXXXXX  
VITE_META_PIXEL_ID=123456789
```

## 🎨 Sistema de Design

### Paleta de Cores
```css
Primary:   #f97316  /* Laranja pirotécnico */
Secondary: #64748b  /* Cinza neutro */
Accent:    #fbbf24  /* Dourado faíscas */
Safety:    #16a34a  /* Verde segurança */
```

### Componentes Base
- **Button:** 5 variantes (primary, secondary, outline, ghost, whatsapp)
- **Card:** 4 variantes (default, elevated, outlined, glass)
- **Form Fields:** Todos tipos com validação Zod
- **Modal:** Conversion modal com opções WhatsApp/Form

## 🔄 Fluxos de Conversão

### B2B (Shows Profissionais)
```
Homepage → Cartão B2B → Landing Shows → CTA → Modal → WhatsApp/Form → Lead Qualificado
```

### Chá Revelação
```
Homepage → Cartão Chá → Landing Produtos → Seleção Kit → Modal → WhatsApp → Checkout
```

### Kits DIY
```
Homepage → Cartão Kits → Calculator → Seleção → Modal → WhatsApp → Purchase
```

## 📱 Responsividade

### Breakpoints
- **Mobile:** 320px - 768px
- **Tablet:** 768px - 1024px  
- **Desktop:** 1024px+
- **Large:** 1280px+

### Touch Targets
- Botões ≥ 44px em mobile
- Áreas clicáveis bem definidas
- Gestos touch suportados

## 🛡️ Segurança e Compliance

### LGPD
- Consent banner com opções granulares
- Gestão de preferências de cookies
- Opt-out funcional
- Política de privacidade atualizada

### Security Headers
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- HTTPS obrigatório

## 🧪 Testing

### Estratégia de Testes
```bash
Unit Tests:        Componentes isolados
Integration:       Fluxos de conversão
E2E:              Jornadas críticas
Performance:       Core Web Vitals
Accessibility:     WCAG 2.1 AA
```

### Coverage Target
- **Lines:** >80%
- **Functions:** >80%
- **Branches:** >80%
- **Statements:** >80%

## 📈 Performance

### Targets
- **LCP:** <2.5s (Largest Contentful Paint)
- **FID:** <100ms (First Input Delay)
- **CLS:** <0.1 (Cumulative Layout Shift)
- **Lighthouse:** >90 overall score

### Otimizações
- Code splitting por rota
- Lazy loading de componentes
- Image optimization
- Bundle analysis
- CDN optimization

## 🚀 Deploy

### Vercel (Recomendado)
```bash
# 1. Connect repository to Vercel
# 2. Configure environment variables
# 3. Auto-deploy on push to main
```

### Netlify (Alternativa)
```bash
# netlify.toml configuration included
# Auto-deploy with build optimization
```

## 📚 Documentação Completa

### 📋 Documentos Principais
1. **[PRD](PRD.md)** - Product Requirements Document
2. **[Arquitetura](Arquitetura.md)** - Arquitetura técnica detalhada
3. **[Páginas](pages.md)** - Especificação de todas as páginas
4. **[Componentes](componentes-ui.md)** - Design system e UI components
5. **[Setup](setup-inicial.md)** - Configuração inicial completa
6. **[Analytics](analytics-tracking.md)** - Sistema de tracking
7. **[Deploy](deployment-testing.md)** - Deploy e testing strategy
8. **[Implementação](guia-implementacao.md)** - Roadmap de desenvolvimento
9. **[Manutenção](manutencao-roadmap.md)** - Guia de manutenção e roadmap

### 🎯 Por Onde Começar
1. **Desenvolvedores:** Leia [Setup Inicial](setup-inicial.md) → [Arquitetura](Arquitetura.md) → [Implementação](guia-implementacao.md)
2. **Designers:** Consulte [Componentes UI](componentes-ui.md) → [Páginas](pages.md)
3. **Marketing:** Veja [Analytics](analytics-tracking.md) → [PRD](PRD.md)
4. **Gestores:** Leia [PRD](PRD.md) → [Roadmap](manutencao-roadmap.md)

## 🎯 Métricas de Sucesso

### KPIs Principais
- **Conversão B2B:** Target 12% (atual ~8%)
- **Conversão Chá:** Target 18% (atual ~12%)
- **Conversão Kits:** Target 15% (atual ~10%)
- **Lead Score Médio:** Target 55 pontos
- **Response Rate:** Target 75%

### Analytics Dashboard
- Real-time conversions
- Traffic sources breakdown
- Device performance
- Geographic distribution
- Seasonal trends

## 👥 Contribuição

### Workflow
1. Fork o repositório
2. Crie feature branch (`git checkout -b feature/amazing-feature`)
3. Commit suas mudanças (`git commit -m 'feat: add amazing feature'`)
4. Push para branch (`git push origin feature/amazing-feature`)
5. Abra Pull Request

### Code Standards
- **TypeScript:** Strict mode habilitado
- **ESLint:** Airbnb config
- **Prettier:** Code formatting
- **Conventional Commits:** Commit message standard

## 🆘 Suporte

### Troubleshooting
Consulte o [Guia de Manutenção](manutencao-roadmap.md#troubleshooting-guide) para soluções de problemas comuns.

### Contato
- **Issues:** Use GitHub Issues para bugs e features
- **Email:** dev@m5max.com.br
- **WhatsApp:** (61) 8273-5575

## 📄 Licença

Copyright © 2025 M5 Max Produções. Todos os direitos reservados.

---

## 🎉 Status do Projeto

- ✅ **MVP:** Homepage + Conversão básica
- ✅ **Analytics:** GTM + GA4 + Meta Pixel
- ✅ **B2B Flow:** Shows profissionais completo
- ✅ **Product Flow:** Chá + Kits funcionais
- 🚧 **E-commerce:** Em desenvolvimento Q4 2025
- 📋 **Mobile App:** Planejado para 2026

### Última Atualização
**Data:** Março 2025  
**Versão:** 1.0.0  
**Status:** Produção  

---

<div align="center">

**[🎆 Visite o Site](https://m5max.com.br)** | **[📊 Analytics](https://analytics.google.com)** | **[🚀 Deploy](https://vercel.com)**

*Transformando momentos especiais em espetáculos inesquecíveis há mais de 40 anos.*

</div>