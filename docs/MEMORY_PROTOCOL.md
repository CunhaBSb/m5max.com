# MEMORY PROTOCOL - M5 MAX

> **Purpose**: Anti-hallucination system for maintaining accurate, source-referenced knowledge and preventing knowledge drift across development sessions.

## PROTOCOL OVERVIEW

### Core Principle: Zero Speculation Policy
**Rule**: Every architectural claim must be backed by source code reference (`file:line`) or be marked as `UNKNOWN → TODO`. No speculation, assumptions, or hallucinations allowed.

### Memory Categories
1. **Stable Memory**: Architectural facts with no expiration
2. **Ephemeral Memory**: Session-specific decisions with TTL
3. **Derived Memory**: Computed facts with dependencies
4. **Validation Memory**: Verification checkpoints and procedures

## SOURCE REFERENCE SYSTEM

### Reference Format Standard
```
file:line - Specific line reference
file:line-range - Multiple line reference  
file:section - General section reference
directory/* - Directory pattern reference
UNKNOWN → TODO - Unverified claim requiring investigation
```

### Example Reference Patterns
```typescript
// Good: Specific source references
"Platform detection uses 1024px breakpoint - src/shared/hooks/useIsDesktop.ts:3"
"Form validation uses Zod schemas - src/shared/types/forms.ts:4-19"
"Bundle splitting uses 7 chunks - vite.config.ts:17-41"

// Bad: Unsourced claims
"The application uses responsive design" // HOW do we know this?
"Forms are validated client-side" // WHERE is this implemented?
"Performance is optimized" // WHAT specific optimizations?
```

## STABLE MEMORY ARCHITECTURE

### 1. Domain Invariants (No TTL)
**Purpose**: Core business rules that rarely change

#### Technology Stack Facts
```json
{
  "key": "tech_stack_core",
  "facts": {
    "react_version": "18.3.1",
    "typescript_version": "5.8.3",
    "vite_version": "5.4.19",
    "zustand_version": "5.0.8"
  },
  "source": "package.json:54,90,92,69",
  "last_verified": "2025-09-01",
  "category": "dependencies"
}
```

#### Architecture Patterns
```json
{
  "key": "bifurcated_architecture",
  "facts": {
    "pattern": "Desktop/Mobile component separation",
    "breakpoint": "1024px",
    "detection_hook": "useIsDesktop",
    "implementation": "Separate desktop/ and mobile/ directories"
  },
  "source": "src/shared/hooks/useIsDesktop.ts:3, src/features/*/desktop/, src/features/*/mobile/",
  "category": "architecture",
  "dependencies": ["platform_detection", "responsive_design"]
}
```

#### Build Configuration
```json
{
  "key": "manual_chunk_strategy",
  "facts": {
    "total_chunks": 7,
    "critical_path": ["react-vendor", "ui-vendor", "utils-vendor", "icons-vendor"],
    "on_demand": ["form-vendor", "modal-vendor", "media-vendor", "advanced-ui"],
    "rationale": "Performance optimization for loading priority"
  },
  "source": "vite.config.ts:17-41",
  "category": "build_optimization"
}
```

### 2. Component Inventory (No TTL)
**Purpose**: Complete catalog of available components with interfaces

#### UI Component Registry
```json
{
  "key": "ui_components_catalog",
  "facts": {
    "total_components": 45,
    "tested_components": 1,
    "test_coverage": "2%",
    "variant_system": "class-variance-authority",
    "base_library": "Radix UI + shadcn/ui"
  },
  "source": "src/shared/ui/*, src/shared/ui/button.test.tsx:1-35",
  "category": "components",
  "last_audit": "2025-09-01"
}
```

#### Form System Inventory
```json
{
  "key": "form_validation_system",
  "facts": {
    "schema_library": "Zod",
    "form_library": "React Hook Form",
    "schemas": ["B2BFormSchema"],
    "validation_language": "Portuguese",
    "lead_scoring": "Budget + Attendees + Date proximity + Company bonus"
  },
  "source": "src/shared/types/forms.ts:4-19, src/shared/modal/QualificationForm.tsx:32-69",
  "category": "forms"
}
```

### 3. State Management Facts (No TTL)
**Purpose**: State architecture and patterns

```json
{
  "key": "zustand_store_structure",
  "facts": {
    "store_pattern": "Single global store with persistence",
    "persistence_key": "m5max-storage",
    "state_categories": ["attribution", "consent", "ui_state"],
    "actions": ["setAttribution", "updateConsent", "openConversionModal", "closeConversionModal"],
    "selective_persistence": true
  },
  "source": "src/shared/store/appStore.ts:24-65",
  "category": "state_management"
}
```

## EPHEMERAL MEMORY SYSTEM

### Session-Specific Memory (7-day TTL)
**Purpose**: Current development context and decisions

