# 📚 Memory.json - Guia de Manutenção

> **Sistema RAG de Documentação**: Guia completo para manter o `memory.json` atualizado e eficiente para LLMs e equipes de desenvolvimento.

## 🎯 O que é o memory.json?

O `memory.json` é um **sistema de documentação RAG (Retrieval-Augmented Generation)** que serve como **fonte única de verdade** para a arquitetura completa do projeto M5 Max.

### Propósito:
- **Onboarding rápido** de novos desenvolvedores e equipes
- **Contexto para LLMs** (Claude, GPT, etc.) em desenvolvimento assistido por IA
- **Referência centralizada** de toda arquitetura, padrões e convenções
- **Queryable knowledge base** para consultas programáticas

### Formato:
- **Estrutura hierárquica JSON** (não Q&A)
- **Referências de arquivo** com caminhos completos
- **Metadados versionados** para rastreamento de evolução
- **Organizado por categorias** funcionais

---

## 🔄 Quando Atualizar

### ✅ SEMPRE atualizar quando:

1. **Arquitetura**:
   - Mudança no padrão bifurcado (breakpoint, hooks de detecção)
   - Novos padrões de lazy loading
   - Alterações em estratégias de otimização

2. **Features**:
   - Nova feature adicionada (`src/features/nova-feature/`)
   - Feature removida ou renomeada
   - Mudança em rotas principais
   - Alteração em estrutura de arquivos de features

3. **Shared Infrastructure**:
   - Novo hook criado (`src/shared/hooks/`)
   - Hook removido ou renomeado
   - Mudança na store Zustand (`appStore.ts`)
   - Novos componentes UI significativos
   - Mudanças em utilities críticas

4. **Tech Stack**:
   - Atualização de versão major de dependências principais
   - Adição de nova biblioteca core (state management, UI framework, etc.)
   - Mudança de build tool ou compiler
   - Nova integração externa

5. **Integrações**:
   - Novos eventos de analytics
   - Mudanças em schemas de formulários
   - Alterações em lead scoring
   - Nova tabela Supabase ou mudança em cache strategy

6. **Desenvolvimento**:
   - Novos comandos npm scripts importantes
   - Mudança em convenções de código
   - Novas variáveis de ambiente obrigatórias
   - Alteração em aliases de import

### ⚠️ Considerar atualizar quando:

- Cobertura de testes aumentar significativamente (>10%)
- Mudanças importantes em build config (chunks, otimizações)
- Adição de novos padrões de desenvolvimento
- Descoberta de informações arquiteturais não documentadas

### ❌ NÃO precisa atualizar para:

- Mudanças de conteúdo (textos, imagens)
- Pequenos bug fixes que não afetam arquitetura
- Atualizações de versão patch de dependências
- Refactorings internos sem mudança de API

---

## 📋 Estrutura do memory.json

### Anatomia do Arquivo:

```json
{
  "metadata": {
    // Informações do projeto, versão, estatísticas
    "version": "2.0.0",           // Incrementar em mudanças significativas
    "generated_at": "YYYY-MM-DDTHH:mm:ssZ",
    "codebase_stats": { ... }     // Atualizar counts de arquivos
  },

  "architecture": {
    // Padrões arquiteturais (bifurcated, lazy loading)
    "pattern": "bifurcated",
    "implementation": { ... }     // Hooks, componentes, breakpoints
  },

  "tech_stack": {
    // Versões de frameworks, libraries, tools
    "framework_version": "18.3.1",
    "state_management": { ... }
  },

  "features": [
    // Array de features com rotas, arquivos, seções
    {
      "id": "home",
      "route": "/",
      "files": { ... }            // Paths para page, containers, components
    }
  ],

  "shared": {
    "hooks": [ ... ],             // Array de hooks com responsabilidades
    "store": { ... },             // Zustand store config
    "ui_components": { ... }      // Catálogo de componentes
  },

  "integrations": {
    "analytics": { ... },         // GA4, Meta Pixel, GTM
    "supabase": { ... },          // Tabelas, cache
    "forms": { ... }              // Schemas, lead scoring
  },

  "patterns": {
    // Padrões de desenvolvimento estabelecidos
  },

  "development": {
    "commands": { ... },          // npm scripts importantes
    "conventions": { ... },       // Naming, imports
    "testing": { ... }            // Framework, coverage
  },

  "quick_reference": {
    // Shortcuts para tarefas comuns
    "env_vars_required": [ ... ],
    "key_files": { ... },
    "common_tasks": { ... }
  }
}
```

### Princípios de Estruturação:

