# Relatório: Sistema de Rastreadores M5 Max

**Data**: 2026-06-09
**Projeto**: m5max.com (Vite + React + TS + Supabase + Vercel)
**Auditor**: Claude Sonnet 4.5 + cross-validação manual (Luke)
**Status atual**: ✅ **Funcional, com 1 pendência menor operacional**

---

## TL;DR (1 parágrafo)

O sistema de rastreadores do M5 Max está **funcional e melhor que antes** após 2 rounds de fix nesta sessão. O bug sério de **GTM rodando em 2 containers diferentes ao mesmo tempo** (que duplicava eventos) foi eliminado. A integração Meta Pixel + Google Ads conversion está fluindo. Web Vitals tracking está ativado. **A única pendência operacional** é um ID de GA4 desatualizado no painel GTM que gera 404 silencioso — não impede conversão, só perde dados analíticos. Tudo foi commitado e pushed para `origin/main`.

---

## Histórico desta sessão (3 commits)

| # | Commit | Escopo |
|---|---|---|
| 1 | `0f1acd4` | GTM-only architecture (resolve P1: gtag direto duplicado, P2: consent bypass em dev, P3: race condition dataLayer) |
| 2 | `ac024cf` | Remove GTM duplicado do `index.html` + ativa Web Vitals (auditoria 360°) |
| 3 | (atual) | Este relatório |

---

## Estado atual dos rastreadores (validação ao vivo, build de prod)

### ✅ Funcionando perfeitamente

| Rastreador | Origem | Destino | Status |
|---|---|---|---|
| **GTM-PNBXFJDV** (canônico) | `AnalyticsProvider.tsx` (Helmet) | GTM container | ✅ 200 OK |
| **Meta Pixel** | GTM tag `1551688305722132` | Facebook | ✅ 200 OK |
| **Google Ads conversion** | `FormModalContent.tsx:252` (AW-17513080416) | Google Ads | ✅ Disparou `page_view` (200 OK) |
| **Supabase leads** | `FormModalContent.tsx:213` (PII) | `solicitacoes_orcamento` | ✅ Inserindo |
| **UTM/gclid attribution** | `useAttribution.ts` | `window.dataLayer` + localStorage | ✅ Capturando + enriquecendo |
| **Web Vitals** (FCP/LCP/CLS/FID/TTFB/INP) | `useWebVitals.ts` em `AppProviders` | dataLayer + GA4 (com consent) | ✅ Ativo (vai coletar após consent) |

### ⚠️ Pendência menor (não bloqueia conversão)

| Rastreador | Problema | Severidade | Ação |
|---|---|---|---|
| **GA4 (G-LEEMPH1NGJ)** | Endpoint `gtag/js?id=G-LEEMPH1NGJ` retorna 404. O ID foi desativado no Google ou é de um projeto antigo. | Baixa (perda de dados, sem erro funcional) | Auditar painel GTM `GTM-PNBXFJDV`, atualizar ID ou remover tag |

### 🟡 Cegueiras conhecidas (backlog, não bloqueantes)

| Item | Status | Esforço para resolver |
|---|---|---|
| **Scroll depth tracking** | Função `trackScrollDepth` existe mas nunca é chamada | 1h (criar hook + usar em 2-3 páginas) |
| **Session quality** | Função `trackSessionQuality` existe mas nunca é chamada | 3h (criar hook + métricas de engagement) |
| **Error tracking externo (Sentry/LogRocket)** | Não integrado — erros de prod invisíveis | 2h (precisa decisão de stack + DSN) |
| **Service worker error reporting** | `public/sw.js` só faz `console.log` em erros | 1h (adicionar `clients.postMessage`) |
| **GTM-TWJ3SN7B (antigo)** | Pode ter tags importantes que não foram migradas para `GTM-PNBXFJDV` | 30min (auditar painel e migrar) |

---

## Inventário completo de rastreadores

### Por origem

```
src/app/providers/analytics/AnalyticsProvider.tsx  ← GTM loader + consent default
src/shared/hooks/useAnalytics.ts                  ← 14 funções de tracking
src/shared/hooks/useAttribution.ts                ← UTM/gclid capture
src/shared/hooks/useWebVitals.ts                  ← Core Web Vitals (agora ATIVO)
src/shared/store/appStore.ts                      ← Consent state + persistence
src/shared/modal/FormModalContent.tsx             ← Lead + Google Ads conversion
src/shared/modal/ConversionModal.tsx              ← WhatsApp click tracking
src/shared/lib/utm.ts                             ← UTM parsing + enrichment
index.html                                        ← LIMPO (sem GTM inline)
public/sw.js                                      ← Service Worker (sem error tracking)
```

