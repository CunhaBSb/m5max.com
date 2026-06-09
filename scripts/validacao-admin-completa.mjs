// Validação visual completa do admin com a conta secundária do Marcos
// Captura TODAS as páginas em desktop + mobile pra validação da Rodada 9

import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

const BASE = 'http://127.0.0.1:4173';
const EMAIL = 'markimcunha54@gmail.com';
const PASSWORD = '@Bolinha123';

const chromiumBin = process.env.PLAYWRIGHT_CHROMIUM ||
  `${process.env.HOME}/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome`;

const OUT_DIR = '/tmp/r9-validacao';
mkdirSync(OUT_DIR, { recursive: true });

const pages = [
  { name: 'dashboard', path: '/admin/dashboard' },
  { name: 'produtos', path: '/admin/produtos' },
  { name: 'orcamentos', path: '/admin/orcamentos' },
  { name: 'estoque', path: '/admin/estoque' },
  { name: 'eventos', path: '/admin/eventos' },
];

const browser = await chromium.launch({ executablePath: chromiumBin, headless: true });

async function loginAndCapture(viewport, suffix) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 2 });
  const page = await context.newPage();

  // Loga
  console.log(`[${suffix}] Login...`);
  await page.goto(`${BASE}/admin/login`);
  await page.evaluate(() => {
    try { localStorage.clear(); } catch {}
    try { sessionStorage.clear(); } catch {}
  });
  await page.goto(`${BASE}/admin/login`);
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.fill('input#email', EMAIL);
  await page.fill('input#password', PASSWORD);
  await Promise.all([
    page.waitForURL(/admin\/(produtos|dashboard)/, { timeout: 15000 }).catch(() => {}),
    page.click('button[type="submit"]'),
  ]);
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(1500);

  const url = page.url();
  console.log(`[${suffix}] Após login: ${url}`);

  // Verifica se usuário logou
  if (!/admin\/(produtos|dashboard)/.test(url)) {
    console.log(`[${suffix}] ❌ Não chegou no admin — provavelmente conta não é admin`);
    await page.screenshot({ path: `${OUT_DIR}/erro-${suffix}.png` });
    await context.close();
    return;
  }

  // Captura cada página
  for (const p of pages) {
    console.log(`[${suffix}] -> ${p.path}`);
    await page.goto(`${BASE}${p.path}`);
    await page.waitForLoadState('networkidle').catch(() => {});
    // Espera dados carregarem (TanStack Query)
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${OUT_DIR}/${p.name}-${suffix}.png`, fullPage: false });
    console.log(`  → ${p.name}-${suffix}.png OK`);
  }

  await context.close();
}

// Desktop
await loginAndCapture({ width: 1440, height: 900 }, 'desktop');

// Mobile
await loginAndCapture({ width: 412, height: 915 }, 'mobile');

await browser.close();
console.log('\n✅ Validação completa — prints em /tmp/r9-validacao/');
