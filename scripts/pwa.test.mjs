import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';

test('production worker caches build and serves offline within a subpath', async () => {
  const handlers = {};
  const scope = 'https://example.test/game/';
  const stored = new Map();
  const deleted = [];
  let claimed = false;
  let network = 0;
  const cache = {
    async addAll(requests) {
      for (const request of requests) {
        assert.ok(existsSync(`dist/${new URL(request.url).pathname.slice(6)}`));
        stored.set(request.url, { url: request.url });
      }
    },
    async match(request) { return stored.get(typeof request === 'string' ? request : request.url ?? request.href); },
  };
  vm.runInNewContext(readFileSync('dist/sw.js', 'utf8'), {
    URL, Request,
    self: { registration: { scope }, location: { origin: 'https://example.test' },
      clients: { async claim() { claimed = true; } },
      addEventListener(type, handler) { handlers[type] = handler; } },
    caches: { async open() { return cache; }, async keys() { return [`detective-${scope}|old`, 'other-app']; },
      async delete(key) { deleted.push(key); } },
    fetch: async () => { network++; throw Error('offline'); },
  });
  let pending;
  handlers.install({ waitUntil(promise) { pending = promise; } });
  await pending;
  assert.ok(stored.has(`${scope}index.html`));
  assert.ok([...stored.keys()].some(key => key.endsWith('.js')));
  assert.ok([...stored.keys()].some(key => key.endsWith('.woff2')));
  handlers.activate({ waitUntil(promise) { pending = promise; } });
  await pending;
  assert.equal(claimed, true);
  assert.deepEqual(deleted, [`detective-${scope}|old`]);
  handlers.fetch({ request: { url: `${scope}level/2`, method: 'GET', mode: 'navigate' }, respondWith(promise) { pending = promise; } });
  assert.equal((await pending).url, `${scope}index.html`);
  const asset = [...stored.keys()].find(key => key.endsWith('.js'));
  handlers.fetch({ request: new Request(asset), respondWith(promise) { pending = promise; } });
  assert.equal((await pending).url, asset);
  assert.equal(network, 0);
  handlers.fetch({ request: new Request('https://external.test/image'), respondWith() { assert.fail('external request intercepted'); } });
});

test('manifest supplies install icons and stable scope', () => {
  const manifest = JSON.parse(readFileSync('dist/manifest.webmanifest', 'utf8'));
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.id, './');
  for (const icon of manifest.icons) assert.ok(existsSync(`dist/${icon.src}`));
  assert.ok(manifest.icons.some(icon => icon.sizes === '192x192'));
  assert.ok(manifest.icons.some(icon => icon.sizes === '512x512' && icon.purpose === 'maskable'));
});
