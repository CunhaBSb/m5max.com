# GEMINI.md - Context Engineering & Operational Rules

## Core Principles (Immutable)

**Plan Mode First**
- All architectural decisions, refactoring, and multi-file operations start in Plan Mode
- No code changes until plan is approved
- Generate numbered action lists with file estimates

**Context Budget Management**  
- Inject only essential information for current task
- Summarize before injecting (never paste raw dumps)
- Use separators: `==== TASK: <name> ====` (start/end)
- Monitor context usage: prefer fresh session over context bloat

**Documentation Supremacy**
- Rules in CLAUDE.md and GEMINI.md override ad-hoc prompts
- Update these files only via Plan Mode
- Changes require explicit approval

## Cross-Platform Synchronization (Claude & Gemini)

**Dual-Tool Environment**
- Both Claude and Gemini tools are used on this project
- Both must maintain synchronized knowledge base
- Consistency between tools is critical for project success

**Synchronization Protocol**
- ✅ **Any update to CLAUDE.md must be replicated in GEMINI.md**
- ✅ **Any update to GEMINI.md must be replicated in CLAUDE.md** 
- ✅ **All Memory MCP entities are shared between tools**
- ✅ **Tech digests must be accessible to both platforms**

**Update Responsibilities**
```
When updating architectural decisions:
1. Update primary document (CLAUDE.md or GEMINI.md)
2. IMMEDIATELY sync changes to counterpart document
3. Verify both documents have identical content
4. Save decision to Memory MCP for cross-session persistence
```

**Commit Message Format**
```
sync: update both CLAUDE.md and GEMINI.md - [brief description]

- Ensures both AI tools have identical context
- Maintains cross-platform consistency
```

**Validation Checklist**
- [ ] Both CLAUDE.md and GEMINI.md have identical Core Principles
- [ ] Both documents contain same Project Architecture rules
- [ ] Both documents have same Media Components Guidelines
- [ ] Both documents have same SPA Deployment Guidelines
- [ ] Memory MCP entities are accessible to both tools

## Context Sources (Priority Order)