#### Current Development Session
```json
{
  "key": "context_audit_session_2025-09-01",
  "facts": {
    "session_type": "Context Engineering Audit",
    "documents_created": [
      "CONTEXT_MAP.md",
      "ARCHITECTURE_ATLAS.md", 
      "DEVELOPMENT_PLAYBOOKS.md",
      "COMPONENT_REGISTRY.md",
      "STATE_MANAGEMENT.md",
      "FORM_VALIDATION.md",
      "TEST_COVERAGE_ANALYSIS.md",
      "BUILD_PERFORMANCE.md",
      "MEMORY_PROTOCOL.md"
    ],
    "coverage_achieved": "Comprehensive architectural documentation",
    "gaps_identified": "Testing coverage (2.5%), some form patterns"
  },
  "source": "docs/ directory creation",
  "category": "development_session",
  "expires": "2025-09-08",
  "ttl": 604800
}
```

#### Recent Architectural Discoveries
```json
{
  "key": "recent_discoveries_2025-09-01",
  "facts": {
    "lazy_loading_pattern": "All page components use React.lazy() + Suspense",
    "testing_gaps": "121 files total, only 3 test files (2.5% coverage)",
    "performance_optimizations": "7-chunk manual splitting strategy",
    "form_lead_scoring": "Sophisticated scoring algorithm with budget/size/timing factors"
  },
  "source": "Multiple file analysis during audit",
  "category": "discovery",
  "expires": "2025-09-08"
}
```

## DERIVED MEMORY SYSTEM

### Computed Facts with Dependencies
**Purpose**: Facts computed from stable memory that need recomputation when dependencies change

#### Test Coverage Metrics
```json
{
  "key": "test_coverage_computed",
  "facts": {
    "total_files": 121,
    "test_files": 3,
    "coverage_percentage": 2.5,
    "priority_gaps": ["forms", "state_management", "page_components"],
    "effort_estimate": "16-20 hours for critical coverage"
  },
  "source": "Computed from src/**/*.{ts,tsx} glob + test file analysis",
  "dependencies": ["file_inventory", "test_file_count"],
  "category": "metrics",
  "last_computed": "2025-09-01"
}
```

#### Bundle Analysis
```json
{
  "key": "bundle_analysis_computed", 
  "facts": {
    "critical_path_size": "~167KB gzipped",
    "on_demand_chunks": "~85KB total",
    "lazy_loading_savings": "~60% initial bundle reduction",
    "performance_impact": "~40% TTI improvement estimated"
  },
  "source": "Computed from vite.config.ts:17-41 + typical chunk sizes",
  "dependencies": ["chunk_strategy", "component_inventory"],
  "category": "performance"
}
```

## VALIDATION MEMORY SYSTEM

### Verification Checkpoints
**Purpose**: Regular validation procedures to prevent knowledge drift

#### File Existence Verification
```json
{
  "key": "critical_file_verification",
  "procedure": {
    "frequency": "Before major claims",
    "files_to_verify": [
      "src/shared/store/appStore.ts",
      "src/shared/types/forms.ts", 
      "src/shared/hooks/useIsDesktop.ts",
      "vite.config.ts",
      "package.json"
    ],
    "verification_method": "Read tool before making claims"
  },
  "last_verified": "2025-09-01",
  "category": "validation"
}
```

#### Cross-Reference Validation
```json
{
  "key": "cross_reference_validation",
  "procedure": {
    "description": "Verify claims across multiple sources",
    "examples": [
      "Package versions: package.json + import statements",
      "Component usage: Registry + actual imports", 
      "Test coverage: Test files + component files",
      "Build config: vite.config.ts + actual bundle analysis"
    ]
  },
  "category": "validation"
}
```

## ANTI-HALLUCINATION PROCEDURES

### 1. Pre-Claim Verification

#### Verification Checklist
- [ ] Can I point to exact source file and line?
- [ ] Have I verified this file exists recently?
- [ ] Is this derived from multiple verified sources?
- [ ] Could this claim be outdated or changed?
- [ ] Am I making assumptions about implementation?

#### Example Verification Flow
```typescript
// BEFORE claiming: "The app uses Zustand for state management"
// 1. Verify: Read package.json for zustand dependency
// 2. Verify: Read src/shared/store/appStore.ts for implementation
// 3. Verify: Grep for useAppStore usage in components
// 4. THEN claim: "Uses Zustand 5.0.8 (package.json:69) with store at appStore.ts:24-65"
```

### 2. Source Citation Requirements

#### Mandatory Citation Format
```
Every claim must follow this pattern:
"[CLAIM] - [FILE]:[LINE/RANGE]"

Examples:
✅ "Platform detection uses 1024px breakpoint - useIsDesktop.ts:3"
✅ "Forms use Zod validation - forms.ts:4-19"
✅ "Bundle splits into 7 chunks - vite.config.ts:17-41"

❌ "The app is responsive" (no source)
❌ "Forms are validated" (no implementation reference)
❌ "Performance is optimized" (vague and unsourced)
```

