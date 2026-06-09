// Captura o estado atual do admin/login e admin pra ver o que tá quebrado
import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

const BASE = 'http://127.0.0.1:4173';
const chromiumBin = process.env.PLAYWRIGHT_CHROMIUM ||
  `${process.env.HOME}/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome`;

const OUT = '/tmp/r10-debug';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath: chromiumBin, headless: true });

{
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', e => errors.push(`PAGE: ${e.message}`));

  await page.goto(`${BASE}/admin/login`);
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/admin-login-atual.png`, fullPage: true });
  console.log('OK admin-login-atual');

  if (errors.length) {
    console.log('ERROS NO CONSOLE:');
    errors.forEach(e => console.log('  -', e));
  } else {
    console.log('Sem erros no console');
  }

  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2 });
  const page = await context.newPage();
  await page.goto(`${BASE}/admin/login`);
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/admin-login-mobile-atual.png`, fullPage: true });
  console.log('OK admin-login-mobile-atual');
  await context.close();
}

await browser.close();
console.log('\n✅ Prints em', OUT);
