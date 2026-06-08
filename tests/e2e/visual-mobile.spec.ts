import { test, expect } from '@playwright/test';

// Só roda em mobile (o CTA mobile é lg:hidden)
test.describe('mobile', () => {
  test.use({ viewport: { width: 412, height: 915 } });

  test('visual: mobile header com CTA orçamento', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push('PE: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('CE: ' + m.text()); });

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Verifica novo CTA mobile
  const ctaMobile = page.getByTestId('cta-orcamento-mobile');
  await expect(ctaMobile).toBeVisible();

  const box = await ctaMobile.boundingBox();
  console.log('CTA mobile box:', JSON.stringify(box));
  expect(box).not.toBeNull();
  expect(box!.width).toBeGreaterThan(40); // tem texto + ícone
  expect(box!.height).toBeGreaterThanOrEqual(40);

  // Screenshot do header
  await page.screenshot({ path: 'test-results/visual-mobile-header.png', clip: { x: 0, y: 0, width: 412, height: 80 } });

  // Verifica que clicou e modal fullscreen abriu
  await ctaMobile.click();
  await page.waitForTimeout(1500);

  const dialogInfo = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"]');
    if (!d) return null;
    const r = d.getBoundingClientRect();
    return {
      heading: d.querySelector('h2')?.innerText || null,
      top: r.top,
      left: r.left,
      width: r.width,
      height: r.height,
      fullscreen: r.top <= 1 && r.left <= 1 && r.width >= window.innerWidth * 0.95,
    };
  });
  console.log('Mobile dialog:', JSON.stringify(dialogInfo));
  expect(dialogInfo).not.toBeNull();
  expect(dialogInfo!.fullscreen).toBe(true);

  await page.screenshot({ path: 'test-results/visual-mobile-modal.png' });

  console.log('Errors:', errors.slice(0, 3).join(' | ') || 'none');
  expect(errors).toEqual([]);
  });
});
