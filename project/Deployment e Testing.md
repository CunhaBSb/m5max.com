# Deployment e Testing - M5 Max Produções

## 1. Configuração de Deploy

### 1.1 Vercel Setup
```typescript
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/home",
      "destination": "/",
      "permanent": true
    }
  ],
  "env": {
    "VITE_GTM_ID": "@gtm_id",
    "VITE_GA4_ID": "@ga4_id",
    "VITE_META_PIXEL_ID": "@meta_pixel_id"
  }
}
```

### 1.2 Environment Variables (Vercel)
```bash
# Production
vercel env add VITE_GTM_ID production
vercel env add VITE_GA4_ID production
vercel env add VITE_META_PIXEL_ID production
vercel env add VITE_SITE_URL production
vercel env add VITE_NODE_ENV production

# Preview/Staging
vercel env add VITE_GTM_ID preview
vercel env add VITE_GA4_ID preview
vercel env add VITE_META_PIXEL_ID preview
vercel env add VITE_SITE_URL preview
vercel env add VITE_NODE_ENV preview
```

### 1.3 Build Optimization
```typescript
// vite.config.ts - Production optimizations
export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'ui': ['@radix-ui/react-dialog', '@radix-ui/react-tabs', 'lucide-react'],
          'analytics': ['gtag']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  preview: {
    port: 4173,
    host: true
  }
});
```

## 2. CI/CD Pipeline

### 2.1 GitHub Actions Workflow
```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    name: Test & Lint
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run type-check

      - name: Lint
        run: npm run lint

      - name: Format check
        run: npm run format:check

      - name: Run tests
        run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  lighthouse:
    name: Lighthouse CI
    runs-on: ubuntu-latest
    needs: test
    if: github.event_name == 'pull_request'
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_GTM_ID: ${{ secrets.VITE_GTM_ID_STAGING }}
          VITE_GA4_ID: ${{ secrets.VITE_GA4_ID_STAGING }}
          VITE_NODE_ENV: staging

      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli@0.12.x
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}

  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/develop'
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Deploy to Vercel (Preview)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          scope: ${{ secrets.VERCEL_ORG_ID }}

  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [test, lighthouse]
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Deploy to Vercel (Production)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          scope: ${{ secrets.VERCEL_ORG_ID }}

  notify:
    name: Notify Deployment
    runs-on: ubuntu-latest
    needs: [deploy-production]
    if: always()
    steps:
      - name: Notify success
        if: needs.deploy-production.result == 'success'
        run: |
          echo "✅ Production deployment successful!"
          # Add Slack/Discord notification here

      - name: Notify failure
        if: needs.deploy-production.result == 'failure'
        run: |
          echo "❌ Production deployment failed!"
          # Add Slack/Discord notification here
```

### 2.2 Lighthouse CI Configuration
```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:4173/',
        'http://localhost:4173/shows-pirotecnicos',
        'http://localhost:4173/cha-revelacao',
        'http://localhost:4173/kits'
      ],
      startServerCommand: 'npm run preview',
      startServerReadyPattern: 'Local:   http://localhost:4173',
      numberOfRuns: 3
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.85 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
        'categories:pwa': 'off'
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};
```

## 3. Testing Strategy

### 3.1 Vitest Configuration
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

### 3.2 Test Setup
```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from './mocks/server';

// Estabelecer API mocking antes de todos os testes
beforeAll(() => server.listen());

// Limpar após cada teste
afterEach(() => {
  cleanup();
  server.resetHandlers();
});

// Limpar após todos os testes
afterAll(() => server.close());

// Mock window.dataLayer para testes de analytics
Object.defineProperty(window, 'dataLayer', {
  value: [],
  writable: true
});

// Mock window.gtag
Object.defineProperty(window, 'gtag', {
  value: vi.fn(),
  writable: true
});

// Mock window.fbq (Meta Pixel)
Object.defineProperty(window, 'fbq', {
  value: vi.fn(),
  writable: true
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
```

