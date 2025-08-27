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
        manualChunks: undefined,
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/pages": path.resolve(__dirname, "./src/pages"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
      "@/types": path.resolve(__dirname, "./src/types"),
      "@/store": path.resolve(__dirname, "./src/store"),
      "@/data": path.resolve(__dirname, "./src/data"),
      "@/assets": path.resolve(__dirname, "./src/assets"),
      "@/lib": path.resolve(__dirname, "./src/lib"),
      "@/app": path.resolve(__dirname, "./src/app")
    },
  },
  define: {
    __GTM_ID__: JSON.stringify(process.env.VITE_GTM_ID),
    __GA4_ID__: JSON.stringify(process.env.VITE_GA4_ID),
    __META_PIXEL_ID__: JSON.stringify(process.env.VITE_META_PIXEL_ID)
  },
}));
