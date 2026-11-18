import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
await rm(new URL('../dist/', import.meta.url), { recursive: true, force: true });
await mkdir(new URL('../dist/', import.meta.url), { recursive: true });
for (const file of ['index.html', 'app.js', 'styles.css', 'assets']) {
  await cp(new URL('../' + file, import.meta.url), new URL('../dist/' + file, import.meta.url), { recursive: true });
}
// Preserve bookmarks to the original website's pages on static hosting.
for (const [file, hash] of Object.entries({ 'kontakt.html': 'kontakt', 'Dokument.html': 'dokument', 'medlem.html': 'medlem' })) {
  await writeFile(new URL('../dist/' + file, import.meta.url), `<!doctype html><html lang="sv"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Nockebyhovs Båtklubb</title><meta http-equiv="refresh" content="0;url=/#${hash}"><a href="/#${hash}">Fortsätt till Nockebyhovs Båtklubb</a></html>`);
}
console.log('Built static website in dist/');
