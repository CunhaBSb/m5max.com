// Substitui tokens hard-coded do tema dark antigo pelos tokens semânticos novos
// APENAS em src/features/admin/
const fs = require('fs');
const path = require('path');

// Usando string.match em vez de regex com \[ pra evitar problemas de escape
const substitutions = [
  // bg-white com opacidade — uso .indexOf pra evitar regex
  ['bg-white/[0.01]', 'bg-app'],
  ['bg-white/[0.02]', 'bg-sunken'],
  ['bg-white/[0.03]', 'bg-sunken'],
  ['bg-white/[0.04]', 'bg-sunken'],
  ['bg-white/[0.05]', 'bg-sunken'],
  ['bg-white/[0.06]', 'bg-sunken'],
  ['bg-white/[0.08]', 'bg-sunken'],
  ['border-white/[0.02]', 'border-border-subtle'],
  ['border-white/[0.03]', 'border-border-subtle'],
  ['border-white/[0.04]', 'border-border-subtle'],
  ['border-white/[0.05]', 'border-border'],
  ['border-white/[0.06]', 'border-border'],
  ['border-white/[0.08]', 'border-border'],
  ['text-white/10', 'text-text-disabled'],
  ['text-white/20', 'text-text-disabled'],
  ['text-white/30', 'text-text-tertiary'],
  ['text-white/35', 'text-text-tertiary'],
  ['text-white/40', 'text-text-tertiary'],
  ['text-white/50', 'text-text-secondary'],
  ['text-white/55', 'text-text-secondary'],
  ['text-white/60', 'text-text-secondary'],
  ['text-white/70', 'text-text-secondary'],
  ['text-white/80', 'text-text-primary'],
  ['text-muted-foreground/10', 'text-text-disabled'],
  ['text-muted-foreground/30', 'text-text-disabled'],
  ['text-muted-foreground/40', 'text-text-tertiary'],
  ['text-muted-foreground/50', 'text-text-tertiary'],
  ['text-muted-foreground/60', 'text-text-secondary'],
  ['text-muted-foreground/70', 'text-text-secondary'],
  ['bg-zinc-900/35', 'bg-sunken'],
  ['bg-zinc-900/40', 'bg-sunken'],
  ['bg-zinc-900/55', 'bg-sunken'],
  ['bg-black/20', 'bg-sunken'],
  ['bg-black/30', 'bg-sunken'],
  ['bg-black/40', 'bg-charcoal-900/40'],
  ['bg-[#161616]', 'bg-card'],
  ['hover:bg-white/[0.1]', 'hover:bg-sunken'],
  ['hover:bg-white/10', 'hover:bg-sunken'],
  ['hover:bg-zinc-900/55', 'hover:bg-sunken'],
  ['hover:bg-zinc-900/40', 'hover:bg-sunken'],
  ['hover:text-white ', 'hover:text-text-primary '], // com espaço pra não pegar text-white-X
];

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (/\.(tsx|ts)$/.test(entry.name)) files.push(full);
  }
  return files;
}

const files = walk('/home/cunhadev/projects/m5max.com/src/features/admin');
let total = 0;
let totalSubs = 0;
for (const f of files) {
  let s = fs.readFileSync(f, 'utf8');
  let fileChanges = 0;
  for (const [search, replacement] of substitutions) {
    const before = s;
    s = s.split(search).join(replacement);
    if (s !== before) {
      const count = (before.match(new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
      fileChanges += count;
      totalSubs += count;
    }
  }
  if (fileChanges > 0) {
    fs.writeFileSync(f, s);
    total++;
    console.log(`  ${f.replace('/home/cunhadev/projects/m5max.com/', '')}: ${fileChanges} substituições`);
  }
}
console.log(`\n✅ ${total} arquivos modificados, ${totalSubs} substituições totais`);
