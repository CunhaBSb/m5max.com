# Product Requirements Document (PRD) – M5 Max Produções  
**Versão:** 1.0  
**Data:** 22/08/2025  
**Responsável:** Equipe de Desenvolvimento (Claude Code)

---

## 1. Resumo Executivo

Site institucional e comercial voltado à captação de leads qualificados (B2B), vendas de kits DIY e conteúdo segmentado (Chá Revelação). A arquitetura prioriza performance, responsividade e mensuração total com foco em SEO e conversão.

---

## 2. Objetivos do Projeto

- Gerar leads para shows pirotécnicos B2B  
- Vender kits DIY para eventos familiares  
- Atender demandas de Chá Revelação com personalização  
- Reduzir CAC via SEO evergreen e segmentação eficiente  
- Mensurar e otimizar desempenho com GA4, GTM e Meta Pixel

---

## 3. Público-alvo

- **B2B:** produtoras, prefeituras, clubes e eventos institucionais  
- **Chá Revelação:** famílias e profissionais de eventos  
- **Kits DIY:** eventos familiares e pequenas celebrações

---

## 4. Requisitos Funcionais

### Estrutura de Páginas
- Home com navegação por público-alvo  
- Landings específicas: `/shows-pirotecnicos`, `/cha-revelacao`, `/kits`  
- Páginas institucionais: `/contato`, `/sobre`, `/faq`, `/legal`, `/cases`

### Comportamentos e Componentes
- Modal com duas opções de contato (WhatsApp + Form)  
- Formulário com fluxo condicional e validações  
- Download de lead magnets (checklists, PDFs)  
- Inclusão de vídeos e galerias com suporte para SEO (Schema VideoObject)

### Integrações
- UTMs consistentes e geração de `gclid`/`fbclid`  
- Tracking com GA4, GTM e Meta Pixel  
- Consent Mode v2 integrando o CMP

---

## 5. Requisitos Não-Funcionais

| Requisito        | Descrição                                                                  |
|------------------|-----------------------------------------------------------------------------|
| Performance      | Carregamento rápido (< 2 s), otimização de imagens e CSS                  |
| Responsividade   | Design adaptável para todos os dispositivos (mobile → desktop)             |
| Segurança        | LGPD e verificação de idade para acesso a produtos sensíveis               |
| SEO             | URLs amigáveis, Schema.org (LocalBusiness, FAQ, Product, Event, VideoObject) |
| Escalabilidade   | Arquitetura modular com componentes reaproveitáveis                        |
| Acessibilidade   | Teclabilidade, contraste, uso de HTML semântico                            |

---

## 6. Tecnologias

- **Frontend:** Vite + React + TypeScript + TailwindCSS v3.4.17  
- **Formulários:** React Hook Form + Zod  
- **Integração e Mensuração:** GTM, GA4, Meta Pixel, UTMs  
- **Hospedagem:** Vercel ou Netlify  
- **Design/UI:** Seguindo wireframes existentes (Figma)

---

## 7. Requisitos de Mensuração & Rastreamento

- Disparo de eventos: `page_view`, `whatsapp_click`, `lead_form_submit`, `select_item`, `begin_checkout`, `file_download` (GA4 + Meta Pixel)  
- Segmentos de audiência por evento e página  
- UTMs padronizadas para análise detalhada de origem  
- Consentimento ativo antes da coleta de dados pela ferramenta CMP

---

## 8. KPIs de Sucesso

| KPI                       | Meta                       |
|---------------------------|----------------------------|
| CTR (Google Ads)          | ≥ 4%                       |
| Conversão (Landings B2B)  | ≥ 8%                       |
| Conversão (Chá/Kits)      | ≥ 12%                      |
| Interação WhatsApp        | ≥ 60% de respostas         |
| Performance do site       | < 2 segundos de carregamento|

---

## 9. Checklist de Lançamento

- [ ] Estrutura de pastas criada  
- [ ] Home e landings implementadas  
- [ ] Formulários e modal funcionando  
- [ ] GA4, GTM e Meta Pixel com eventos ativos  
- [ ] Banner de consentimento conforme LGPD  
- [ ] Testes de UX responsivos  
- [ ] SEO e schema verificados  
- [ ] Deploy em ambiente de produção com URL segura (HTTPS)

---