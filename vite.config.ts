import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 5173,
  },
  plugins: [
    react(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // UI Components (most used)
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-accordion', '@radix-ui/react-dropdown-menu', '@radix-ui/react-popover'],
          
          // Forms (heavy but essential)
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          
          // Icons (lightweight but frequently used)  
          'icons-vendor': ['lucide-react', 'react-icons'],
          
          // Media components (lazy loaded)
          'media-vendor': ['react-youtube'],
          
          // Utilities (shared everywhere)
          'utils-vendor': ['clsx', 'tailwind-merge', 'class-variance-authority', 'date-fns'],
          
          // Modal components (on-demand loading)
          'modal-vendor': ['@radix-ui/react-select', '@radix-ui/react-checkbox'],
          
          // Advanced UI (rarely used initially)
          'advanced-ui': ['@radix-ui/react-menubar', '@radix-ui/react-context-menu', '@radix-ui/react-navigation-menu']
        },
      }
    }
  },
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, 'src/app'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      "@": path.resolve(__dirname, "./src")
    },
  },
  define: {
    __GTM_ID__: JSON.stringify(process.env.VITE_GTM_ID),
    __GA4_ID__: JSON.stringify(process.env.VITE_GA4_ID),
    __META_PIXEL_ID__: JSON.stringify(process.env.VITE_META_PIXEL_ID)
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
  },
}));