1. **Hierarquia lógica**: Organize por domínio funcional
2. **File references**: Sempre inclua `"file": "caminho/completo.ts"`
3. **Metadados ricos**: Adicione line numbers quando relevante
4. **Arrays para coleções**: Use arrays para listas de itens similares
5. **Descrições concisas**: Explique "o quê" e "por quê", não "como" (código faz isso)

---

## 🛠️ Como Atualizar

### Processo Passo a Passo:

#### 1. **Preparação**
```bash
# Abrir o arquivo
code docs/memory.json

# Verificar versão atual
cat docs/memory.json | grep '"version"'
```

#### 2. **Identificar Mudanças**
- Revise commits recentes: `git log --oneline -10`
- Identifique arquivos modificados: `git diff main --name-only`
- Liste novos arquivos: `git status --short`

#### 3. **Atualizar Metadata**
```json
{
  "metadata": {
    "version": "2.1.0",  // Incrementar (major.minor.patch)
    "generated_at": "2025-02-12T14:30:00Z",  // Timestamp atual
    "codebase_stats": {
      "total_files": 165,  // Contar: find src -type f | wc -l
      "features": 4,       // Contar: ls -d src/features/*/ | wc -l
      "shared_hooks": 9,   // Contar: ls src/shared/hooks/*.ts | wc -l
      "ui_components": 46,
      "test_coverage_percent": 5.2  // Atualizar se mudou
    }
  }
}
```

#### 4. **Atualizar Seções Afetadas**

**Exemplo 1: Novo Hook**
```json
{
  "shared": {
    "hooks": [
      // ... hooks existentes
      {
        "name": "useNewHook",
        "file": "src/shared/hooks/useNewHook.ts",
        "responsibility": "Descrição clara da responsabilidade",
        "key_methods": ["method1", "method2"]  // Se aplicável
      }
    ]
  }
}
```

**Exemplo 2: Nova Feature**
```json
{
  "features": [
    // ... features existentes
    {
      "id": "nova-feature",
      "name": "Nova Feature",
      "route": "/nova-feature",
      "description": "Descrição clara do propósito da feature",
      "category": "categoria-apropriada",
      "files": {
        "page": "src/features/nova-feature/pages/NovaFeaturePage.tsx",
        "desktop_container": "src/features/nova-feature/desktop/NovaFeature.tsx",
        "mobile_container": "src/features/nova-feature/mobile/NovaFeature.tsx"
      },
      "sections": ["Section1", "Section2"]
    }
  ]
}
```

**Exemplo 3: Atualização de Versão de Dependência**
```json
{
  "tech_stack": {
    "framework": "React",
    "framework_version": "18.3.2",  // Atualizar versão
    "language_version": "5.9.0"     // Atualizar TypeScript
  }
}
```

#### 5. **Validação**

**Validação de Sintaxe JSON:**
```bash
# Validar sintaxe
cat docs/memory.json | python3 -m json.tool > /dev/null && echo "✓ JSON válido" || echo "✗ JSON inválido"

# Formatar (se necessário)
python3 -m json.tool docs/memory.json > docs/memory_formatted.json && mv docs/memory_formatted.json docs/memory.json
```

**Validação de Conteúdo:**
- [ ] Todos os `"file"` paths existem?
- [ ] Versões de dependências estão corretas? (`package.json`)
- [ ] Counts de arquivos estão atualizados?
- [ ] Novas features têm todos os campos obrigatórios?
- [ ] Hooks novos estão em `src/shared/hooks/index.ts`?

#### 6. **Commit**

