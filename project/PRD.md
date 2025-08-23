# PRD - M5 Max Produções Website

## 1. Visão Geral do Projeto

### 1.1 Empresa
**M5 Max Produções** - empresa de pirotecnia profissional com 40+ anos de experiência

### 1.2 Objetivo Principal
Desenvolver um website multi-segmento para geração de leads qualificados e vendas de:
- Shows pirotécnicos profissionais (B2B)
- Kits temáticos para Chá Revelação
- Kits DIY para eventos pequenos

### 1.3 Stack Técnico
- **Frontend:** Vite + React + TypeScript + TailwindCSS v3.4.17
- **Routing:** React Router DOM
- **Forms:** React Hook Form + Zod
- **Analytics:** GTM + GA4 + Meta Pixel + Consent Mode v2
- **Deploy:** Vercel/Netlify
- **Design:** Mobile-first, responsivo

## 2. Personas e Segmentos

### 2.1 Organizadores B2B/Institucional
- **Quem:** Produtoras, prefeituras, clubes, resorts, shoppings, cerimoniais
- **Dores:** Segurança, licenças, confiabilidade, compliance, prazos
- **Valor M5:** 40+ anos experiência, equipe habilitada, normas, portfólio nacional

### 2.2 Chá Revelação (Famílias/Cerimoniais)
- **Quem:** Famílias grávidas, cerimoniais especializados
- **Dores:** Surpresa perfeita, segurança, ideias criativas, preço claro
- **Valor M5:** Kits seguros, controle remoto, personalização, suporte consultivo

### 2.3 Kits DIY Eventos Pequenos
- **Quem:** Famílias (Réveillon, confraternizações, aniversários)
- **Dores:** O que comprar, como usar com segurança, onde é permitido
- **Valor M5:** Kits certificados, curadoria por área, instruções claras

## 3. Funcionalidades Core

### 3.1 Sistema de Segmentação
- Home com 3 cartões direcionados por persona
- Rotas específicas por público-alvo
- Conteúdo personalizado por contexto

### 3.2 Sistema de Conversão
- **Modal unificado** com 2 opções:
  - WhatsApp (com UTM tracking)
  - Formulário do site (condicional por segmento)
- Qualificação imediata via campos inteligentes
- CTAs contextuais por página

### 3.3 Sistema de Tracking
- UTMs padronizados por canal/campanha
- Eventos GA4 + Meta Pixel por funil
- Consent Mode v2 compliant
- Attribution tracking (gclid/fbclid)

### 3.4 Integração WhatsApp
- Links com UTM para rastreamento
- Mensagens pré-estruturadas por contexto
- Botões de resposta rápida
- Qualificação automática

## 4. Objetivos de Negócio (KPIs)

### 4.1 Conversão
- **CTR Anúncios:** ≥4% (pesquisa), ≥1.2% (social)
- **CVR Landing Pages:** ≥8% (B2B), ≥12% (Chá/Kits)
- **Taxa Resposta WhatsApp:** ≥60%

### 4.2 Qualidade de Lead
- Lead scoring automático baseado em:
  - Orçamento (≥R$50k = +30 pontos)
  - Data definida (+20 pontos)
  - Referência case M5 (+15 pontos)

### 4.3 SEO e Orgânico
- Redução de CAC via conteúdo evergreen
- Rankings para termos sazonais (Réveillon, Festa Junina)
- YouTube integration (canal FogosM5)

## 5. Requisitos Funcionais

### 5.1 Páginas Obrigatórias
```
/ (Home)
/shows-pirotecnicos (Hub B2B)
  /shows-pirotecnicos/reveillon
  /shows-pirotecnicos/festa-junina
  /shows-pirotecnicos/casamentos
  /shows-pirotecnicos/festivais
  /shows-pirotecnicos/clubes-e-condominios
/cases (Portfólio)
/cha-revelacao (Hub)
  /cha-revelacao/kits
  /cha-revelacao/seguranca
/kits (DIY Hub)
  /kits/reveillon
  /kits/confraternizacao
  /kits/aniversario
/contato
/sobre
/faq
/legal
```

### 5.2 Componentes Críticos

#### Modal de Conversão
- 2 opções: WhatsApp vs Formulário
- UTM preservation
- Contexto por segmento

