# تبدیل تاریخ

Offline-first date converter built with Next.js (App Router, static export) and Material UI. It converts between the Jalali, Gregorian, Islamic (Umm al-Qura), Badi, Chinese, Saka and Hebrew calendars.

## Available Scripts

### `npm run dev`

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

### `npm run build`

Builds a fully static site into `out/` and generates the offline service worker (`out/sw.js`).

### `npm run preview`

Serves the exported site from `out/` with a local static server.

### `npm test`

Runs the Jest test suite.

### `npm run typecheck`

Runs the TypeScript compiler without emitting files.

## Deployment

The site is a static export, deployed as Cloudflare Workers static assets:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Assets directory: `./out` (configured in `wrangler.toml`)

`wrangler.toml` sets `not_found_handling = "404-page"`; each route is prerendered, so no SPA fallback rule is needed.

To enable canonical URLs and the sitemap, set `NEXT_PUBLIC_SITE_URL` (for example `https://example.com`) in the build environment.

## Offline support

Every build precaches the prerendered pages, JS/CSS chunks, fonts and images through a generated service worker. After the first visit the app works offline; a new deployment invalidates the old cache automatically.