```bash
# Adicionar arquivo
git add docs/memory.json

# Commit com mensagem descritiva
git commit -m "docs(memory): Update to v2.1.0 - Add useNewHook and stats

- Added useNewHook to shared hooks
- Updated codebase stats (165 files, 9 hooks)
- Updated test coverage to 5.2%

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## 🎯 Versionamento

### Schema de Versionamento: `MAJOR.MINOR.PATCH`

**MAJOR** (2.x.x → 3.0.0):
- Mudança completa de estrutura do JSON
- Reescrita arquitetural do projeto
- Breaking changes em padrões fundamentais

**MINOR** (2.0.x → 2.1.0):
- Nova feature adicionada
- Novo hook ou componente significativo
- Mudança em tech stack (nova lib core)
- Atualização major de dependência principal

**PATCH** (2.0.0 → 2.0.1):
- Correções de informações incorretas
- Atualização de estatísticas (file counts, coverage)
- Pequenas melhorias de descrições
- Atualização de versões patch de dependências

### Exemplos:

```
v2.0.0 → v2.1.0: Adicionado feature "produtos" + 3 novos hooks
v2.1.0 → v2.1.1: Corrigido path de arquivo incorreto
v2.1.1 → v2.2.0: React 18.3.1 → 18.4.0, novo sistema de analytics
v2.2.0 → v3.0.0: Migração de Zustand para Redux (breaking change)
```

---

## ✅ Checklist de Atualização

### Antes de Commitar:

- [ ] **Metadata atualizado**
  - [ ] `version` incrementado apropriadamente
  - [ ] `generated_at` com timestamp atual
  - [ ] `codebase_stats` reflete estado atual

- [ ] **Mudanças documentadas**
  - [ ] Todas as novas features listadas
  - [ ] Hooks novos adicionados a `shared.hooks`
  - [ ] Componentes significativos catalogados
  - [ ] Tech stack versions atualizadas

- [ ] **Validação**
  - [ ] JSON syntax válida (python3 -m json.tool)
  - [ ] File paths existem (`ls` para verificar)
  - [ ] Nenhum placeholder (`TODO`, `xxx`, etc.)

- [ ] **Qualidade**
  - [ ] Descrições claras e concisas
  - [ ] Sem duplicatas
  - [ ] Organização lógica mantida

- [ ] **Git**
  - [ ] Commit message descritivo
  - [ ] Incluir co-author Claude se gerado por IA

---

## 🚀 Ferramentas e Automação

### Scripts Úteis:

**Contar arquivos:**
```bash
# Total de arquivos
find src -type f | wc -l

# Features
ls -d src/features/*/ | wc -l

# Hooks
ls src/shared/hooks/*.ts | grep -v index.ts | wc -l

# Componentes UI
ls src/shared/ui/*.tsx | wc -l
```

**Verificar versões:**
```bash
# React version
cat package.json | grep '"react"'

# TypeScript version
cat package.json | grep '"typescript"'

# Todas as dependências principais
cat package.json | jq '.dependencies'
```

**Validar paths:**
```bash
# Extrair todos os file paths do memory.json e verificar
cat docs/memory.json | grep '"file":' | sed 's/.*"file": "\(.*\)".*/\1/' | while read path; do
  [ -f "$path" ] || echo "❌ Missing: $path"
