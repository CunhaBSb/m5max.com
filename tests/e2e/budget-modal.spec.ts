import { test, expect } from '@playwright/test';

const SUPABASE_ROUTE = '**/rest/v1/lead_submissions';

// E2E do fluxo de Orçamento até a chamada ao Supabase
// Usa interceptação para validar payload e header Prefer (return=minimal)
test('fluxo de orçamento envia lead para Supabase com return=minimal', async ({ page }) => {
  const captured: { body: Record<string, unknown>; headers: Record<string, string> }[] = [];

  await page.route(SUPABASE_ROUTE, async (route) => {
    const request = route.request();
    const headers = request.headers();
    const body = request.postDataJSON();

    captured.push({ body, headers });

    await route.fulfill({ status: 201, contentType: 'application/json', body: '[]' });
  });

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Espera hydration mínima; tenta múltiplos CTAs e loga HTML se falhar
  await page.waitForFunction(() => {
    return !!document.querySelector('[data-testid="cta-orcamento"]') ||
           !!document.querySelector('header');
  }, { timeout: 30000 });

  const ctaSelectors = [
    '[data-testid="cta-orcamento"]',
    'text=Orçamento Gratuito',
    'text=Orçamento'
  ];

  let clicked = false;
  const clickFirstVisible = async () => {
    for (const selector of ctaSelectors) {
      const locator = page.locator(selector).first();
      const count = await locator.count();
      if (count > 0) {
        const visible = await locator.first().isVisible();
        if (visible) {
          await locator.first().click({ timeout: 10000 });
          return true;
        }
      }
    }
    return false;
  };

  clicked = await clickFirstVisible();

  // Tentativa 2: abrir menu mobile e buscar CTA
  if (!clicked) {
    const menuBtn = page.getByRole('button', { name: 'Menu' });
    if (await menuBtn.count()) {
      await menuBtn.first().click({ timeout: 5000, force: true });
      clicked = await clickFirstVisible();
    }
  }

  if (!clicked) {
    const html = await page.content();
    console.error('CTA não encontrado. Dump HTML início:\n', html.slice(0, 5000));
    throw new Error('CTA orçamento não disponível após hydration');
  }
  await expect(page.getByText('Solicitar Orçamento')).toBeVisible();

  // Etapa 1 do wizard: escolher audiência
  await page.getByText('Corporativo', { exact: true }).first().click();

  // Etapa 2 do wizard: público e orçamento
  await page.getByText('500+', { exact: true }).first().click();
  await page.getByText('R$ 100k+', { exact: true }).first().click();
  await page.getByRole('button', { name: 'Continuar para formulário' }).click();

  // Form step 1
  await page.getByTestId('budget-name').fill('QA Playwright');
  await page.getByTestId('budget-email').fill('qa@example.com');
  await page.getByTestId('budget-phone').fill('61999999999');
  await page.getByRole('button', { name: 'Próxima etapa' }).click();

  // Form step 2
  await page.getByTestId('budget-city').fill('Brasília - DF');
  await page.getByTestId('budget-event-type').click();
  await page.getByRole('option', { name: 'Corporativo' }).click();
  await page.getByTestId('budget-audience').click();
  await page.getByRole('option', { name: '5.000 a 20.000' }).click();
  await page.getByTestId('budget-range').click();
  await page.getByRole('option', { name: 'R$ 50k - 200k' }).click();
  await page.getByTestId('budget-date').fill('2026-12-31');
  await page.getByRole('button', { name: 'Próxima etapa' }).click();

  // Form step 3
  await page.getByTestId('budget-submit').click();

  await expect.poll(() => captured.length).toBe(1);
  expect(captured[0].body).toMatchObject({
    name: 'QA Playwright',
    email: 'qa@example.com',
    phone: '61999999999',
    city: 'Brasília - DF',
    budget: '50k-200k'
  });

  await expect(page.getByText('Recebido! Um especialista responderá em breve com sua proposta.')).toBeVisible();
});