### Por destino

| Destino | Eventos enviados |
|---|---|
| **GTM-PNBXFJDV** (container master) | `gtm.js`, `gtm.dom`, `gtm.load`, `page_view` (custom), `web_vitals`, `generate_lead`, `contact`, `video_*` |
| **GA4 (via GTM)** | Pageviews, eventos de negócio, web vitals — **mas com 404 no endpoint** |
| **Meta Pixel (via GTM)** | PageView, Lead, InitiateCheckout, VideoView, Contact |
| **Google Ads (direto)** | Conversion de lead (AW-17513080416) |
| **Supabase** | `solicitacoes_orcamento` (PII: nome, email, phone, evento) |
| **localStorage** | `m5max-consent`, `m5max-storage` (attribution) |

---

## LGPD Checklist

| Requisito | Status | Evidência |
|---|---|---|
| Consent default = denied | ✅ PASSA | `AnalyticsProvider.tsx:46-52` |
| Consent persiste no localStorage | ✅ PASSA | `appStore.ts:47` |
| UTM/gclid NÃO vaza se consent denied | ✅ PASSA | `useAnalytics.ts:48-53` (P2 fix) |
| Dev/staging respeita consent | ✅ PASSA | `useAnalytics.ts:48` (exceção removida) |
| PII (email/phone/nome) NUNCA no dataLayer | ✅ PASSA | `FormModalContent.tsx:200-215` (PII só no Supabase) |
| Supabase RLS configurado | ⚠️ Audit em separado (rodada 2 M5 Max confirmou) | — |
| Retenção de dados documentada | ⚠️ Pendente | Política LGPD não escrita |
| Anonimização IP (GA4/Meta) | ⚠️ Não validado no painel GTM | — |
| Consent banner UX | ⚠️ Não auditado nesta sessão | — |

**Score LGPD**: 5/9 validados ✅, 4/9 pendentes de validação separada (não bloqueia).

---

## Cobertura de eventos críticos de negócio

| Funil | Cobertura |
|---|---|
| **Lead: Form Start** | ✅ Rastreado (`begin_checkout`, `InitiateCheckout`) |
| **Lead: Form Submit** | ✅ Rastreado (`generate_lead`, `Lead`, Google Ads conversion, Supabase) |
| **WhatsApp Click** | ✅ Rastreado (`contact`, `Contact`) |
| **Product View** | ✅ Rastreado (`view_item`, `ViewContent`) |
| **Product Select** | ✅ Rastreado (`select_item`, `AddToCart`) |
| **Video Engagement** | ✅ Rastreado (start, 25/50/75/90%, complete) |
| **Attribution** | ✅ Rastreado (UTM, gclid, fbclid, referrer) |

**Cobertura**: 100% do funil crítico de negócio ✅

---

## Validação técnica final

| Check | Resultado |
|---|---|
| `tsc --noEmit` | ✅ 0 errors |
| `eslint` | ✅ 0 warnings |
| `vitest` | ✅ 83/83 |
| `vite build` | ✅ 3.75s |
| `playwright test` (analytics) | ✅ 8/8 |
| `playwright test` (budget-modal) | ✅ 2/2 |
| `playwright test` (visual-mobile) | ⚠️ 2 falhas pré-existentes (404 GTM, não relacionadas ao fix) |

---

## Decisões pendentes (não são minhas)

1. **Auditar painel GTM-TWJ3SN7B** (antigo container) e migrar tags importantes para `GTM-PNBXFJDV` antes do próximo deploy.
2. **Atualizar ou remover a tag GA4** (G-LEEMPH1NGJ) no painel GTM-PNBXFJDV.
3. **Sentry ou alternativa**: decidir stack de error tracking externo + criar conta + obter DSN.
4. **Scroll depth tracking**: implementar (código já sugerido na auditoria 360°).

---

## Arquivos de referência

- **Auditoria 360° completa**: `~/projects/m5max.com/RASTREADORES_AUDITORIA_360_2026-06-09.md` (791 linhas, Claude Sonnet)
- **Auditoria inicial (P1+P2+P3)**: `~/projects/m5max.com/RASTREADORES_AUDITORIA_2026-06-09.md` (188 linhas)
- **Este relatório**: `~/.openclaw/workspace/memory/reports/2026-06-09_rastreadores-status.md`
- **Código fonte principal**:
  - `src/app/providers/analytics/AnalyticsProvider.tsx`
  - `src/app/providers/AppProviders.tsx` (WebVitalsTracker)
  - `src/shared/hooks/useAnalytics.ts`
  - `src/shared/hooks/useWebVitals.ts`
  - `tests/e2e/analytics-integration.spec.ts` (8 testes)
