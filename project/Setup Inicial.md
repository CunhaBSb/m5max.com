# Setup Inicial - M5 Max Produções

## 1. Configuração do Projeto

### 1.1 Inicialização
```bash
# Criar projeto com Vite
npm create vite@latest m5-max-website -- --template react-ts
cd m5-max-website

# Instalar dependências principais
npm install react-router-dom react-hook-form @hookform/resolvers zod
npm install @radix-ui/react-dialog @radix-ui/react-tabs @radix-ui/react-select
npm install lucide-react clsx tailwind-merge
npm install zustand react-helmet-async

# Instalar dependências de desenvolvimento
npm install -D @types/node @types/react @types/react-dom
npm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
npm install -D @vitejs/plugin-react autoprefixer postcss tailwindcss

# Dependências para analytics e integração
npm install gtag react-youtube
```

### 1.2 Estrutura de Pastas
```
src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   └── index.ts
│   ├── forms/
│   │   ├── ConversionModal.tsx
│   │   ├── QualificationForm.tsx
│   │   ├── B2BForm.tsx
│   │   ├── ChaForm.tsx
│   │   └── KitsForm.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Layout.tsx
│   │   └── Navigation.tsx
│   ├── analytics/
│   │   ├── PageTracker.tsx
│   │   ├── ConsentBanner.tsx
│   │   └── GTMContainer.tsx
│   └── content/
│       ├── VideoPlayer.tsx
│       ├── ProductCard.tsx
│       ├── CaseStudyCard.tsx
│       └── TestimonialCard.tsx
├── pages/
│   ├── home/
│   │   ├── HomePage.tsx
│   │   ├── HeroSection.tsx
│   │   ├── SegmentationCards.tsx
│   │   └── TrustSection.tsx
│   ├── shows-pirotecnicos/
│   │   ├── ShowsPirotecnicosPage.tsx
│   │   ├── ReveillonPage.tsx
│   │   ├── FestaJuninaPage.tsx
│   │   ├── CasamentosPage.tsx
│   │   ├── FestivaisPage.tsx
│   │   └── ClubesPage.tsx
│   ├── cha-revelacao/
│   │   ├── ChaRevelacaoPage.tsx
│   │   ├── ChaKitsPage.tsx
│   │   └── ChaSegurancaPage.tsx
│   ├── kits/
│   │   ├── KitsPage.tsx
│   │   ├── KitsReveillonPage.tsx
│   │   ├── KitsConfraternizacaoPage.tsx
│   │   └── KitsAniversarioPage.tsx
│   ├── cases/
│   │   └── CasesPage.tsx
│   ├── shared/
│   │   ├── ContatoPage.tsx
│   │   ├── SobrePage.tsx
│   │   ├── FAQPage.tsx
│   │   └── LegalPage.tsx
│   └── NotFoundPage.tsx
├── hooks/
│   ├── useAnalytics.ts
│   ├── useAttribution.ts
│   ├── useConversionModal.ts
│   ├── useConsent.ts
│   └── useWhatsApp.ts
├── utils/
│   ├── analytics.ts
│   ├── utm.ts
│   ├── whatsapp.ts
│   ├── validation.ts
│   ├── constants.ts
│   └── helpers.ts
├── types/
│   ├── analytics.ts
│   ├── forms.ts
│   ├── products.ts
│   └── common.ts
├── store/
│   ├── appStore.ts
│   ├── conversionStore.ts
│   └── analyticsStore.ts
├── data/
│   ├── products.ts
│   ├── cases.ts
│   ├── testimonials.ts
│   └── content.ts
├── assets/
│   ├── images/
│   ├── icons/
│   └── videos/
├── styles/
│   ├── globals.css
│   └── components.css
└── lib/
    ├── gtm.ts
    ├── youtube.ts
    └── schema.ts
```

