// Service Worker Registration and Management
// Optimized for M5 Max performance
import React from 'react';

interface ServiceWorkerConfig {
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
}

class ServiceWorkerManager {
  private static instance: ServiceWorkerManager;
  private registration: ServiceWorkerRegistration | null = null;
  private updateAvailable = false;

  static getInstance(): ServiceWorkerManager {
    if (!ServiceWorkerManager.instance) {
      ServiceWorkerManager.instance = new ServiceWorkerManager();
    }
    return ServiceWorkerManager.instance;
  }

  async register(config: ServiceWorkerConfig = {}): Promise<void> {
    // Only register in production and if supported
    if (process.env.NODE_ENV !== 'production') {
      console.log('[SW] Service Worker disabled in development');
      return;
    }

    if (!('serviceWorker' in navigator)) {
      console.log('[SW] Service Worker not supported');
      return;
    }

    try {
      console.log('[SW] Registering Service Worker...');
      
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none' // Always check for updates
      });

      this.registration = registration;

      // Handle different registration states
      if (registration.installing) {
        console.log('[SW] Service Worker installing...');
        this.trackInstalling(registration.installing, config);
      } else if (registration.waiting) {
        console.log('[SW] Service Worker waiting...');
        this.updateAvailable = true;
        config.onUpdate?.(registration);
      } else if (registration.active) {
        console.log('[SW] Service Worker active');
        config.onSuccess?.(registration);
      }

      // Listen for updates
      registration.addEventListener('updatefound', () => {
        console.log('[SW] Service Worker update found...');
        const newWorker = registration.installing;
        if (newWorker) {
          this.trackInstalling(newWorker, config);
        }
      });

      // Check for updates periodically
      this.scheduleUpdateCheck();

    } catch (error) {
      console.error('[SW] Service Worker registration failed:', error);
      config.onError?.(error as Error);
    }
  }

  private trackInstalling(worker: ServiceWorker, config: ServiceWorkerConfig): void {
    worker.addEventListener('statechange', () => {
      if (worker.state === 'installed') {
        if (navigator.serviceWorker.controller) {
          // New content available
          console.log('[SW] New content available');
          this.updateAvailable = true;
          config.onUpdate?.(this.registration!);
        } else {
          // Content cached for first time
          console.log('[SW] Content cached for offline use');
          config.onSuccess?.(this.registration!);
        }
      }
    });
  }

  async skipWaiting(): Promise<void> {
    if (this.registration?.waiting) {
      console.log('[SW] Skipping waiting...');
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }

  async update(): Promise<void> {
    if (this.registration) {
      console.log('[SW] Checking for updates...');
      await this.registration.update();
    }
  }

  private scheduleUpdateCheck(): void {
    // Check for updates every 30 minutes
    setInterval(() => {
      this.update();
    }, 30 * 60 * 1000);
  }

  isUpdateAvailable(): boolean {
    return this.updateAvailable;
  }

  getRegistration(): ServiceWorkerRegistration | null {
    return this.registration;
  }

  // Utility methods for cache management
  async clearCache(cacheNames?: string[]): Promise<void> {
    if (!('caches' in window)) return;

    const names = cacheNames || await caches.keys();
    await Promise.all(
      names.map(name => caches.delete(name))
    );
    console.log('[SW] Cache cleared');
  }

  async getCacheSize(): Promise<{ name: string; size: number }[]> {
    if (!('caches' in window)) return [];

    const cacheNames = await caches.keys();
    const sizes = await Promise.all(
      cacheNames.map(async (name) => {
        const cache = await caches.open(name);
        const keys = await cache.keys();
        let size = 0;
        
        for (const key of keys) {
          const response = await cache.match(key);
          if (response) {
            const blob = await response.blob();
            size += blob.size;
          }
        }
        
        return { name, size };
      })
    );

    return sizes;
  }
}

// React hook for Service Worker
export function useServiceWorker(config: ServiceWorkerConfig = {}) {
  const [isInstalled, setIsInstalled] = React.useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = React.useState(false);
  const [isInstalling, setIsInstalling] = React.useState(false);
  const swManager = ServiceWorkerManager.getInstance();

  React.useEffect(() => {
    const enhancedConfig: ServiceWorkerConfig = {
      ...config,
      onSuccess: (registration) => {
        setIsInstalled(true);
        setIsInstalling(false);
        config.onSuccess?.(registration);
      },
      onUpdate: (registration) => {
        setIsUpdateAvailable(true);
        setIsInstalling(false);
        config.onUpdate?.(registration);
      },
      onError: (error) => {
        setIsInstalling(false);
        config.onError?.(error);
      }
    };

    setIsInstalling(true);
    swManager.register(enhancedConfig);
  }, [config, swManager]);

  const skipWaiting = React.useCallback(() => {
    swManager.skipWaiting();
    setIsUpdateAvailable(false);
  }, [swManager]);

  const checkForUpdate = React.useCallback(() => {
    swManager.update();
  }, [swManager]);

  return {
    isInstalled,
    isUpdateAvailable,
    isInstalling,
    skipWaiting,
    checkForUpdate,
    swManager
  };
}

// Export the singleton instance
export const serviceWorkerManager = ServiceWorkerManager.getInstance();

// Simple registration function for basic use
export async function registerSW(config?: ServiceWorkerConfig): Promise<void> {
  return serviceWorkerManager.register(config);
}

export default ServiceWorkerManager;