done
```

### Possíveis Melhorias Futuras:

1. **Script de validação automática** (`scripts/validate-memory.js`)
2. **Pre-commit hook** para validar memory.json
3. **CI/CD check** para garantir sincronização
4. **Geração automática de stats** via script
5. **Diff tool** para comparar versões

---

## 📖 Boas Práticas

### ✅ DO:

1. **Mantenha sincronizado com código**
   - Atualizar memory.json no mesmo PR que muda arquitetura
   - Incluir atualização em Definition of Done

2. **Seja preciso e verificável**
   - Teste file paths antes de commitar
   - Verifique versões em `package.json`
   - Use comandos para contar arquivos, não estime

3. **Descrições úteis**
   - Explique *propósito*, não *implementação*
   - Foque em "por que existe" e "quando usar"
   - Mantenha conciso (1-2 linhas)

4. **Organize logicamente**
   - Agrupe itens relacionados
   - Use ordem alfabética para listas longas
   - Mantenha hierarquia consistente

5. **Versionamento semântico**
   - Siga MAJOR.MINOR.PATCH rigorosamente
   - Documente breaking changes em MAJOR bumps
   - Atualize `generated_at` em toda mudança

### ❌ DON'T:

1. **Não adicione informação não verificada**
   - Sem suposições ou "provavelmente"
   - Sem TODOs ou placeholders
   - Sem informação desatualizada

2. **Não seja excessivamente detalhado**
   - Não copie código inteiro
   - Não documente implementações internas
   - Evite redundância com código

3. **Não negligencie validação**
   - Nunca commit sem validar JSON
   - Sempre teste file paths
   - Revise antes de commitar

4. **Não ignore mudanças significativas**
   - Toda nova feature deve ser documentada
   - Mudanças em tech stack são críticas
   - Hooks e componentes importantes não podem ficar fora

---

## 🔍 Casos de Uso Comuns

### Cenário 1: Adicionada Nova Feature "Galeria"

**Mudanças necessárias:**

1. **Metadata**: Incrementar `features` count
2. **Features array**: Adicionar entrada completa
3. **Version**: 2.1.0 → 2.2.0 (MINOR bump)

```json
{
  "metadata": {
    "version": "2.2.0",
    "codebase_stats": {
      "features": 5  // Was 4
    }
  },
  "features": [
    {
      "id": "galeria",
      "name": "Galeria",
      "route": "/galeria",
      "description": "Galeria de fotos e vídeos de eventos anteriores",
      "category": "marketing",
      "files": {
        "page": "src/features/galeria/pages/GaleriaPage.tsx",
        "desktop_container": "src/features/galeria/desktop/Galeria.tsx",
        "mobile_container": "src/features/galeria/mobile/Galeria.tsx"
      },
      "sections": ["GalleryGrid", "VideoShowcase", "ClientTestimonials"]
    }
  ]
}
```

### Cenário 2: Criado Hook useScrollProgress

**Mudanças necessárias:**

1. **Metadata**: Incrementar `shared_hooks` count
2. **Shared.hooks**: Adicionar entrada
3. **Version**: 2.1.0 → 2.1.1 (PATCH, hook não é feature-level)

```json
{
  "metadata": {
    "version": "2.1.1",
    "codebase_stats": {
      "shared_hooks": 9  // Was 8
    }
  },
  "shared": {
    "hooks": [
      {
        "name": "useScrollProgress",
        "file": "src/shared/hooks/useScrollProgress.ts",
        "responsibility": "Track scroll position and progress for analytics and UI"
      }
    ]
  }
}
```

### Cenário 3: React 18.3.1 → 19.0.0

**Mudanças necessárias:**

1. **Tech stack**: Atualizar version
2. **Version**: 2.1.0 → 2.2.0 (MINOR, major dependency update)
3. **Possível**: Atualizar patterns se React 19 trouxe novos

```json
{
  "metadata": {
    "version": "2.2.0"
  },
  "tech_stack": {
    "framework": "React",
    "framework_version": "19.0.0"  // Was 18.3.1
  }
}
```

### Cenário 4: Cobertura de Testes 2.5% → 45%

**Mudanças necessárias:**

1. **Metadata**: Atualizar stats
2. **Development.testing**: Atualizar coverage
3. **Version**: 2.1.0 → 2.1.1 (PATCH, stat update)

```json
{
  "metadata": {
    "version": "2.1.1",
    "codebase_stats": {
      "test_coverage_percent": 45,  // Was 2.5
      "tested_files": 68  // Was 7
    }
  },
  "development": {
    "testing": {
      "framework": "Vitest",
      "coverage_percent": 45
    }
  }
}
```

---

## 🆘 Troubleshooting

### Problema: JSON Inválido

**Sintomas:**
```bash
$ cat docs/memory.json | python3 -m json.tool
Expecting ',' delimiter: line 42 column 5 (char 1234)
```

**Solução:**
1. Verificar vírgulas ausentes ou extras
2. Verificar aspas não fechadas
3. Usar VSCode com JSON validation
4. Copiar para [jsonlint.com](https://jsonlint.com) para debug visual

### Problema: File Path Não Existe

**Sintomas:**
Path documentado não existe no filesystem

**Solução:**
1. Verificar se arquivo foi movido/renomeado
2. Atualizar path no memory.json
3. Rodar script de validação de paths
4. Verificar se feature foi removida (remover entrada)

### Problema: Versão Desatualizada

**Sintomas:**
`package.json` mostra React 18.3.2 mas `memory.json` mostra 18.3.1

**Solução:**
1. Sincronizar com `package.json`
2. Atualizar `tech_stack.framework_version`
3. Incrementar version para 2.1.1 (PATCH)
4. Commitar sincronização

### Problema: Stats Incorretos

**Sintomas:**
`codebase_stats.total_files: 159` mas contagem real é 172

**Solução:**
```bash
# Recontagem completa
echo "Total files: $(find src -type f | wc -l)"
echo "Features: $(ls -d src/features/*/ 2>/dev/null | wc -l)"
echo "Hooks: $(ls src/shared/hooks/*.ts 2>/dev/null | grep -v index | wc -l)"
echo "UI Components: $(ls src/shared/ui/*.tsx 2>/dev/null | wc -l)"

# Atualizar memory.json com valores corretos
```

---

## 📞 Contato e Suporte

**Mantenedores:**
- Time de Desenvolvimento M5 Max
- Claude Code (AI Assistant para atualizações via LLM)

**Processo de Revisão:**
- Toda atualização de memory.json deve passar por code review
- Validação automática em PR (se implementada)
- Aprovação de tech lead para MAJOR version bumps

**Recursos:**
- Este guia: `docs/MEMORY_MAINTENANCE.md`
- Arquivo principal: `docs/memory.json`
- Histórico: `git log docs/memory.json`

---

**Última atualização deste guia:** 2025-02-12
**Versão do guia:** 1.0.0
**Autor:** Claude Code
