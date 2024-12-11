// src/serviceWorkerRegistration.ts
type Config = {
    onSuccess?: (registration: ServiceWorkerRegistration) => void;
    onUpdate?: (registration: ServiceWorkerRegistration) => void;
  };
  
  export function register(config?: Config) {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      // Safely handle potential undefined PUBLIC_URL
      const publicUrl = process.env.PUBLIC_URL 
        ? new URL(process.env.PUBLIC_URL, window.location.href) 
        : undefined;
  
      // Prevent registration if public URL is undefined or has different origin
      if (!publicUrl || publicUrl.origin !== window.location.origin) {
        return;
      }
  
      window.addEventListener('load', () => {
        const swUrl = `${process.env.PUBLIC_URL || ''}/service-worker.js`;
        registerValidSW(swUrl, config);
      });
    }
  };
  
  function registerValidSW(swUrl: string, config?: Config) {
    navigator.serviceWorker
      .register(swUrl)
      .then(registration => {
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker == null) {
            return;
          }
          
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New content is available, notify user
                console.log('New content is available and will be used when all tabs are closed.');
  
                // Execute onUpdate callback if provided
                if (config && config.onUpdate) {
                  config.onUpdate(registration);
                }
              } else {
                // Everything is precached
                console.log('Content is cached for offline use.');
  
                // Execute onSuccess callback if provided
                if (config && config.onSuccess) {
                  config.onSuccess(registration);
                }
              }
            }
          };
        };
      })
      .catch(error => {
        console.error('Error during service worker registration:', error);
      });
  }
  
  export function unregister() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then(registration => {
          registration.unregister();
        })
        .catch(error => {
          console.error(error.message);
        });
    }
  }