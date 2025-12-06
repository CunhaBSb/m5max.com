import { createRoot } from 'react-dom/client'
import App from '@/App.tsx'
import '@/index.css'
import { AppProviders } from '@/app/providers/AppProviders'
import { registerSW } from '@/shared/utils/service-worker';


createRoot(document.getElementById("root")!).render(<App />);

// Register Service Worker for offline performance
registerSW({
  onUpdate: () => {
    // TODO: Show toast notification for available updates
  },
  onError: (error) => {
    if (import.meta.env.DEV) {
      console.error('Service Worker registration failed:', error);
    }
  }
});

