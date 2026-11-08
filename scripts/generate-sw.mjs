import { createHash } from "crypto";
import { readdir, readFile, writeFile } from "fs/promises";
import path from "path";

const OUT_DIR = path.join(process.cwd(), "out");
const SKIP_EXTENSIONS = new Set([".map"]);
const SKIP_FILES = new Set(["sw.js", "404.html", "web.config", "_headers"]);

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(entry => {
      const fullPath = path.join(directory, entry.name);
      return entry.isDirectory() ? listFiles(fullPath) : Promise.resolve([fullPath]);
    }),
  );
  return files.flat();
}

function toUrl(file) {
  const relative = path.relative(OUT_DIR, file).split(path.sep).join("/");
  if (relative === "index.html") return "/";
  if (relative.endsWith("/index.html")) return `/${relative.slice(0, -"index.html".length)}`;
  return `/${relative}`;
}

function toAlias(url) {
  if (url === "/" || !url.endsWith("/")) return null;
  return url.replace(/\/$/, "");
}

const files = (await listFiles(OUT_DIR)).filter(
  file =>
    !SKIP_EXTENSIONS.has(path.extname(file)) &&
    !SKIP_FILES.has(path.basename(file)),
);

const entries = await Promise.all(
  files.map(async file => ({
    url: toUrl(file),
    contents: await readFile(file),
  })),
);

const hash = createHash("sha256");
for (const entry of entries.sort((a, b) => a.url.localeCompare(b.url))) {
  hash.update(entry.url);
  hash.update(entry.contents);
}

const cacheName = `date-converter-${hash.digest("hex").slice(0, 16)}`;
const precacheUrls = entries.map(entry => entry.url).sort();
const aliases = Object.fromEntries(
  precacheUrls.map(toAlias).filter(Boolean).map(alias => [alias, `${alias}/`]),
);

const sw = `const CACHE_NAME = ${JSON.stringify(cacheName)};
const PRECACHE_URLS = ${JSON.stringify(precacheUrls, null, 2)};
const PAGE_ALIASES = ${JSON.stringify(aliases, null, 2)};
const OFFLINE_FALLBACK = ${JSON.stringify(precacheUrls.includes("/404/") ? "/404/" : "/Conv/")};

self.addEventListener("install", event => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

async function matchNavigation(request) {
  const url = new URL(request.url);
  const exact = await caches.match(request, { ignoreSearch: true });
  if (exact) return exact;

  const alias = PAGE_ALIASES[url.pathname];
  if (alias) {
    const aliased = await caches.match(alias, { ignoreSearch: true });
    if (aliased) return aliased;
  }

  const withSlash = url.pathname.endsWith("/") ? url.pathname : url.pathname + "/";
  const slashed = await caches.match(withSlash, { ignoreSearch: true });
  if (slashed) return slashed;

  const asHtml = await caches.match(url.pathname + ".html", { ignoreSearch: true });
  if (asHtml) return asHtml;

  return null;
}

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        const cached = await matchNavigation(request);
        if (cached) return cached;

        try {
          return await fetch(request);
        } catch {
          return (await caches.match(OFFLINE_FALLBACK)) || Response.error();
        }
      })(),
    );
    return;
  }

  event.respondWith(
    (async () => {
      const cached = await caches.match(request, { ignoreSearch: true });
      if (cached) return cached;

      const response = await fetch(request);
      if (response.ok && response.type === "basic") {
        const copy = response.clone();
        event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.put(request, copy)));
      }
      return response;
    })(),
  );
});

self.addEventListener("message", event => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});
`;

await writeFile(path.join(OUT_DIR, "sw.js"), sw);
console.log(`Generated out/sw.js (${precacheUrls.length} files, cache ${cacheName})`);
