import { chromium } from '@playwright/test';

const BASE = 'http://127.0.0.1:4173';
const chromiumBin = process.env.PLAYWRIGHT_CHROMIUM ||
  `${process.env.HOME}/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome`;

const browser = await chromium.launch({ executablePath: chromiumBin, headless: true });

// Mobile full
{
  const context = await browser.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2 });
  const page = await context.newPage();
  await page.goto(`${BASE}/admin`);
  await page.evaluate(() => { try { localStorage.clear(); } catch {} });
  await page.goto(`${BASE}/admin`);
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/tmp/rodada9-start-mobile-2x.png' });
  console.log('OK mobile 2x');

  await page.goto(`${BASE}/admin/login`);
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/tmp/rodada9-login-mobile-2x.png' });
  console.log('OK login mobile 2x');

  await context.close();
}

await browser.close();
