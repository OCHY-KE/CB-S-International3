/**
 * Pre-cache Utility & Service Worker Manager for CBSI Safaris
 * Provides background pre-caching of critical high-definition safari imagery,
 * route pre-fetching during idle browser cycles, and Service Worker registration.
 */

// Key expedition and luxury safari media assets to pre-cache in the background
export const CRITICAL_SAFARI_ASSETS = [
  'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1600', // Masai Mara Lion
  'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&q=80&w=1600', // African Elephant
  'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&q=80&w=1600', // Cape Buffalo
  'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&q=80&w=1600', // African Leopard
  'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&q=80&w=1600', // Black Rhino
  'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=1200', // Serengeti Plains
  'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&q=80&w=1200', // Giraffe Sunrise
  'https://res.cloudinary.com/cioghqt5/image/upload/v1786973128/cbsi1.ico'
];

/**
 * Register Service Worker for offline pre-caching and instantaneous asset delivery
 */
export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[CBSI Pre-cache] Service Worker successfully registered:', registration.scope);

          // Trigger background precache messaging
          if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
              type: 'PRECACHE_URLS',
              urls: CRITICAL_SAFARI_ASSETS
            });
          }
        })
        .catch((error) => {
          console.debug('[CBSI Pre-cache] Service Worker registration skipped or failed:', error);
        });
    });
  }
}

/**
 * Pre-caches an array of image URLs using DOM Image objects & Cache API
 */
export function precacheImages(urls = CRITICAL_SAFARI_ASSETS) {
  if (typeof window === 'undefined') return Promise.resolve([]);

  const promises = urls.map((url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve({ url, status: 'loaded' });
      img.onerror = () => resolve({ url, status: 'failed' });
    });
  });

  return Promise.all(promises);
}

/**
 * Pre-fetches lazy-loaded page route modules during idle browser cycles
 */
export function precacheLazyRoutes() {
  if (typeof window === 'undefined') return;

  const schedulePreload = () => {
    // Dynamically preload lazy route chunks during browser idle time
    const routesToPreload = [
      () => import('../pages/AboutPage'),
      () => import('../pages/ContactPage'),
      () => import('../pages/Gallery'),
      () => import('../pages/Profile'),
      () => import('../pages/UserLogin'),
      () => import('../pages/AdminLogin'),
      () => import('../pages/AdminPage'),
      () => import('../pages/AdminGallery')
    ];

    routesToPreload.forEach((preloadFn, index) => {
      setTimeout(() => {
        preloadFn()
          .then(() => {
            // Silently loaded
          })
          .catch((err) => {
            console.debug('[CBSI Pre-cache] Idle route preload skipped:', err);
          });
      }, 500 + index * 300);
    });
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(schedulePreload, { timeout: 3000 });
  } else {
    setTimeout(schedulePreload, 1500);
  }
}

/**
 * Comprehensive initializer that executes all pre-cache routines
 */
export function initAppPrecaching() {
  registerServiceWorker();
  precacheImages(CRITICAL_SAFARI_ASSETS);
  precacheLazyRoutes();
}