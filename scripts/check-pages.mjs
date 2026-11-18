import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';

const expectedPages = [
  ['/', 'Nockebyhovs Båtklubb'],
  ['/klubben/', 'Klubben — Nockebyhovs Båtklubb'],
  ['/aktuellt/', 'Aktuellt — Nockebyhovs Båtklubb'],
  ['/dokument/', 'Dokument — Nockebyhovs Båtklubb'],
  ['/medlem/', 'Medlem & ansökan — Nockebyhovs Båtklubb'],
  ['/kontakt/', 'Kontakt — Nockebyhovs Båtklubb'],
];
const server = spawn(process.execPath, ['scripts/serve.mjs', '--dist'], {
  cwd: fileURLToPath(new URL('../', import.meta.url)),
  env: { ...process.env, PORT: '0' },
  stdio: ['ignore', 'pipe', 'pipe'],
});

try {
  const origin = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Preview server did not start')), 5000);
    server.stdout.on('data', data => {
      const match = String(data).match(/http:\/\/localhost:\d+/);
      if (match) { clearTimeout(timeout); resolve(match[0]); }
    });
    server.once('error', error => { clearTimeout(timeout); reject(error); });
    server.stderr.on('data', data => { clearTimeout(timeout); reject(new Error(String(data))); });
  });
  for (const [path, title] of expectedPages) {
    const response = await fetch(origin + path);
    assert.equal(response.status, 200, path + ': direct navigation failed');
    const html = await response.text();
    assert(html.includes(`<title>${title.replaceAll('&', '&amp;')}</title>`), path + ': wrong page metadata');
    const navigation = html.match(/<nav class="header-navigation"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
    assert(navigation, path + ': missing navigation');
    const links = [...navigation.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
    assert.deepEqual(links, expectedPages.map(([p]) => p), path + ': every page must be in the menu');
    const head = await fetch(origin + path, { method: 'HEAD' });
    assert.equal(head.status, 200);
    assert.equal(await head.text(), '');
  }
  for (const [oldPath, nextPath] of [['/kontakt.html', '/kontakt/'], ['/Dokument.html', '/dokument/'], ['/medlem.html', '/medlem/'], ['/klubben', '/klubben/']]) {
    const response = await fetch(origin + oldPath + '?test=1', { redirect: 'manual' });
    assert.equal(response.status, 308, oldPath + ': missing redirect');
    assert.equal(response.headers.get('location'), nextPath + '?test=1', 'Redirect must preserve query parameters');
  }
  for (const asset of ['/app.js', '/routes.js', '/styles.css', '/assets/documents.json']) {
    assert.equal((await fetch(origin + asset)).status, 200, asset + ': missing shared asset');
  }
  assert.equal((await fetch(origin + '/finns-inte/')).status, 404);
  console.log('Verified all 6 built pages over HTTP, complete menus, direct URLs, redirects and shared assets.');
} finally {
  const closed = once(server, 'close');
  server.kill();
  await closed;
}