### 3.3 Component Tests
```typescript
// src/components/__tests__/ConversionModal.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ConversionModal } from '../forms/ConversionModal';
import { useAppStore } from '@/store/appStore';

// Mock do store
vi.mock('@/store/appStore');

// Mock do useAnalytics
vi.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    trackEvent: vi.fn(),
    trackConversion: vi.fn()
  })
}));

describe('ConversionModal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAppStore as any).mockReturnValue({
      attribution: null,
      consent: { analytics_storage: 'granted' }
    });
  });

  it('should render modal when open', () => {
    render(
      <ConversionModal
        isOpen={true}
        onClose={mockOnClose}
        audience="b2b"
        source="header"
      />
    );

    expect(screen.getByText('Solicite seu Orçamento')).toBeInTheDocument();
    expect(screen.getByText('WhatsApp')).toBeInTheDocument();
    expect(screen.getByText('Formulário')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(
      <ConversionModal
        isOpen={false}
        onClose={mockOnClose}
        audience="b2b"
        source="header"
      />
    );

    expect(screen.queryByText('Solicite seu Orçamento')).not.toBeInTheDocument();
  });

  it('should track modal open event', () => {
    const trackEvent = vi.fn();
    vi.mocked(useAnalytics).mockReturnValue({
      trackEvent,
      trackConversion: vi.fn()
    });

    render(
      <ConversionModal
        isOpen={true}
        onClose={mockOnClose}
        audience="b2b"
        source="header"
      />
    );

    expect(trackEvent).toHaveBeenCalledWith('conversion_modal_open', {
      source: 'header',
      audience: 'b2b',
      page: undefined
    });
  });

  it('should show WhatsApp option when selected', async () => {
    render(
      <ConversionModal
        isOpen={true}
        onClose={mockOnClose}
        audience="cha"
        source="hero"
      />
    );

    fireEvent.click(screen.getByText('WhatsApp'));

    await waitFor(() => {
      expect(screen.getByText('Iniciar conversa')).toBeInTheDocument();
    });
  });

  it('should show form when form option selected', async () => {
    render(
      <ConversionModal
        isOpen={true}
        onClose={mockOnClose}
        audience="b2b"
        source="cta"
      />
    );

    fireEvent.click(screen.getByText('Formulário'));

    await waitFor(() => {
      expect(screen.getByText('Tipo de evento')).toBeInTheDocument();
    });
  });
});
```

### 3.4 Integration Tests
```typescript
// src/test/integration/conversion-flow.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HomePage } from '@/pages/home/HomePage';

// Mock de todas as dependências
vi.mock('@/hooks/useAnalytics');
vi.mock('@/hooks/useAttribution');
vi.mock('@/utils/whatsapp');

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Conversion Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should complete B2B conversion flow', async () => {
    const trackEvent = vi.fn();
    vi.mocked(useAnalytics).mockReturnValue({
      trackEvent,
      trackConversion: vi.fn()
    });

    renderWithRouter(<HomePage />);

    // Clicar no cartão B2B
    fireEvent.click(screen.getByText('Shows Profissionais'));

    // Aguardar navegação e clicar em CTA
    await waitFor(() => {
      expect(screen.getByText('Solicitar Orçamento')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Solicitar Orçamento'));

    // Verificar se modal abriu
    await waitFor(() => {
      expect(screen.getByText('WhatsApp')).toBeInTheDocument();
    });

    // Selecionar WhatsApp
    fireEvent.click(screen.getByText('WhatsApp'));

    // Verificar tracking
    expect(trackEvent).toHaveBeenCalledWith('conversion_modal_open', 
      expect.objectContaining({
        audience: 'b2b'
      })
    );
  });

  it('should complete Chá Revelação product selection', async () => {
    renderWithRouter(<HomePage />);

    // Clicar no cartão Chá Revelação
    fireEvent.click(screen.getByText('Chá Revelação'));

    // Aguardar carregamento da página
    await waitFor(() => {
      expect(screen.getByText('Kit Básico')).toBeInTheDocument();
    });

    // Selecionar um kit
    fireEvent.click(screen.getByText('Escolher Básico'));

    // Verificar se tracking de produto foi chamado
    const trackProductInteraction = vi.fn();
    expect(trackProductInteraction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'select',
        category: 'cha'
      })
    );
  });
});
```

### 3.5 Analytics Tests
```typescript
// src/test/analytics/gtm.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import GTMManager from '@/lib/gtm';

describe('GTM Manager', () => {
  let gtmManager: GTMManager;

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset dataLayer
    window.dataLayer = [];
    gtmManager = new GTMManager('GTM-TEST123');
  });

  it('should initialize GTM correctly', () => {
    gtmManager.init();

    expect(window.dataLayer).toContainEqual(
      expect.arrayContaining(['consent', 'default', expect.any(Object)])
    );
  });

  it('should push events to dataLayer', () => {
    gtmManager.init();
    
    const testEvent = {
      event: 'test_event',
      custom_parameter: 'test_value'
    };

    gtmManager.pushEvent(testEvent);

    expect(window.dataLayer).toContainEqual(testEvent);
  });

  it('should update consent correctly', () => {
    gtmManager.init();
    
    const consentUpdate = {
      analytics_storage: 'granted' as const,
      ad_storage: 'denied' as const
    };

    gtmManager.updateConsent(consentUpdate);

    expect(window.dataLayer).toContainEqual(
      expect.arrayContaining(['consent', 'update', consentUpdate])
    );
  });
});
```

