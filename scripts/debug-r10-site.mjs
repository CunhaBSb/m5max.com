// Captura estado atual do site publico
import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

const BASE = 'http://127.0.0.1:4173';
const chromiumBin = process.env.PLAYWRIGHT_CHROMIUM ||
  `${process.env.HOME}/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome`;

const OUT = '/tmp/r10-debug';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath: chromiumBin, headless: true });

// Mobile pra ver o MobileHeader (que o Marcos mandou foto)
{
  const context = await browser.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2 });
  const page = await context.newPage();
  await page.goto(`${BASE}/`);
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/site-publico-home-mobile.png` });
  console.log('OK site-publico-home-mobile');
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto(`${BASE}/`);
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/site-publico-home-desktop.png` });
  console.log('OK site-publico-home-desktop');
  await context.close();
}

await browser.close();
console.log('\n✅ Prints em', OUT);
