import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const docs = JSON.parse(await readFile(new URL('assets/documents.json', root), 'utf8'));
assert.equal(docs.length, 20, 'All 19 document-page files and the annual plan must be present');
assert.equal(new Set(docs.map(d => d.path)).size, 20, 'Document paths must be unique');
for (const doc of docs) {
  assert.equal((await stat(new URL(doc.path, root))).size, doc.bytes, doc.title + ': size mismatch');
  const buffer = await readFile(new URL(doc.path, root));
  if (doc.type === 'PDF') assert.equal(buffer.subarray(0, 5).toString(), '%PDF-', doc.title + ': invalid PDF');
  else assert.equal(buffer.subarray(1, 4).toString(), 'PNG', doc.title + ': invalid PNG');
}
const dark = await readFile(new URL('assets/vimpel-dark.svg', root), 'utf8');
assert.equal((dark.match(/fill="#FFFFFF"/g) || []).length, 1, 'Dark pennant has one white flag');
assert.equal((dark.match(/fill="#111111"/g) || []).length, 3, 'Dark pennant has three black letters');
assert(!dark.includes('<rect'), 'Pennant background must be transparent');
const sources = await Promise.all(['index.html', 'app.js', 'styles.css'].map(f => readFile(new URL(f, root), 'utf8')));
const literalAssets = [...sources.join('\n').matchAll(/(?:src|href)="\/(assets\/[^"$]+)"/g)].map(m => m[1]);
for (const asset of new Set(literalAssets)) await stat(new URL(asset, root));
console.log('Verified 20 documents, file signatures, both pennants and referenced static assets.');
