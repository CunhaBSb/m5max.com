// Debug: descobrir por que login da conta secundária não funcionou
import { chromium } from '@playwright/test';

const BASE = 'http://127.0.0.1:4173';
const EMAIL = 'markimcunha54@gmail.com';
const PASSWORD = '@Bolinha123';

const chromiumBin = process.env.PLAYWRIGHT_CHROMIUM ||
  `${process.env.HOME}/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome`;

const browser = await chromium.launch({ executablePath: chromiumBin, headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await context.newPage();

// Captura console logs
page.on('console', (msg) => {
  console.log(`[browser ${msg.type()}]`, msg.text());
});
page.on('pageerror', (err) => {
  console.log('[pageerror]', err.message);
});

await page.goto(`${BASE}/admin/login`);
await page.evaluate(() => {
  try { localStorage.clear(); } catch {}
  try { sessionStorage.clear(); } catch {}
});
await page.goto(`${BASE}/admin/login`);
await page.waitForLoadState('networkidle').catch(() => {});
await page.waitForTimeout(500);

console.log('--- Preenchendo form ---');
await page.fill('input#email', EMAIL);
await page.fill('input#password', PASSWORD);
await page.click('button[type="submit"]');

await page.waitForTimeout(5000);

console.log('--- URL atual:', page.url());

// Tira print
await page.screenshot({ path: '/tmp/r9-debug-login.png' });

// Verifica se tem toast/erro visível
const erroText = await page.locator('text=/erro|inválid|incorreto/i').allTextContents();
console.log('--- Textos de erro visíveis:', erroText);

// Verifica network: pegou resposta 200 ou erro?
const cookies = await context.cookies();
console.log('--- Cookies:', cookies.map(c => c.name).join(', '));

await context.close();
await browser.close();