## 4. Performance Testing

### 4.1 Bundle Analysis
```bash
# Analisar bundle size
npm run build
npx vite-bundle-analyzer

# Verificar unused dependencies
npx depcheck

# Audit de segurança
npm audit
```

### 4.2 Performance Monitoring Script
```typescript
// src/utils/performance.ts
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private observers: PerformanceObserver[] = [];

  static getInstance(): PerformanceMonitor {
    if (!this.instance) {
      this.instance = new PerformanceMonitor();
    }
    return this.instance;
  }

  init() {
    if (typeof window === 'undefined') return;

    // Core Web Vitals
    this.observeWebVitals();
    
    // Resource timing
    this.observeResourceTiming();
    
    // Long tasks
    this.observeLongTasks();
  }

  private observeWebVitals() {
    // LCP (Largest Contentful Paint)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      if (window.gtag) {
        window.gtag('event', 'LCP', {
          event_category: 'Web Vitals',
          value: Math.round(lastEntry.startTime),
          non_interaction: true
        });
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    // FID (First Input Delay)
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (window.gtag) {
          window.gtag('event', 'FID', {
            event_category: 'Web Vitals',
            value: Math.round(entry.processingStart - entry.startTime),
            non_interaction: true
          });
        }
      }
    }).observe({ type: 'first-input', buffered: true });

    // CLS (Cumulative Layout Shift)
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      
      if (window.gtag) {
        window.gtag('event', 'CLS', {
          event_category: 'Web Vitals',
          value: Math.round(clsValue * 1000),
          non_interaction: true
        });
      }
    }).observe({ type: 'layout-shift', buffered: true });
  }

  private observeResourceTiming() {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Track slow resources
        if (entry.duration > 1000) {
          if (window.gtag) {
            window.gtag('event', 'slow_resource', {
              event_category: 'Performance',
              resource_name: entry.name,
              duration: Math.round(entry.duration),
              non_interaction: true
            });
          }
        }
      }
    }).observe({ type: 'resource', buffered: true });
  }

  private observeLongTasks() {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (window.gtag) {
          window.gtag('event', 'long_task', {
            event_category: 'Performance',
            duration: Math.round(entry.duration),
            non_interaction: true
          });
        }
      }
    }).observe({ type: 'longtask', buffered: true });
  }

  // Métricas customizadas
  markFeatureLoad(featureName: string) {
    performance.mark(`${featureName}_start`);
  }

  measureFeatureLoad(featureName: string) {
    performance.mark(`${featureName}_end`);
    performance.measure(
      featureName,
      `${featureName}_start`,
      `${featureName}_end`
    );

    const measure = performance.getEntriesByName(featureName)[0];
    
    if (window.gtag && measure) {
      window.gtag('event', 'feature_load_time', {
        event_category: 'Performance',
        feature_name: featureName,
        load_time: Math.round(measure.duration),
        non_interaction: true
      });
    }
  }
}

// Inicializar monitor
if (typeof window !== 'undefined') {
  PerformanceMonitor.getInstance().init();
}
```

## 5. Quality Assurance

### 5.1 Pre-deployment Checklist
```markdown
## QA Checklist - M5 Max Website

### ✅ Funcionalidade
- [ ] Todas as rotas funcionam corretamente
- [ ] Modal de conversão abre em todos os CTAs
- [ ] Formulários validam corretamente
- [ ] WhatsApp links funcionam com UTMs
- [ ] Vídeos carregam e reproduzem
- [ ] Filtros de produtos funcionam

### ✅ Responsividade
- [ ] Mobile (320px - 768px)
- [ ] Tablet (768px - 1024px)
- [ ] Desktop (1024px+)
- [ ] Elementos não quebram em diferentes resoluções
- [ ] Touch targets ≥ 44px em mobile

### ✅ Performance
- [ ] Lighthouse Score ≥ 85 (Performance)
- [ ] Core Web Vitals aprovados
- [ ] Imagens otimizadas e lazy loading
- [ ] Bundle size < 1MB
- [ ] Tempo de carregamento < 3s

### ✅ SEO
- [ ] Meta tags em todas as páginas
- [ ] Schema markup implementado
- [ ] URLs semânticas
- [ ] Sitemap.xml gerado
- [ ] robots.txt configurado

### ✅ Analytics
- [ ] GTM carregando corretamente
- [ ] GA4 trackando page views
- [ ] Meta Pixel ativo
- [ ] Eventos customizados funcionando
- [ ] Consent banner funcionando

### ✅ Conversões
- [ ] WhatsApp links com UTM tracking
- [ ] Formulários enviando dados
- [ ] Lead scoring calculado
- [ ] Attribution preservada

### ✅ Accessibility
- [ ] Lighthouse Score ≥ 95 (Accessibility)
- [ ] Navegação por teclado
- [ ] Screen reader friendly
- [ ] Contraste adequado
- [ ] Alt text em imagens

### ✅ Security
- [ ] HTTPS ativo
- [ ] Headers de segurança configurados
- [ ] Não exposição de dados sensíveis
- [ ] Validação server-side

### ✅ LGPD Compliance
- [ ] Banner de consentimento funcionando
- [ ] Política de privacidade atualizada
- [ ] Opt-out funcionando
- [ ] Dados não coletados sem consentimento
```

