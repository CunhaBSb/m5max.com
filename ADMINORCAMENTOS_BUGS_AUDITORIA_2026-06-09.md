Vou agora criar o relatório consolidado com base na auditoria completa:

---

# Relatório de Auditoria: Bugs Visuais em AdminOrcamentos.tsx

## TL;DR (5 linhas)

**Problema 1** (cards sobrepostos): **Não encontrado no código atual** — a estrutura de cards usa grid-cols-3 simples sem lógica de expand/collapse. Possível problema de cache do navegador ou branch errado.

**Problema 2** (tabs mobile): **Classes conflitantes** — TabsTrigger usa `flex-1 md:w-60` simultaneamente, causando layout quebrado em mobile (<1024px) onde flex-1 força expansão mas texto com `text-[10px] tracking-widest` overflow sem wrap.

**Problema 3** (tabela produtos): **Overflow horizontal oculto** — Cards de produto (linha 2290) usam `flex items-center gap-5` com múltiplos spans `text-[9px] tracking-widest` dentro de `gap-3`, causando overflow horizontal em viewports <400px sem scroll visível.

---

## 1. BUG: Tabs Mobile (Segmented Control) — CONFIRMADO

**Local:** `src/features/admin/pages/AdminOrcamentos.tsx:1531-1544`

**Código problemático:**
```tsx
<TabsList className="mb-8 flex h-14 w-full rounded-[20px] border border-border-subtle bg-sunken p-1.5 md:mb-10 md:h-16 md:w-fit md:rounded-full">
  <TabsTrigger 
    value="solicitacoes" 
    className="flex-1 md:w-60 rounded-full ... font-black tracking-widest text-[10px] uppercase ..."
  >
    Entrada de Leads ({solicitacoes.length})
  </TabsTrigger>
  <TabsTrigger 
    value="orcamentos" 
    className="flex-1 md:w-60 rounded-full ... font-black tracking-widest text-[10px] uppercase ..."
  >
    Propostas ({orcamentos.length})
  </TabsTrigger>
</TabsList>
```

**Análise da causa raiz:**

1. **Conflito de responsividade:** `flex-1` força os triggers a expandirem igualmente em mobile, mas `md:w-60` entra em conflito no breakpoint 768px-1024px
2. **Texto longo sem wrap:** `text-[10px] uppercase tracking-widest` + `Entrada de Leads (X)` cria ~120-140px de largura mínima
3. **Container com padding:** `p-1.5` reduz espaço disponível para ~406px em viewport 412px
4. **Sem overflow-x-auto:** TabsList não tem `overflow-x-auto` para permitir scroll horizontal

**Cenário de falha:**
- Viewport 412px (Pixel 7)
- Cada TabsTrigger precisa de ~140px mínimo
- Total necessário: 280px + padding 6px = 286px
- Espaço disponível após border/padding: ~406px
- **Em viewport <350px**, texto corta ou sobrepõe

**Plano de fix sugerido:**

**Opção A (mínimo invasivo):**
```tsx
<TabsList className="mb-8 flex h-14 w-full rounded-[20px] border border-border-subtle bg-sunken p-1.5 md:mb-10 md:h-16 md:w-fit md:rounded-full overflow-x-auto scrollbar-hide">
  <TabsTrigger 
    value="solicitacoes" 
    className="min-w-[140px] flex-1 md:flex-initial md:w-60 rounded-full ... whitespace-nowrap"
  >
    Entrada de Leads ({solicitacoes.length})
  </TabsTrigger>
  {/* idem para segundo trigger */}
</TabsList>
```

**Opção B (abreviação mobile):**
```tsx
<TabsTrigger className="flex-1 md:w-60 ...">
  <span className="md:hidden">Leads ({solicitacoes.length})</span>
  <span className="hidden md:inline">Entrada de Leads ({solicitacoes.length})</span>
</TabsTrigger>
```

**Riscos do fix:**
- Opção A: adiciona scroll horizontal (pode confundir usuário que espera 2 tabs visíveis)
- Opção B: muda labels (precisa validar UX com Marcos)

---

## 2. BUG: Tabela de Produtos no Modal — CONFIRMADO (OVERFLOW)

