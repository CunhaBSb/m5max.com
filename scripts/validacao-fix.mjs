// Comparação visual: site público (deve estar idêntico ao pré-R9) + admin (deve estar com paleta nova)
import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

const BASE = 'http://127.0.0.1:4173';
const chromiumBin = process.env.PLAYWRIGHT_CHROMIUM ||
  `${process.env.HOME}/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome`;

const OUT = '/tmp/r9-fix';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath: chromiumBin, headless: true });

// Site público (desktop e mobile)
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto(`${BASE}/`);
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/site-publico-home-desktop.png` });
  console.log('OK site-publico-home-desktop');

  await page.goto(`${BASE}/produtos`);
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/site-publico-produtos-desktop.png` });
  console.log('OK site-publico-produtos-desktop');

  await context.close();
}

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

// Admin (precisaria logar — usa screenshot da tela de login que NÃO precisa de auth)
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto(`${BASE}/admin/login`);
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/admin-login-desktop.png` });
  console.log('OK admin-login-desktop');

  await page.goto(`${BASE}/admin`);
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/admin-start-desktop.png` });
  console.log('OK admin-start-desktop');
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2 });
  const page = await context.newPage();
  await page.goto(`${BASE}/admin/login`);
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/admin-login-mobile.png` });
  console.log('OK admin-login-mobile');

  await page.goto(`${BASE}/admin`);
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/admin-start-mobile.png` });
  console.log('OK admin-start-mobile');
  await context.close();
}

await browser.close();
console.log('\n✅ Prints em', OUT);