### 5.2 E2E Testing com Playwright
```typescript
// tests/e2e/conversion-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Conversion Flow', () => {
  test('should complete B2B conversion via WhatsApp', async ({ page }) => {
    await page.goto('/');

    // Clicar no cartão B2B
    await page.click('text=Shows Profissionais');
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Clicar em solicitar orçamento
    await page.click('text=Solicitar Orçamento');
    
    // Verificar se modal abriu
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    // Selecionar WhatsApp
    await page.click('text=WhatsApp');
    
    // Verificar se formulário WhatsApp apareceu
    await expect(page.locator('select[name="eventType"]')).toBeVisible();
    
    // Preencher dados básicos
    await page.selectOption('select[name="eventType"]', 'reveillon');
    await page.fill('input[name="cityUF"]', 'Brasília/DF');
    await page.fill('input[name="eventDate"]', '2025-12-31');
    
    // Clicar para ir ao WhatsApp
    await page.click('text=Enviar para WhatsApp');
    
    // Verificar se nova aba foi aberta com WhatsApp
    const [whatsappPage] = await Promise.all([
      page.waitForEvent('popup'),
      page.click('text=Abrir WhatsApp')
    ]);
    
    expect(whatsappPage.url()).toContain('wa.me');
    expect(whatsappPage.url()).toContain('utm_source');
  });

  test('should track analytics events correctly', async ({ page }) => {
    // Interceptar requests de analytics
    const analyticsRequests: any[] = [];
    
    page.route('**/collect*', route => {
      analyticsRequests.push(route.request().url());
      route.continue();
    });

    await page.goto('/cha-revelacao');
    
    // Aguardar page view ser enviado
    await page.waitForTimeout(1000);
    
    // Verificar se page view foi trackado
    expect(analyticsRequests.some(url => 
      url.includes('page_view') && url.includes('cha')
    )).toBeTruthy();
    
    // Clicar em um produto
    await page.click('text=Kit Básico');
    
    // Aguardar tracking
    await page.waitForTimeout(500);
    
    // Verificar se view_item foi trackado
    expect(analyticsRequests.some(url => 
      url.includes('view_item')
    )).toBeTruthy();
  });
});
```

## 6. Monitoring e Alertas

### 6.1 Error Monitoring
```typescript
// src/utils/errorMonitoring.ts
class ErrorMonitor {
  private static instance: ErrorMonitor;
  
  static getInstance(): ErrorMonitor {
    if (!this.instance) {
      this.instance = new ErrorMonitor();
    }
    return this.instance;
  }

  init() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.logError('JavaScript Error', event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError('Unhandled Promise Rejection', event.reason);
    });

    // React error boundary fallback
    this.setupReactErrorBoundary();
  }

  private logError(type: string, error: any, context?: any) {
    const errorData = {
      type,
      message: error?.message || error,
      stack: error?.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      context
    };

    // Send to analytics
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: errorData.message,
        fatal: type === 'JavaScript Error'
      });
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('Error logged:', errorData);
    }

    // Send to external monitoring service
    this.sendToMonitoringService(errorData);
  }

  private sendToMonitoringService(errorData: any) {
    // Implement Sentry, LogRocket, or similar
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(errorData);
    }
  }

  private setupReactErrorBoundary() {
    // This would be implemented in a React Error Boundary component
  }
}

export default ErrorMonitor;
```

---

*Esta documentação de deployment e testing completa o conjunto de ferramentas necessárias para desenvolver, testar e implantar o website M5 Max Produções com qualidade profissional e monitoramento adequado.*