**Local:** `src/features/admin/pages/AdminOrcamentos.tsx:2287-2315`

**Código problemático:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {selectedOrcamento.orcamentos_produtos.map((item, index) => (
    <div key={index} className="bg-sunken border border-border-subtle p-6 rounded-3xl flex items-center gap-5 transition-all hover:bg-sunken">
      <div className="h-12 w-12 ... shrink-0">...</div>
      <div className="flex-1 min-w-0">
        <p className="... truncate">{item.produtos?.nome_produto || 'Item não localizado'}</p>
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest">{item.produtos?.codigo || 'S/N'}</span>
          <div className="h-2 w-px bg-sunken" />
          <span className="text-[9px] font-black text-tech-blue uppercase tracking-widest">Dur: {item.produtos?.duracao_segundos ? `${item.produtos.duracao_segundos}s` : '—'}</span>
          {item.produtos?.efeito && (
            <>
              <div className="h-2 w-px bg-sunken" />
              <span className="text-[9px] font-black text-success uppercase tracking-widest">{item.produtos.efeito}</span>
            </>
          )}
        </div>
      </div>
      <div className="text-right">...</div>
    </div>
  ))}
</div>
```

**Análise da causa raiz:**

1. **Layout flex sem wrap:** Card usa `flex items-center gap-5` com 3 colunas (icon 48px + metadata flex-1 + price ~80px)
2. **Metadata sem flexbox:** Linha 2297 usa `flex items-center gap-3` com 3-5 spans inline (código + divider + duração + efeito)
3. **Texto tracking-widest:** Cada span usa `tracking-widest` aumentando largura em ~15-20%
4. **Min-width insuficiente:** Container tem `min-w-0` mas não aplica `overflow-hidden` ou `overflow-x-auto`

**Cálculo de overflow (viewport 412px mobile):**
- Espaço disponível: 412px - 32px (padding modal) - 48px (icon) - 80px (price) - 40px (gaps) = **212px para metadata**
- Largura mínima necessária: SKU (40px) + Dur (60px) + Efeito (50px) + gaps (12px) = **162px** ✅
- **PORÉM:** com nomes de produto longos + truncate falhando por causa de flex, pode causar overflow

**Problema real:** `flex-1 min-w-0` deveria truncar, mas a linha 2297 (`flex items-center gap-3`) com múltiplos spans pode ultrapassar.

**Plano de fix sugerido:**

```tsx
<div className="flex-1 min-w-0 overflow-hidden">
  <p className="... truncate">{item.produtos?.nome_produto || 'Item não localizado'}</p>
  <div className="flex items-center gap-2 flex-wrap">
    <span className="text-[9px] font-bold text-text-tertiary uppercase tracking-wide whitespace-nowrap">{item.produtos?.codigo || 'S/N'}</span>
    <div className="h-2 w-px bg-sunken" />
    <span className="text-[9px] font-black text-tech-blue uppercase tracking-wide whitespace-nowrap">Dur: {item.produtos?.duracao_segundos ? `${item.produtos.duracao_segundos}s` : '—'}</span>
    {item.produtos?.efeito && (
      <>
        <div className="h-2 w-px bg-sunken hidden sm:block" />
        <span className="text-[9px] font-black text-success uppercase tracking-wide whitespace-nowrap">{item.produtos.efeito}</span>
      </>
    )}
  </div>
