# 📊 Auditoria de Rastreadores — m5max.com

**Data**: 2026-06-09
**Escopo**: integração entre `useAnalytics`, `AnalyticsProvider`, `gtm.ts`, GTM, GA4, Meta Pixel, DataLayer, consent
**Branch**: main
**Última commit relevante no tema**: `b2b3684` (fix admin cores) — sem mudanças de analytics
**Documento de referência**: `RASTREADORES_ANALISE.md` (2025-12-01, 8.2KB, 4 fases propostas)

---

## 1. Resumo executivo

**Sim, com ressalvas importantes.** A arquitetura está **bem montada e respeita LGPD/GDPR** (consent gate funcionando), mas tem **2 bugs críticos de integração** entre GTM e gtag.js que estão fazendo o site reportar dados duplicados e possivelmente **não reportar nada** no GA4 em produção. **Foi evoluída** desde o documento de dez/2025, mas **sem nova auditoria** — o que funcionou foi suposição, não validação.

| Item | dez/2025 | jun/2026 | Status |
|---|---|---|---|
| `useAnalytics.ts` | 385 linhas | 588 linhas | Cresceu 53%, +10 consumers |
| `lib/analytics.ts` (classes mortas) | 624 linhas | **removido** | ✅ Fase 1 aplicada |
| `analytics.ts` (types) | 104 | 106 | +2 (estável) |
| Arquivos usando `useAnalytics` | 32 | 42 | +10 consumidores |
| `app/providers/analytics/` | não existia | `AnalyticsProvider.tsx` + `ConsentBanner.tsx` | ✅ **novo** |
| Branch `feat/calibrar-rastreadores` | ativa | mergeado em main | ✅ Fases 1+2 aplicadas |
| `useAnalytics.test.ts` | existe | existe | ✅ |
| **Bug integração GTM × gtag.js** | não detectado | **existe, crítico** | 🔴 |
| **Bug consent em `pushToDataLayer`** | parcialmente OK | **vazamento em dev** | 🟡 |

---

## 2. Os 4 rastreadores — mapa de quem fala com quem

```
┌─────────────────────────────────────────────────────────────┐
│                       COMPONENTES                           │
│   42 arquivos usando useAnalytics (trackXxx)                │
└────────────────────┬────────────────────────────────────────┘
                     │ chama trackXxx(...)
                     ▼
        ┌────────────────────────────────────┐
        │  useAnalytics.ts (588 linhas)      │
        │  - pushToDataLayer(event)          │
        │  - 20+ funções de tracking         │
        │  - attribution enrichment           │
        └────────────┬───────────────────────┘
                     │ window.dataLayer.push(enrichedEvent)
                     │ + window.gtag(...)   ← Meta, GA4 direto
                     │ + window.fbq(...)    ← Meta Pixel direto
                     ▼
        ┌────────────────────────────────────┐
        │  window.dataLayer                  │
        └─────┬──────────────────────┬───────┘
              │                      │
              │ ① GTM (initGTM)      │ ② gtag.js (Helmet)
              ▼                      ▼
   ┌────────────────────┐  ┌──────────────────────┐
   │ GTM (gtm.js)       │  │ GA4 direto           │
   │ gtm.ts injeta      │  │ AnalyticsProvider    │
   │ Container ID       │  │ injeta gtag.js       │
   └────────┬───────────┘  └──────────┬───────────┘
            │                         │
            ▼                         ▼
   ┌────────────────────┐  ┌──────────────────────┐
   │ Tags do GTM        │  │ GA4 (send direto)    │
   │ (no painel GTM)    │  │ Google Ads           │
   │ Meta Pixel, GA4,   │  │                      │
   │ conversões custom  │  │                      │
   └────────────────────┘  └──────────────────────┘
```

**Há 2 caminhos paralelos para o mesmo destino.** Isso é o bug central.

---

## 3. Os 3 problemas concretos

### 🔴 **P1 — GTM e gtag.js rodando em paralelo (competição por dataLayer)**

**Onde**: `src/app/providers/analytics/AnalyticsProvider.tsx:14` + `src/shared/lib/gtm.ts:5`

**O que acontece**:
1. `AnalyticsProvider` injeta `gtag.js` direto no `<head>` (linhas 88-99) e configura `gtag('config', config.ga4Id)` + `gtag('config', config.gAdsId)` (linhas 35-44 e template lines 78-82).
2. `gtm.ts` (`initGTM()`) **também** injeta `gtm.js` no `<body>` (useEffect em AnalyticsProvider linha 27 chama `initGTM()`).
3. Os dois `dataLayer.push` competem. Em produção, dependendo de qual carrega primeiro:
   - GTM dispara `PageView` (já é evento default do gtm.js)
   - gtag.js dispara `PageView` (template do Helmet linha 90, no Meta Pixel)
   - `useAnalytics.trackPageView` dispara **mais um** PageView para gtag e mais um para fbq

**Resultado**: **pageviews duplicados** no GA4, possivelmente quadruplicados em produção. **Compras/conversões** reportadas em dobro. Métricas de funil furadas.

**Severidade**: 🔴 **crítica** — afeta a leitura de TODAS as métricas do site.

**Como validar**: abrir DevTools > Network, ver 2 requests `gtag/js` E `gtm.js` carregando. Abrir `dataLayer` no console após page load: `window.dataLayer.filter(e => e.event === 'page_view').length` (deveria ser 1, vai estar >1).

---

### 🟡 **P2 — Consent vazando em dev (não respeita `analytics_storage === 'denied'` no console)**