### 3. Uncertainty Handling

#### UNKNOWN Classification System
```
UNKNOWN → TODO: [Claim] - Requires investigation in [likely location]

Examples:
"UNKNOWN → TODO: Error handling patterns - Check error boundaries in app/"
"UNKNOWN → TODO: Analytics implementation - Check app/providers/analytics/"  
"UNKNOWN → TODO: SEO configuration - Check public/index.html and helmet usage"
```

#### Speculation Prevention
```
Replace speculation with investigation:

❌ "Probably uses standard React patterns"
✅ "UNKNOWN → TODO: Component patterns - Need to examine feature components"

❌ "Should have error handling"  
✅ "UNKNOWN → TODO: Error handling - Check for ErrorBoundary components"

❌ "Likely follows best practices"
✅ "UNKNOWN → TODO: Code quality - Review linting config and patterns"
```

## MEMORY UPDATE PROCEDURES

### 1. Regular Verification Cycles

#### Daily Verification (Development Sessions)
- Verify critical files still exist before major claims
- Cross-check package.json for version updates
- Validate recent changes haven't broken documented patterns

#### Weekly Verification  
- Re-scan file structure for new components/patterns
- Update computed metrics (test coverage, bundle analysis)
- Verify external dependencies haven't changed

#### Monthly Verification
- Complete re-audit of architecture documentation
- Update stable memory with confirmed changes
- Purge outdated ephemeral memory

### 2. Change Detection System

#### File Change Monitoring
```json
{
  "key": "change_detection_system",
  "procedure": {
    "trigger_files": [
      "package.json - Dependency changes",
      "vite.config.ts - Build configuration changes",
      "src/shared/store/* - State management changes",
      "src/shared/types/* - Type definition changes"
    ],
    "action": "Flag for memory update when these files change"
  },
  "category": "maintenance"
}
```

#### Invalidation Rules
```json
{
  "key": "memory_invalidation_rules",
  "rules": [
    "If package.json changes, invalidate dependency facts",
    "If vite.config.ts changes, invalidate build facts", 
    "If store files change, invalidate state management facts",
    "If new test files added, recompute coverage metrics"
  ],
  "category": "maintenance"
}
```

## KNOWLEDGE QUALITY ASSURANCE

### 1. Accuracy Metrics

#### Verification Score System
```
Level 1: Source-Referenced (90-100%)
- Direct file reference with line numbers
- Recently verified (within session)
- Cross-validated from multiple sources

Level 2: Derived but Validated (70-89%)  
- Computed from verified sources
- Dependencies are source-referenced
- Logical derivation is sound

Level 3: Inferred but Uncertain (50-69%)
- Based on patterns but not directly verified
- Should be marked as UNKNOWN → TODO
- Requires investigation for certainty

Level 4: Speculation (0-49%)
- Not allowed in memory protocol
- Must be rejected or marked for investigation
```

### 2. Quality Control Checklist

#### Before Adding to Memory
- [ ] Source file exists and was recently read
- [ ] Line references are accurate
- [ ] Cross-references validate the claim
- [ ] Dependencies are documented
- [ ] Expiration/TTL is appropriate
- [ ] Category is correctly assigned

#### Before Making Claims
- [ ] Memory exists for this topic
- [ ] Memory is within TTL (if applicable)
- [ ] Source references are current
- [ ] No contradicting information found
- [ ] Uncertainty is appropriately flagged

## EMERGENCY PROCEDURES

### Knowledge Corruption Detection
```json
{
  "key": "corruption_detection",
  "symptoms": [
    "Claims without source references",
    "Contradicting information from different sources",
    "Outdated version numbers or configurations",
    "Speculation presented as fact"
  ],
  "response": "Stop all claims, re-verify from primary sources, update memory"
}
```

### Memory Reset Protocol
```json
{
  "key": "memory_reset_protocol",
  "triggers": [
    "Major codebase changes detected",
    "Persistent contradictions found", 
    "Memory corruption detected",
    "Long gap in session continuity"
  ],
  "procedure": "Clear ephemeral memory, re-verify stable memory, rebuild derived facts"
}
```

## INTEGRATION WITH DEVELOPMENT WORKFLOW

### Documentation Maintenance
- Every new architectural decision must be added to appropriate documentation
- Source references must be updated when files change
- Memory must be validated before major development recommendations

### Code Review Integration  
- PRs that change architecture files should trigger memory updates
- Documentation updates should accompany structural changes
- Memory protocol compliance should be part of code review

### Development Session Protocol
1. **Session Start**: Verify critical memory facts
2. **During Session**: Reference memory before making claims
3. **Session End**: Update ephemeral memory with new discoveries
4. **Between Sessions**: Validate stable memory integrity

This memory protocol ensures that all architectural knowledge remains accurate, source-referenced, and verified, preventing hallucinations and maintaining reliable development assistance across sessions.