#### Formulário Condicional
- **B2B:** evento + anexos + dados técnicos
- **Chá/Kits:** escolha produto + elegibilidade + endereço

#### Player de Vídeo
- YouTube embeds com tracking
- Schema VideoObject
- Events: start, 50%, complete

#### Galeria de Cases
- Filtros por tipo de evento
- Integração com YouTube FogosM5
- Provas sociais (logos clientes)

### 5.3 Integrações Externas

#### WhatsApp Business
- Links com UTM tracking
- Mensagens pré-estruturadas
- Botões de resposta rápida

#### YouTube
- Canal: https://www.youtube.com/@FogosM5Max
- Embed responsivo
- Tracking de engajamento

#### Analytics Stack
- Google Tag Manager
- GA4 com Enhanced Ecommerce
- Meta Pixel
- Consent Mode v2

## 6. Requisitos Não-Funcionais

### 6.1 Performance
- Core Web Vitals verdes
- Lazy loading para imagens/vídeos
- Code splitting por rota

### 6.2 SEO
- Schema markup (LocalBusiness, Event, Product, FAQPage)
- Meta tags dinâmicas
- URLs semânticas
- Sitemap XML

### 6.3 Segurança & Compliance
- LGPD compliance
- Avisos de segurança em produtos
- Validação de idade (18+)
- SSL/HTTPS obrigatório

### 6.4 Responsividade
- Mobile-first design
- Breakpoints: 640px, 768px, 1024px, 1280px
- Touch-friendly (botões ≥44px)

## 7. Conteúdo Estratégico

### 7.1 Lead Magnets
- **B2B:** "Checklist de Licenças e Segurança"
- **Chá/Kits:** "Guia de Uso Seguro em 7 Passos"

### 7.2 Cases Destacados
- Réveillon Iate Clube Brasília 2024/2025
- Vídeo: https://www.youtube.com/watch?v=xUPt4tZIM-s

### 7.3 Conteúdo Sazonal
- **Q1:** Pós-Réveillon, Carnaval
- **Q2:** Festa Junina
- **Q3:** Casamentos, Spring/Summer
- **Q4:** Réveillon, Kits DIY

## 8. Fluxo de Desenvolvimento

### 8.1 Fase 1 - MVP
1. Setup projeto (Vite + React + TS + Tailwind)
2. Configuração routing básico
3. Home com 3 cartões de segmento
4. 3 landing pages principais: /shows-pirotecnicos, /cha-revelacao, /kits
5. Modal de conversão (WhatsApp + Formulário)
6. Setup GTM + GA4 básico

### 8.2 Fase 2 - Core Features
1. Subpáginas sazonais
2. Sistema de tracking completo
3. Integração WhatsApp com UTMs
4. Formulários condicionais
5. Player de vídeo com tracking

### 8.3 Fase 3 - Otimização
1. Consent Mode v2
2. Schema markup
3. Meta Pixel + Custom Audiences
4. Performance optimization
5. A/B testing setup

## 9. Critérios de Aceite

### 9.1 Funcional
- [ ] Todas as 3 personas têm jornadas completas
- [ ] Modal de conversão funciona em mobile/desktop
- [ ] UTMs são preservados no WhatsApp
- [ ] Formulários validam e enviam dados
- [ ] Vídeos carregam e trackam corretamente

### 9.2 Técnico
- [ ] Core Web Vitals ≥ 90
- [ ] Responsivo em todos breakpoints
- [ ] GTM + GA4 + Meta Pixel ativos
- [ ] Consent banner LGPD compliant
- [ ] SEO basics implementados

### 9.3 Negócio
- [ ] Cada segmento tem CTA claro
- [ ] Lead scoring implementado
- [ ] Tracking de conversões funcionando
- [ ] WhatsApp recebe leads qualificados

## 10. Próximos Passos

1. **Setup inicial:** Configurar ambiente de desenvolvimento
2. **Design System:** Definir componentes base com Tailwind
3. **Routing:** Implementar todas as rotas principais
4. **Components:** Desenvolver modal, formulários, players
5. **Analytics:** Configurar tracking completo
6. **Testing:** Validar todos os fluxos de conversão
7. **Deploy:** Configurar CI/CD para Vercel/Netlify

---

*Este PRD serve como guia completo para desenvolvimento do website M5 Max Produções, priorizando conversão, tracking e experiência do usuário por segmento.*