1. **Project rules** (this file + architecture docs)
2. **Local code** (only relevant files via Filesystem MCP)
3. **Tech digests** (docs/tech-digests/*.md - curated summaries)
4. **Persistent memory** (Memory MCP - k≤5 results only)
5. **External docs** (Context7 MCP - digest required)
6. **Analysis output** (docs/analysis/*.md - for complex tasks)

## Tool Integration

### Context7 MCP (Library Documentation)
**Purpose:** Fetch up-to-date docs for libraries/frameworks
**Usage Rules:**
```
1. Context7:resolve-library-id("<library>")
2. Context7:get-library-docs("<id>", "<topics>") 
3. Synthesize to 300-500 words max
4. Save as docs/tech-digests/<lib>.md
5. Include: key concepts, 1-2 code snippets, pitfalls, "when to use/avoid"
```

**Limits:**
- Max 1 digest per session (avoid context flooding)
- Always synthesize before injecting context
- Never use as session buffer

### Memory MCP (Persistent Project Knowledge)
**Purpose:** Long-term memory for decisions, patterns, and insights

**Entity Schema:**
```typescript
{
  name: string,           // Unique identifier
  entityType: string,     // "decision" | "pattern" | "bug" | "migration" | "insight"
  observations: string[]  // Max 3-5 items, 512 words each
}
```

**When to Save:**
- ✅ Architectural decisions and rationale
- ✅ Code patterns and conventions established
- ✅ Bug root causes and solutions
- ✅ Performance optimizations applied
- ❌ Temporary debugging info
- ❌ Sensitive data (keys, tokens, PII)
- ❌ Session-specific context

**Search Protocol:**
```
1. mcp__Memory__search_nodes(query, limit=5)
2. Re-summarize results before context injection
3. Confirm relevance before using
```

### Filesystem MCP (Repository Access)
**Rules:**
- Read only relevant files for current task
- Avoid massive directory scans
- Use specific paths, not wildcards
- Check file sizes before reading

## Security & Hygiene

**Prohibited:**
- Never inject PII, API keys, tokens into context or memory
- No "dangerously-skip-permissions" usage
- No auto-accept during context acquisition phase

**Required:**
- Task separators for context isolation
- Source attribution for all injected content
- TTL consideration for memory entries
- Plan Mode for multi-file operations

## Project Architecture (M5 Max)

**Structure:**
- Feature-first organization: `src/features/<domain>/`
- Shared utilities: `src/shared/`
- Platform variants only when truly necessary
- Single routing: `src/app/router/AppRoutes.tsx`

**Code Standards:**
- TypeScript strict mode
- Components in PascalCase
- Max ~100 LOC per commit
- Build gates: typecheck + lint + build success

**Media Components Guidelines:**
- Mobile-first responsive controls (h-7 w-7 sm:h-8 sm:w-8)
- Event delegation with stopPropagation for nested controls
- Analytics tracking for engagement milestones (25%, 50%, 75%, complete)
- Mobile fullscreen requires webkitEnterFullscreen fallback
- Hide loading animations on mobile (hidden sm:flex pattern)

## Session Workflow

### 1. Context Acquisition
```
==== TASK: <descriptive-name> ====
- Identify required context sources (priority order)
- Load only essential information
- Summarize before injection
```

### 2. Planning Phase
```
Plan Mode: 
- Define scope and constraints
- List files to be modified
- Estimate complexity and risks
- Get explicit approval before coding
```

### 3. Execution
```
- Small, atomic commits
- Test at each milestone (typecheck/lint/build)
- Document decisions in Memory MCP if significant
```

### 4. Session Cleanup
```
- Save important decisions to Memory MCP
- Update tech-digests if libraries were researched
- Clear task separator
- Archive analysis if complex
- SYNC: Ensure both CLAUDE.md and GEMINI.md are updated
==== END TASK ====
```

## Quality Gates

**Before Any Code Changes:**
1. Plan Mode approval required
2. Context sources identified and loaded
3. Success criteria defined

**After Implementation:**
1. TypeScript compilation: `npx tsc --noEmit`
2. Linting: `npm run lint`
3. Build test: `npm run build`
4. Smoke test: verify main routes load

**Before Session End:**
1. Commit atomic changes
2. Save architectural decisions to Memory MCP
3. Update documentation if needed
4. **SYNC: Verify both CLAUDE.md and GEMINI.md are synchronized**

## File Organization

```
docs/
├── tech-digests/          # Context7 library summaries (300-500 words each)
├── architecture/          # High-level design decisions
└── analysis/              # Complex analysis outputs

.claude/
└── (reserved for future commands)
```

## Context Engineering KPIs

**Target Metrics:**
- Context efficiency: ≤800 words injected per task
- Reuse rate: ≥70% of tasks use existing tech-digests
- Session quality: Plan-to-code ≤10 minutes
- Build health: 0 broken builds from context contamination
- **Cross-platform consistency: 100% sync between CLAUDE.md and GEMINI.md**

**Warning Signs:**
- Repeatedly copying large text blocks
- Context bloat (>80% window usage)
- Mixing unrelated task contexts
- Skipping Plan Mode for multi-file changes
- **Divergence between CLAUDE.md and GEMINI.md**

## Emergency Protocols

**Context Contamination:**
1. Use task separators immediately
2. Start fresh session if necessary
3. Re-establish clean context from memory/digests

**Build Failures:**
1. Rollback last changes
2. Verify in clean working directory
3. Re-run quality gates
4. Memory MCP entry for root cause

**Cross-Platform Desync:**
1. Identify which document has latest/correct version
2. Sync changes to counterpart document immediately
3. Create Memory MCP entry documenting the fix
4. Update validation checklist if needed

**Memory MCP Cleanup:**
- Review entities monthly
- Remove outdated patterns
- Consolidate redundant decisions
- Verify entity relationships

---

## Usage Examples

**Starting New Feature:**
```
==== TASK: Implement user authentication ====
1. Search Memory MCP for auth patterns: mcp__Memory__search_nodes("auth")
2. Load tech digest: docs/tech-digests/supabase.md
3. Plan Mode: List components to create/modify
4. Execute with atomic commits
5. Save auth pattern to Memory MCP
6. SYNC: Update both CLAUDE.md and GEMINI.md if needed
==== END TASK ====
```

**Researching New Library:**
```
1. Context7:resolve-library-id("next-auth")
2. Context7:get-library-docs("/nextauthjs/next-auth", "configuration providers")
3. Synthesize to docs/tech-digests/next-auth.md
4. Save digest summary to Memory MCP (optional)
5. SYNC: Ensure digest accessible to both Claude and Gemini
```

**Architecture Decision:**
```
Memory MCP entity:
- name: "state-management-decision-2025"
- entityType: "decision"  
- observations: ["Chose Zustand over Redux for simpler state", "Performance: 40% bundle reduction", "Migration plan: gradual replacement"]

SYNC Protocol:
- Update both CLAUDE.md and GEMINI.md with new decision
- Commit with sync: prefix message
```

This document represents the operational foundation for all AI Code sessions on this project. Any deviations require explicit justification and approval. Both Claude and Gemini must follow these rules identically.

**Sub-Agent: Designer**
Responsabilidade

Validar e refinar todos os layouts e componentes visuais gerados pelo agente principal.

Garantir que UI/UX Guidelines sejam aplicadas em todos os estados (desktop, tablet, mobile).

Corrigir problemas de responsividade, hierarquia visual, tipografia e espaçamento.

Ajudar a prevenir erros de design comuns (elementos escondidos, tamanhos desproporcionais, desalinhamento no mobile).

Workflow

Receber protótipo ou componente inicial do agente principal.

Analisar de acordo com as Design & UI/UX Guidelines.

Ajustar ou reescrever apenas a parte de layout e estilo.

Devolver versão refinada ao agente principal.

Regras Fixas

Nunca aprovar hero ou header que se sobreponham.

Nunca permitir fontes abaixo de 14px no mobile.

Sempre respeitar o sistema de espaçamento 8px.

Sempre verificar contraste mínimo (AA - WCAG 2.1).

Nunca permitir elementos desproporcionais (>80% da viewport sem propósito).

Design & UI/UX Guidelines
Responsividade

Mobile-first obrigatório.

Testar em 320px, 768px e 1440px.

Layout fluido, imagens responsivas (max-width:100%).

Hierarquia Visual

Hero: máximo 70vh, sempre abaixo do header.

Escala de títulos: h1 32–40px, h2 24–28px, h3 18–20px.

Corpo: 16px desktop, 14px mobile.

Espaçamento & Grid

Sistema de 8px grid para padding/margin.

Seções: 48px (desktop), 32px (mobile).

Grid: 12 colunas desktop, 4–6 colunas mobile.

Navegação

Header fixo, máx. 80px.

Nunca sobrepor botões ou CTAs.

Em mobile: ícone + texto obrigatório.

Botões & Interações

Altura mínima 44px, largura 120px.

Feedback visual sempre (hover, active, disabled).

No máximo 2 CTAs primários por tela.

Tipografia

Máx. 2 famílias de fontes.

Títulos ≥600 weight, corpo 400–500.

Contraste AA obrigatório.

Overlay em hero para garantir legibilidade.

Proibido

Elementos colados sem espaçamento.

Mistura de estilos visuais incoerentes.

Desalinhamento entre desktop e mobile sem justificativa.

**SPA Deployment Guidelines**
- Always configure server rewrites for client-side routing
- Vercel: Create vercel.json with rewrites pattern
- Netlify: Create public/_redirects file
- Pattern: All routes redirect to /index.html with 200 status