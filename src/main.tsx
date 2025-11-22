import { createRoot } from 'react-dom/client'
import App from '@/App.tsx'
import '@/index.css'
import { AppProviders } from '@/app/providers/AppProviders'
import { registerSW } from '@/shared/utils/service-worker';


createRoot(document.getElementById("root")!).render(<App />);

// Register Service Worker for offline performance
registerSW({
  onSuccess: () => {
    console.log('M5 Max app is ready for offline use');
  },
  onUpdate: () => {
    console.log('New version available! Please refresh to update.');
    // You could show a toast notification here
  },
  onError: (error) => {
    console.error('Service Worker registration failed:', error);
  }
});

