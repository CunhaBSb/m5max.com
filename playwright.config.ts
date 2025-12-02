import { defineConfig, devices } from '@playwright/test';
import path from 'path';

const localChrome = process.env.PLAYWRIGHT_CHROMIUM ||
  path.join(process.env.HOME || '', '.cache/ms-playwright/chromium-1181/chrome-linux/chrome');

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    launchOptions: {
      executablePath: localChrome,
      args: ['--no-sandbox'],
      headless: true,
    }
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 720 } }
    }
  ],
  webServer: {
    command: 'VITE_SUPABASE_URL=http://localhost:9999 VITE_SUPABASE_ANON_KEY=dummy npm run dev -- --host --port 4173',
    reuseExistingServer: !process.env.CI,
    url: 'http://localhost:4173',
    timeout: 60_000,
  }
});