### 1.3 Configuração Vite
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/store': path.resolve(__dirname, './src/store'),
      '@/data': path.resolve(__dirname, './src/data'),
      '@/assets': path.resolve(__dirname, './src/assets'),
      '@/lib': path.resolve(__dirname, './src/lib')
    }
  },
  define: {
    // Definir variáveis de ambiente para analytics
    __GTM_ID__: JSON.stringify(process.env.VITE_GTM_ID),
    __GA4_ID__: JSON.stringify(process.env.VITE_GA4_ID),
    __META_PIXEL_ID__: JSON.stringify(process.env.VITE_META_PIXEL_ID)
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          analytics: ['gtag'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-tabs', 'lucide-react']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
```

### 1.4 Configuração TailwindCSS
```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ec',
          100: '#fdedd3',
          200: '#fcd9a6',
          300: '#fac16e',
          400: '#f7a334',
          500: '#f97316', // Laranja pirotécnico principal
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407'
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b', // Cinza neutro
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617'
        },
        accent: {
          gold: '#fbbf24',    // Dourado faíscas
          red: '#dc2626',     // Vermelho explosão
          blue: '#2563eb',    // Azul chá revelação
          pink: '#ec4899'     // Rosa chá revelação
        },
        safety: {
          green: '#16a34a',   // Verde segurança
          warning: '#eab308'  // Amarelo atenção
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif']
      },
      animation: {
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'fadeInUp': 'fadeInUp 0.6s ease-out',
        'slideInRight': 'slideInRight 0.5s ease-out',
        'pulse-soft': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.1)' }
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio')
  ],
}
```

### 1.5 Configuração PostCSS
```javascript
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 1.6 Configuração TypeScript
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/pages/*": ["./src/pages/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/types/*": ["./src/types/*"],
      "@/store/*": ["./src/store/*"],
      "@/data/*": ["./src/data/*"],
      "@/assets/*": ["./src/assets/*"],
      "@/lib/*": ["./src/lib/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## 2. Variáveis de Ambiente

### 2.1 Arquivo .env.example
```bash
# Analytics IDs
VITE_GTM_ID=GTM-XXXXXXX
VITE_GA4_ID=G-XXXXXXXXXX
VITE_META_PIXEL_ID=123456789

# WhatsApp
VITE_WHATSAPP_NUMBER=556182735575

# YouTube
VITE_YOUTUBE_CHANNEL_ID=UCxxxxxxxxxxxxxxxxxx
VITE_YOUTUBE_API_KEY=AIxxxxxxxxxxxxxxxxxxxxxxxxx

# Site Configuration
VITE_SITE_URL=https://m5max.com.br
VITE_SITE_NAME=M5 Max Produções

# Contact Information
VITE_CONTACT_EMAIL=contato@m5max.com.br
VITE_CONTACT_PHONE=+556182735575

# Environment
VITE_NODE_ENV=development
```

### 2.2 Configuração de Ambientes
```typescript
// src/utils/config.ts
interface Config {
  gtmId: string;
  ga4Id: string;
  metaPixelId: string;
  whatsappNumber: string;
  youtubeChannelId: string;
  youtubeApiKey: string;
  siteUrl: string;
  siteName: string;
  contactEmail: string;
  contactPhone: string;
  environment: 'development' | 'production' | 'staging';
}

const config: Config = {
  gtmId: import.meta.env.VITE_GTM_ID || '',
  ga4Id: import.meta.env.VITE_GA4_ID || '',
  metaPixelId: import.meta.env.VITE_META_PIXEL_ID || '',
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '556182735575',
  youtubeChannelId: import.meta.env.VITE_YOUTUBE_CHANNEL_ID || '',
  youtubeApiKey: import.meta.env.VITE_YOUTUBE_API_KEY || '',
  siteUrl: import.meta.env.VITE_SITE_URL || 'https://m5max.com.br',
  siteName: import.meta.env.VITE_SITE_NAME || 'M5 Max Produções',
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || 'contato@m5max.com.br',
  contactPhone: import.meta.env.VITE_CONTACT_PHONE || '+556182735575',
  environment: (import.meta.env.VITE_NODE_ENV as Config['environment']) || 'development'
};

export default config;
```

## 3. Configurações de Linting e Formatação

### 3.1 ESLint
```json
// .eslintrc.json
{
  "env": {
    "browser": true,
    "es2020": true
  },
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "overrides": [],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "react-refresh",
    "@typescript-eslint",
    "prettier"
  ],
  "rules": {
    "react-refresh/only-export-components": [
      "warn",
      { "allowConstantExport": true }
    ],
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error",
    "no-var": "error",
    "prettier/prettier": "error"
  }
}
```

### 3.2 Prettier
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

## 4. Scripts Package.json

### 4.1 Scripts de Desenvolvimento
```json
{
  "scripts": {
    "dev": "vite --port 3000",
    "build": "tsc && vite build",
    "build:staging": "tsc && vite build --mode staging",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "clean": "rm -rf dist node_modules/.vite",
    "analyze": "npx vite-bundle-analyzer"
  }
}
```

## 5. Configuração Git

### 5.1 .gitignore
```gitignore
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Dependencies
node_modules
dist
dist-ssr
*.local

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
*.swp
*.swo
*~

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Build artifacts
*.tsbuildinfo

# Analytics & Tracking
analytics.json
gtag-debug.log
```

### 5.2 Git Hooks (Husky)
```bash
# Instalar husky
npm install -D husky lint-staged

# Configurar hooks
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
npx husky add .husky/commit-msg "npx commitlint --edit $1"
```

### 5.3 Lint-staged
```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,css,md}": [
      "prettier --write"
    ]
  }
}
```

## 6. Configuração de Desenvolvimento

### 6.1 VSCode Settings
```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

### 6.2 VSCode Extensions
```json
// .vscode/extensions.json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

## 7. Configuração Inicial do Store

### 7.1 App Store (Zustand)
```typescript
// src/store/appStore.ts
import { create } from 'zustand';
import { AttributionData, ConsentState } from '@/types/analytics';

interface AppState {
  // Attribution & Analytics
  attribution: AttributionData | null;
  consent: ConsentState;
  
  // UI State
  conversionModalOpen: boolean;
  currentAudience: 'b2b' | 'cha' | 'kits' | 'general';
  
  // Actions
  setAttribution: (data: AttributionData) => void;
  updateConsent: (consent: Partial<ConsentState>) => void;
  openConversionModal: (context: ConversionContext) => void;
  closeConversionModal: () => void;
  setCurrentAudience: (audience: 'b2b' | 'cha' | 'kits' | 'general') => void;
}

interface ConversionContext {
  source: string;
  audience: 'b2b' | 'cha' | 'kits' | 'general';
  page?: string;
  productId?: string;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  attribution: null,
  consent: {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted'
  },
  conversionModalOpen: false,
  currentAudience: 'general',

  // Actions
  setAttribution: (data) => set({ attribution: data }),
  
  updateConsent: (newConsent) => set((state) => ({
    consent: { ...state.consent, ...newConsent }
  })),
  
  openConversionModal: (context) => set({ 
    conversionModalOpen: true,
    currentAudience: context.audience 
  }),
  
  closeConversionModal: () => set({ conversionModalOpen: false }),
  
  setCurrentAudience: (audience) => set({ currentAudience: audience })
}));
```

## 8. Configuração de Constantes

### 8.1 Constantes Globais
```typescript
// src/utils/constants.ts
export const COMPANY_INFO = {
  name: 'M5 Max Produções',
  fullName: 'M5 Max Produções Pirotécnicas Ltda',
  tagline: 'Pirotecnia Profissional com Sincronização Musical',
  experienceYears: 40,
  phone: '(61) 8273-5575',
  whatsapp: '556182735575',
  email: 'contato@m5max.com.br',
  address: {
    city: 'Brasília',
    state: 'DF',
    country: 'Brasil'
  },
  social: {
    youtube: 'https://www.youtube.com/@FogosM5Max',
    instagram: '@m5maxproducoes',
    facebook: '/m5maxproducoes'
  }
};

export const UTM_SOURCES = {
  google: 'google',
  facebook: 'facebook',
  instagram: 'instagram',
  youtube: 'youtube',
  direct: 'direct',
  referral: 'referral'
} as const;

export const UTM_MEDIUMS = {
  cpc: 'cpc',
  social: 'social',
  organic: 'organic',
  email: 'email',
  referral: 'referral'
} as const;

export const AUDIENCES = {
  b2b: 'b2b',
  cha: 'cha',
  kits: 'kits',
  general: 'general'
} as const;

export const CONVERSION_SOURCES = {
  header: 'header',
  hero: 'hero',
  cta: 'cta',
  exitIntent: 'exit-intent',
  floating: 'floating',
  footer: 'footer'
} as const;

export const ANALYTICS_EVENTS = {
  // Page events
  pageView: 'page_view',
  scrollDepth50: 'scroll_depth_50',
  
  // Engagement events
  videoStart: 'video_start',
  videoProgress50: 'video_progress_50',
  videoComplete: 'video_complete',
  
  // Conversion events
  whatsappClick: 'whatsapp_click',
  leadFormStart: 'lead_form_start',
  leadFormSubmit: 'lead_form_submit',
  conversionModalOpen: 'conversion_modal_open',
  
  // Product events
  viewItem: 'view_item',
  selectItem: 'select_item',
  beginCheckout: 'begin_checkout',
  
  // B2B specific
  viewCase: 'view_case',
  requestQuote: 'request_quote',
  downloadChecklist: 'download_checklist'
} as const;

export const LEAD_SCORING = {
  budgetRanges: {
    '200k+': 30,
    '50k-200k': 20,
    '15k-50k': 10,
    '5k-15k': 5
  },
  eventDates: {
    'next-30d': 20,
    'next-90d': 15,
    'next-180d': 10,
    'future': 5
  },
  attendeesRanges: {
    '20k+': 15,
    '5k-20k': 10,
    '500-5k': 5,
    'ate-500': 2
  }
} as const;

export const SAFETY_DISCLAIMERS = {
  general: 'Produtos pirotécnicos devem ser manuseados apenas por maiores de 18 anos.',
  usage: 'Siga sempre as instruções de segurança e verifique a regulamentação local.',
  responsibility: 'A M5 Max não se responsabiliza pelo uso inadequado dos produtos.',
  full: 'Produtos pirotécnicos devem ser manuseados apenas por maiores de 18 anos. Siga sempre as instruções de segurança e verifique a regulamentação local. A M5 Max não se responsabiliza pelo uso inadequado dos produtos.'
} as const;
```

## 9. Configuração de Estilos Globais

### 9.1 CSS Global
```css
/* src/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700;800&display=swap');

@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground font-sans;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
  
  h1, h2, h3, h4, h5, h6 {
    @apply font-display;
  }
}

@layer components {
  /* Botão primário customizado */
  .btn-primary {
    @apply bg-primary-600 text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 px-6 py-3 rounded-lg font-medium transition-all duration-200;
  }
  
  /* Cards com hover effect */
  .card-hover {
    @apply transition-all duration-300 hover:shadow-xl hover:-translate-y-1;
  }
  
  /* Gradiente de marca */
  .gradient-primary {
    @apply bg-gradient-to-r from-primary-500 to-primary-600;
  }
  
  /* Efeito sparkle para elementos pirotécnicos */
  .sparkle-effect {
    @apply relative;
  }
  
  .sparkle-effect::before {
    content: '';
    @apply absolute inset-0 bg-gradient-to-r from-transparent via-accent-gold/20 to-transparent;
    animation: sparkle 2s ease-in-out infinite;
  }
  
  /* Container responsivo */
  .container-responsive {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }
  
  /* Texto com gradiente */
  .text-gradient {
    @apply bg-gradient-to-r from-primary-600 to-accent-gold bg-clip-text text-transparent;
  }
}

@layer utilities {
  /* Utilitários para animações */
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  /* Scroll suave */
  .scroll-smooth {
    scroll-behavior: smooth;
  }
  
  /* Hide scrollbar mas manter funcionalidade */
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}

/* Custom focus styles */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
}

/* Estilos para elementos de formulário */
.form-input {
  @apply w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 mb-2;
}

.form-error {
  @apply text-sm text-red-600 mt-1;
}

/* Estilos para loading states */
.loading-pulse {
  @apply animate-pulse bg-gray-200 rounded;
}

/* Estilos para badges */
.badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

.badge-success {
  @apply bg-green-100 text-green-800;
}

.badge-warning {
  @apply bg-yellow-100 text-yellow-800;
}

.badge-info {
  @apply bg-blue-100 text-blue-800;
}

.badge-error {
  @apply bg-red-100 text-red-800;
}
```

---

*Este setup inicial fornece a base completa para começar o desenvolvimento do website M5 Max Produções com todas as configurações necessárias para um projeto profissional e escalável.*