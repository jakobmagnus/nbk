import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { pages, legacyPaths } from '../routes.js';
import { pageHTML } from './page-html.mjs';
await rm(new URL('../dist/', import.meta.url), { recursive: true, force: true });
await mkdir(new URL('../dist/', import.meta.url), { recursive: true });
for (const file of ['app.js', 'routes.js', 'styles.css', 'assets']) {
  await cp(new URL('../' + file, import.meta.url), new URL('../dist/' + file, import.meta.url), { recursive: true });
}
const template = await readFile(new URL('../index.html', import.meta.url), 'utf8');
for (const page of pages) {
  const directory = new URL('../dist' + page.path, import.meta.url);
  await mkdir(directory, { recursive: true });
  await writeFile(new URL('index.html', directory), pageHTML(template, page));
}
// Preserve links from the old website without requiring host rewrite rules.
for (const [oldPath, newPath] of Object.entries(legacyPaths)) {
  await writeFile(new URL('../dist' + oldPath, import.meta.url), `<!doctype html><html lang="sv"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Nockebyhovs Båtklubb</title><meta http-equiv="refresh" content="0;url=${newPath}"><a href="${newPath}">Fortsätt till Nockebyhovs Båtklubb</a></html>`);
}
console.log(`Built ${pages.length} separate pages in dist/`);
