import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import type { Plugin } from 'vite';

/** Cache the complete emitted build, including lazy chunks, media and fonts. */
export function pwaPlugin(): Plugin {
  let output = '';
  return {
    name: 'detective-offline',
    apply: 'build',
    configResolved(config) { output = config.build.outDir; },
    closeBundle() {
      const walk = (dir: string): string[] => readdirSync(dir, { withFileTypes: true })
        .flatMap(entry => entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]);
      const files = walk(output).filter(path => !path.endsWith('.map') && relative(output, path) !== 'sw.js').sort();
      const hash = createHash('sha256');
      for (const file of files) hash.update(relative(output, file)).update(readFileSync(file));
      const version = hash.digest('hex').slice(0, 16);
      const assets = files.map(file => relative(output, file).replaceAll('\\', '/'));
      writeFileSync(join(output, 'sw.js'), `
const PREFIX = 'detective-' + self.registration.scope + '|';
const CACHE = PREFIX + '${version}';
const ASSETS = ${JSON.stringify(assets)};
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(
    ASSETS.map(path => new Request(new URL(path, self.registration.scope), { cache: 'reload' }))
  )));
});
// Updates wait until all old windows close; never interrupt an active game.
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (event.request.mode === 'navigate') return (await cache.match(new URL('index.html', self.registration.scope))) || fetch(event.request);
    return (await cache.match(event.request)) || fetch(event.request);
  })());
});
`);
    },
  };
}