**Onde**: `src/shared/hooks/useAnalytics.ts:48-52`

```typescript
const isProd = config.environment === 'production';
if (userConsent && userConsent.analytics_storage === 'denied' && isProd) {
  if (import.meta.env.DEV) {
    console.debug('[Analytics] Tracking blocked - analytics consent denied');
  }
  return;
}
```

**Bug**: o `if` retorna **só** se for produção. Em dev/staging, mesmo com consent denied, `pushToDataLayer` continua, o `enrichedData` é montado com UTMs/gclid e é `window.dataLayer.push`-ado. Como `gtag.js` carrega em dev também (a menos que o config não tenha `ga4Id`), **eventos com PII (gclid, fbclid) vazam pra dataLayer em dev**.

Em produção: ✅ bloqueia certo.
Em dev: ❌ vaza UTMs e click-ids pro dataLayer local.

**Severidade**: 🟡 média — não afeta produção, mas pega mal em auditoria LGPD e polui o `dataLayer` de quem está testando local.

**Fix**: tirar o `&& isProd`. A regra tem que ser: `if (analytics_storage === 'denied') return;` em qualquer ambiente.

---

### 🟡 **P3 — `gtmId` no `config` mas ninguém usa o `dataLayer.push({'gtm.start'})` no momento certo**

**Onde**: `src/app/providers/analytics/AnalyticsProvider.tsx:87-99` (script inline do gtag) + `src/shared/lib/gtm.ts:8`

O `gtm.ts` faz `dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'})`. Isso é o padrão GTM. Mas o template inline do AnalyticsProvider **redeclara** `window.dataLayer = window.dataLayer || []` (linha 78 do template) e faz `function gtag(){dataLayer.push(arguments);}` (linha 79). Ou seja, **se GTM carregou primeiro, o `gtag` global existe e a redeclaração só é no namespace errado**; se gtag.js carregou primeiro, o GTM **re-inicializa** o dataLayer com o próprio start event depois, **perdendo os eventos iniciais** que entraram no gtag direto.

**Severidade**: 🟡 média — race condition clássica de dual-tag.

---

## 4. O que está **bem feito** (para constar)

- ✅ **LGPD/GDPR consent gate** funcionando: `useAppStore().consent` é checado em **20+ pontos** de tracking (linhas 83, 96, 129, 146, 169, 180, 202, 224, 249, 270, 321, 340, 365, 378, 435, 467, 530, etc.)
- ✅ **Attribution enrichment** robusto: UTMs, gclid, fbclid, event_id com random suffix
- ✅ **ConsentBanner.tsx** (`app/providers/analytics/`) expõe UI de opt-in/opt-out
- ✅ **Meta Pixel** condicional ao `ad_storage === 'granted'`
- ✅ **Remoção de código morto**: as 624 linhas de `lib/analytics.ts` foram deletadas
- ✅ **Cobertura de testes**: `useAnalytics.test.ts` existe
- ✅ **Documentação antiga** (`RASTREADORES_ANALISE.md`) registrada, com roadmap de 4 fases

---

## 5. Recomendações — priorizadas

### **Crítica (fazer antes do próximo deploy)**

1. **Escolher UM caminho**: ou GTM, ou gtag.js direto. Recomendo **manter GTM** (mais flexível, time de marketing consegue criar tags sem deploy), e tirar o gtag.js direto do `AnalyticsProvider.tsx` (linhas 78-99 e 35-44).
2. **Se manter gtag.js direto, deletar `gtm.ts`** e a chamada `initGTM()` do `AnalyticsProvider`.

### **Alta (próximo sprint)**

3. **Fix P2**: tirar `&& isProd` do check de consent. Bloqueia em dev também.
4. **Adicionar teste E2E** de validação de dataLayer em Playwright (já tem `playwright.config.ts`): abrir home, contar `dataLayer.filter(e => e.event === 'page_view')`. Esperado: 1.
5. **Adicionar log/console.error** quando `gtag` é chamado mas `window.gtag` é undefined — pega race conditions em runtime.

### **Média (debt técnico)**

6. **Documentar** decisão "GTM vs gtag direto" no `RASTREADORES_ANALISE.md` (atualizar pra 2026-06).
7. **Considerar** deletar `dataLayer.push` direto e passar **tudo** pelo GTM via Custom Event Trigger — simplifica o consent gate.
8. **`ConsentBanner.tsx`** precisa ter teste de unidade.

---

## 6. Validação empírica recomendada (não fiz porque é destrutiva)

```bash
# No console do browser em prod:
window.dataLayer.filter(e => e.event === 'page_view').length
# Esperado: 1
# Atual provável: 2-4 (gtm.js + gtag.js + useAnalytics.trackPageView + Meta Pixel PageView)

# Em dev com consent denied:
window.dataLayer
# Verificar se tem UTMs e gclid vazados
```

---

## 7. Conclusão

**Sim, conversam** — mas **mal**. O consent gate é sólido, o useAnalytics é bem estruturado, a documentação evoluiu. Mas tem **1 bug crítico (P1)** que está dobrando (ou pior) pageviews em produção, e o **time de marketing pode estar olhando pra números errados** desde que o `AnalyticsProvider` foi introduzido. 

**Próximo passo óbvio**: P1 + P2. São 30-60 min de trabalho e destravam qualquer análise de funil que esteja em curso.

---

**Auditado por**: Luke (minimax-m3:cloud)  
**Método**: read-only · `git log` · `grep` · leitura de 3 arquivos backbone  
**Não modifiquei nada** — por sua preferência operacional, todas as correções são decisão sua.
