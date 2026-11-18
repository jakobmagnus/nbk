import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL(process.argv.includes('--dist') ? '../dist/' : '../', import.meta.url));
const port = Number(process.env.PORT || 4173);
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.pdf': 'application/pdf', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8' };
const aliases = { '/kontakt.html': '/index.html', '/Dokument.html': '/index.html', '/medlem.html': '/index.html' };
createServer(async (req, res) => {
  let url;
  try { url = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400).end('Bad request'); return; }
  const file = path.resolve(root, '.' + (aliases[url] || (url === '/' ? '/index.html' : url)));
  if (!file.startsWith(root) || path.relative(root, file).split(path.sep).some(p => p.startsWith('.')) || (!process.argv.includes('--dist') && !/^(index\.html|app\.js|styles\.css|robots\.txt|sitemap\.xml|assets\/)/.test(path.relative(root, file)))) {
    res.writeHead(403).end('Forbidden'); return;
  }
  try {
    const info = await stat(file);
    if (!info.isFile()) throw new Error('Not a file');
    res.writeHead(200, { 'Content-Type': mime[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Content-Length': info.size, 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-cache' });
    if (req.method === 'HEAD') res.end(); else createReadStream(file).pipe(res);
  } catch { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Sidan kunde inte hittas.'); }
}).listen(port, '127.0.0.1', () => console.log(`NBK preview: http://localhost:${port}`));