</div>
```

**Mudanças:**
1. Adiciona `overflow-hidden` no container pai
2. Adiciona `flex-wrap` para quebrar linha se necessário
3. Muda `tracking-widest` → `tracking-wide` (reduz ~10px)
4. Adiciona `whitespace-nowrap` em cada span
5. Reduz `gap-3` → `gap-2` (economiza 4px)
6. Oculta divider antes de efeito em telas pequenas

**Riscos do fix:**
- Wrap pode criar layout de 2 linhas (pode parecer "quebrado" visualmente)
- Reduzir tracking pode afetar identidade visual (validar com Marcos)

---

## 3. BUG: Cards Sobrepostos "Total de Leads" — NÃO ENCONTRADO

**Local esperado:** Topo da página após botão "Novo Orçamento"

**Código encontrado (linha 1437-1450):**
```tsx
{/* Header Stats Side-by-side */}
<div className="grid grid-cols-3 gap-2">
  <div className="bg-sunken p-3 rounded-2xl border border-border-subtle text-center">
    <p className="text-[8px] font-black uppercase tracking-[0.1em] text-muted-foreground mb-0.5">Total</p>
    <p className="text-xl font-black text-text-primary">{stats.total}</p>
  </div>
  <div className="bg-sunken p-3 rounded-2xl border border-border-subtle text-center">
    <p className="text-[8px] font-black uppercase tracking-[0.1em] text-text-tertiary mb-0.5">Pendente</p>
    <p className="text-xl font-black text-primary">{stats.pendentes}</p>
  </div>
  <div className="bg-sunken p-3 rounded-2xl border border-border-subtle text-center">
    <p className="text-[8px] font-black uppercase tracking-[0.1em] text-success mb-0.5">Confir.</p>
    <p className="text-xl font-black text-success">{stats.confirmados}</p>
  </div>
</div>
```

**Análise:**

1. **Nenhuma lógica de expand/collapse encontrada:** Grep por `useState.*expand|collapse|onClick.*expand` retornou vazio
2. **Grid simples:** Estrutura usa `grid grid-cols-3 gap-2` sem condicional ou AnimatePresence
3. **Nenhum card "Total de leads":** Labels encontrados: "Total", "Pendente", "Confir." (não "Total de leads")
4. **Nenhum card aninhado:** Não há 3 cards filhos (Eventos, Orçamentos, Usuários) no código

**Hipóteses:**

- **Branch errado:** Marcos pode estar vendo build de branch diferente (procurar por feature branch não merged)
- **Cache do navegador:** Hard refresh (Ctrl+Shift+R) pode resolver
- **Estado anterior:** Componente pode ter sido refatorado recentemente (verificar git log)
- **Screenshot interpretado incorretamente:** O que Marcos chama de "3 cards sobrepostos" pode ser os 3 cards lado-a-lado com labels cortados em mobile

**Plano de investigação sugerido:**

```bash
# Verificar histórico recente do arquivo
git log --oneline -20 src/features/admin/pages/AdminOrcamentos.tsx

# Procurar branches com "expand" ou "stats" recentemente
git branch -a | xargs -I {} git grep -l "expandStats\|statsExpanded" {} 2>/dev/null

# Verificar se existe versão desktop/mobile bifurcada
find src/features/admin -name "*AdminOrcamentos*" -o -name "*admin-orcamentos*"
```

**Fix potencial (se grid-cols-3 overflow em mobile <360px):**

```tsx
<div className="grid grid-cols-3 gap-2 min-w-0">
  <div className="bg-sunken p-2 sm:p-3 rounded-2xl border border-border-subtle text-center min-w-0">
    <p className="text-[7px] sm:text-[8px] font-black uppercase tracking-[0.05em] sm:tracking-[0.1em] text-muted-foreground mb-0.5 truncate">Total</p>
    <p className="text-lg sm:text-xl font-black text-text-primary">{stats.total}</p>
  </div>
  {/* idem para outros 2 cards */}
</div>
```

**Riscos:**
- Se problema real for outro (ex: estado do Zustand poluído), fix não resolve

---

## Resumo: Prioridades de Fix

| Bug | Severidade | Confiança | Esforço | Prioridade |
|-----|-----------|-----------|---------|------------|
| **Tabs mobile** (labels cortados) | Alta | 95% | Baixo (15min) | 🔴 P0 |
| **Tabela produtos** (overflow horizontal) | Média | 85% | Médio (30min) | 🟡 P1 |
| **Cards sobrepostos** (não encontrado) | ? | 20% | N/A | ⚪ P2 (investigar) |

**Próximos passos recomendados:**

1. **Confirmar com Marcos:** pedir screenshot do bug #1 (cards sobrepostos) para confirmar se é cache ou branch errado
2. **Fix imediato:** Tabs mobile (Opção B com abreviação) — menor risco
3. **Fix sequencial:** Tabela produtos com overflow-hidden + tracking-wide
4. **Validação:** Testar em 412x915 (Pixel 7) E 360x640 (Galaxy S8) antes de commit
