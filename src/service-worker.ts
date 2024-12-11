import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope;

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST);

// Cache network requests
registerRoute(
  ({ request }) => 
    request.destination === 'document' ||
    request.destination === 'script' ||
    request.destination === 'style',
  new StaleWhileRevalidate()
);