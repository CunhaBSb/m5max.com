// Captura screenshots do admin nos 3 estados críticos
// Pra validação visual da Rodada 9
import { chromium } from '@playwright/test';

const BASE = 'http://127.0.0.1:4173';
const EMAIL = 'marcosdocunha@gmail.com';
const PASSWORD = 'M5@2025marcos';

const captures = [
  { name: 'admin-login', path: '/admin/login', viewport: { width: 1280, height: 800 } },
  { name: 'admin-start', path: '/admin', viewport: { width: 1280, height: 800 } },
];

const chromiumBin = process.env.PLAYWRIGHT_CHROMIUM ||
  `${process.env.HOME}/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome`;

const browser = await chromium.launch({ executablePath: chromiumBin, headless: true });

for (const cap of captures) {
  const context = await browser.newContext({ viewport: cap.viewport });
  const page = await context.newPage();
  console.log(`[${cap.name}] -> ${cap.path} @ ${cap.viewport.width}x${cap.viewport.height}`);

  // Limpa storage pra não pegar sessão antiga
  await page.goto(`${BASE}/admin/login`);
  await page.evaluate(() => {
    try { localStorage.clear(); } catch {}
    try { sessionStorage.clear(); } catch {}
  });

  await page.goto(`${BASE}${cap.path}`);
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(800);

  await page.screenshot({ path: `/tmp/rodada9-${cap.name}-desktop.png`, fullPage: false });
  console.log(`  → /tmp/rodada9-${cap.name}-desktop.png OK`);

  await context.close();
}

// Mobile
{
  const context = await browser.newContext({ viewport: { width: 412, height: 915 } });
  const page = await context.newPage();

  await page.goto(`${BASE}/admin/login`);
  await page.evaluate(() => {
    try { localStorage.clear(); } catch {}
    try { sessionStorage.clear(); } catch {}
  });

  await page.goto(`${BASE}/admin/login`);
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(800);
  await page.screenshot({ path: '/tmp/rodada9-admin-login-mobile.png' });
  console.log('  → /tmp/rodada9-admin-login-mobile.png OK');

  await page.goto(`${BASE}/admin`);
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(800);
  await page.screenshot({ path: '/tmp/rodada9-admin-start-mobile.png' });
  console.log('  → /tmp/rodada9-admin-start-mobile.png OK');

  await context.close();
}

await browser.close();
console.log('\n✅ Capturas concluídas');
