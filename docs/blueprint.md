# ​ Blueprint de Funil, Tráfego & Tech – M5 Max Produções  
**Versão:** 1.1  
**Atualizado em:** 22/08/2025

---

## ​ 1. Stack e Fundamentos Técnicos

- **Frontend:** Vite + React + TypeScript + TailwindCSS **v3.4.17**  
- **CSS Framework:** Tailwind (com diretivas `@tailwind base`, `components`, `utilities`)  
- **Routing:** React Router DOM  
- **Formulários:** React Hook Form + Zod  
- **Integrações:** Google Tag Manager, GA4, Meta Pixel, WhatsApp  
- **Hospedagem:** Vercel ou Netlify  
- **Mensuração:** Consent Mode v2, UTMs, `gclid` / `fbclid`, eventos customizados  
- **Responsividade:** **Mobile-first**, responsivo para celular, tablet e desktop

---

## ​ 2. Estrutura de Pastas do Projeto

src/
├── assets/ # Imagens e vídeos usados no site
├── components/ # Peças reutilizáveis (Botões, Modal, Header, Footer)
│ ├── ui/ # Elementos básicos
│ └── layout/ # Cabeçalho, rodapé, containers
├── features/ # Conteúdo dividido por público
│ ├── b2b/ # Segmento B2B (shows pirotécnicos)
│ ├── cha/ # Segmento Chá Revelação
│ └── kits/ # Segmento Kits DIY
├── forms/ # Lógica de formulários, validações
├── hooks/ # Custom React hooks (comportamentos reutilizáveis)
├── layouts/ # Estruturas de página (header + content + footer)
├── lib/ # Integrações: GA4, GTM, WhatsApp, etc.
├── pages/ # Páginas gerais (Home, Contato, FAQ…)
├── router/ # Configuração das rotas React Router
├── styles/ # Tailwind + CSS global
├── types/ # Tipagens globais (Lead, Evento…)
├── utils/ # Funções auxiliares (formatadores, validadores…)

markdown
Copiar
Editar

---

## ​ 3. Público-Alvo & Segmentação

| Segmento         | Foco                          | Dor do Cliente                                      | Valor da M5                            |
|------------------|-------------------------------|-----------------------------------------------------|----------------------------------------|
| **B2B**          | Eventos institucionais         | Segurança, licenças, prazos, sincronização          | 40 anos, equipe habilitada, portfólio  |
| **Chá Revelação**| Famílias e cerimoniais         | Originalidade, preço, segurança, entrega            | Kits seguros, personalização, consultivo |
| **Kits DIY**     | Festas pequenas (Réveillon…)   | O que comprar, onde usar legalmente, custo-benefício| Kits confirmados, instruções, suporte  |

---

## ​ 4. Estrutura de Páginas (Site Map)

- `/` – Home com acesso segmentado  
- `/shows-pirotecnicos` + subpáginas sazonais (Réveillon, Junina…)  
- `/cha-revelacao` + `/cha-revelacao/kits`  
- `/kits` + páginas por categoria (reveillon, aniversário…)  
- `/contato`, `/sobre`, `/faq`, `/legal`, `/cases`

---

## ​ 5. Componentes Chave

- Modal (WhatsApp + formulário)  
- Cards de acesso por segmento  
- Botões CTA com UTMs e rastreamento  
- Formulário inteligente com campos condicionais  
- Galeria de fotos + vídeo embutido  
- Download de lead magnets com rastreamento (`file_download`)

---

## ​ 6. Mensuração (GA4 + GTM + Meta Pixel)

- Eventos:
  - `page_view`, `whatsapp_click`, `lead_form_submit`, `select_item`, `begin_checkout`, `file_download`
- Consent Mode v2 via GTM
- `audience_segment`: `b2b` / `cha` / `kits`
- UTMs padronizadas (exemplo):
utm_source=google&utm_medium=cpc&utm_campaign=b2b-reveillon-2025

yaml
Copiar
Editar
- Captura de `gclid` e `fbclid` via cookies 1st-party com consentimento

---

## ​ 7. KPIs por Segmento

| Métrica                  | Meta                       |
|--------------------------|----------------------------|
| CTR (Google Ads)         | ≥ 4%                       |
| CVR Landing B2B          | ≥ 8%                       |
| CVR Landing Chá/Kits     | ≥ 12%                      |
| Respostas via WhatsApp   | ≥ 60%                      |
| Tempo de carregamento    | < 2 segundos               |

---

## ​ 8. Requisitos Principais

- Estrutura modular e escalável  
- **100% responsivo (mobile, tablet, desktop)**  
- Conformidade com LGPD e validações por idade nos kits  
- SEO técnico (schema.org: LocalBusiness, Product, FAQPage)  
- Rastreabilidade por funil, canal e segmento